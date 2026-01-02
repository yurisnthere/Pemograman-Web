<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    // Create new order
    public function create(Request $request)
    {
        $order = Order::create([
            'user_id' => $request->user_id,
            'items' => json_encode($request->items),
            'total' => $request->total,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'order' => $order
        ]);
    }

    // Get all orders (for admin)
    public function index()
    {
        return Order::with('user')->orderBy('created_at', 'desc')->get();
    }

    // Get user's orders
    public function getUserOrders($userId)
    {
        return Order::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Get user's ongoing orders (pending or processing)
    public function getOngoingOrders($userId)
    {
        return Order::where('user_id', $userId)
            ->whereIn('status', ['pending', 'processing'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Get user's order history (completed or rejected)
    public function getOrderHistory($userId)
    {
        return Order::where('user_id', $userId)
            ->whereIn('status', ['completed', 'rejected'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json([
            'message' => 'Status pesanan berhasil diupdate',
            'order' => $order
        ]);
    }

    // Process order (admin)
    public function process($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'processing']);
        return response()->json([
            'message' => 'Pesanan sedang diproses',
            'order' => $order
        ]);
    }

    // Complete order (admin)
    public function complete($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'completed']);
        return response()->json([
            'message' => 'Pesanan selesai',
            'order' => $order
        ]);
    }

    // Reject order (admin)
    public function reject($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'rejected']);
        return response()->json([
            'message' => 'Pesanan ditolak',
            'order' => $order
        ]);
    }
}
