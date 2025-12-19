<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promo;
use Illuminate\Support\Facades\Validator;

class PromoController extends Controller
{
    // Get all active promos
    public function index()
    {
        return Promo::where('is_active', true)
            ->where('valid_until', '>=', now())
            ->get();
    }

    // Get all promos (for admin)
    public function all()
    {
        return Promo::orderBy('created_at', 'desc')->get();
    }

    // Create promo
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:promos',
            'description' => 'required|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'min_purchase' => 'required|integer|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promo = Promo::create($request->all());

        return response()->json([
            'message' => 'Promo berhasil dibuat',
            'promo' => $promo
        ], 201);
    }

    // Update promo
    public function update(Request $request, $id)
    {
        $promo = Promo::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:promos,code,' . $id,
            'description' => 'required|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'min_purchase' => 'required|integer|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promo->update($request->all());

        return response()->json([
            'message' => 'Promo berhasil diupdate',
            'promo' => $promo
        ]);
    }

    // Delete promo
    public function destroy($id)
    {
        Promo::destroy($id);
        return response()->json(['message' => 'Promo berhasil dihapus']);
    }

    // Toggle promo status
    public function toggleStatus($id)
    {
        $promo = Promo::findOrFail($id);
        $promo->update(['is_active' => !$promo->is_active]);

        return response()->json([
            'message' => 'Status promo berhasil diubah',
            'promo' => $promo
        ]);
    }

    // Validate promo code
    public function validatePromo(Request $request)
    {
        $promo = Promo::where('code', $request->code)
            ->where('is_active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->first();

        if (!$promo) {
            return response()->json(['error' => 'Kode promo tidak valid'], 404);
        }

        if ($request->total < $promo->min_purchase) {
            return response()->json([
                'error' => 'Minimal pembelian Rp ' . number_format($promo->min_purchase, 0, ',', '.')
            ], 400);
        }

        $discount = ($request->total * $promo->discount_percentage) / 100;
        $finalTotal = $request->total - $discount;

        return response()->json([
            'valid' => true,
            'promo' => $promo,
            'discount' => $discount,
            'final_total' => $finalTotal
        ]);
    }
}
