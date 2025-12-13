<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; 

class OrderController extends Controller
{
    public function create(Request $request) {
    return Order::create([
        'user_id' => $request->user_id,
        'items' => json_encode($request->items),
        'total' => $request->total
    ]);
}

}
