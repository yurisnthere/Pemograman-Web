<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Get all payments (admin) or user's payments (user)
     */
    public function index(Request $request)
    {
        $userId = $request->header('Authorization');

        if ($request->query('user_id')) {
            $payments = Payment::with(['order', 'user'])
                ->where('user_id', $request->query('user_id'))
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $payments = Payment::with(['order', 'user'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($payments);
    }

    /**
     * Get payment by order ID
     */
    public function getByOrder($orderId)
    {
        $payment = Payment::with(['order', 'user'])
            ->where('order_id', $orderId)
            ->first();

        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        return response()->json($payment);
    }

    /**
     * Create payment for an order
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,transfer,ewallet,qris',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if payment already exists for this order
        $existingPayment = Payment::where('order_id', $request->order_id)->first();
        if ($existingPayment) {
            return response()->json(['error' => 'Payment already exists for this order'], 400);
        }

        $payment = Payment::create([
            'order_id' => $request->order_id,
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'payment_status' => 'pending',
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Payment created successfully',
            'payment' => $payment->load(['order', 'user'])
        ], 201);
    }

    /**
     * Upload payment proof
     */
    public function uploadProof(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $payment = Payment::findOrFail($id);

        // Delete old proof if exists
        if ($payment->payment_proof) {
            Storage::disk('public')->delete($payment->payment_proof);
        }

        // Store new proof
        $proofPath = $request->file('payment_proof')->store('payments', 'public');
        $payment->payment_proof = $proofPath;
        $payment->save();

        return response()->json([
            'message' => 'Payment proof uploaded successfully',
            'payment' => $payment->load(['order', 'user'])
        ]);
    }

    /**
     * Confirm payment (admin only)
     */
    public function confirm($id)
    {
        $payment = Payment::findOrFail($id);

        $payment->payment_status = 'confirmed';
        $payment->paid_at = now();
        $payment->save();

        // Update order status to processing if still pending
        $order = $payment->order;
        if ($order->status === 'pending') {
            $order->status = 'processing';
            $order->save();
        }

        return response()->json([
            'message' => 'Payment confirmed successfully',
            'payment' => $payment->load(['order', 'user'])
        ]);
    }

    /**
     * Mark payment as failed (admin only)
     */
    public function markAsFailed($id)
    {
        $payment = Payment::findOrFail($id);

        $payment->payment_status = 'failed';
        $payment->save();

        return response()->json([
            'message' => 'Payment marked as failed',
            'payment' => $payment->load(['order', 'user'])
        ]);
    }

    /**
     * Delete payment
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);

        // Delete payment proof if exists
        if ($payment->payment_proof) {
            Storage::disk('public')->delete($payment->payment_proof);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
