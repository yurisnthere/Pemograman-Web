<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Menu Routes
Route::get('/menu', [MenuController::class, 'getMenu']);
Route::post('/menu', [MenuController::class, 'store']);
Route::put('/menu/{id}', [MenuController::class, 'update']);
Route::delete('/menu/{id}', [MenuController::class, 'destroy']);

// Order Routes
Route::post('/orders', [OrderController::class, 'create']);
Route::get('/orders', [OrderController::class, 'index']); // All orders (admin)
Route::get('/orders/user/{userId}', [OrderController::class, 'getUserOrders']);
Route::get('/orders/user/{userId}/ongoing', [OrderController::class, 'getOngoingOrders']);
Route::get('/orders/user/{userId}/history', [OrderController::class, 'getOrderHistory']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::put('/orders/{id}/process', [OrderController::class, 'process']);
Route::put('/orders/{id}/complete', [OrderController::class, 'complete']);
Route::put('/orders/{id}/reject', [OrderController::class, 'reject']);

// Promo Routes
Route::get('/promos', [PromoController::class, 'index']); // Active promos
Route::get('/promos/all', [PromoController::class, 'all']); // All promos (admin)
Route::post('/promos', [PromoController::class, 'store']);
Route::put('/promos/{id}', [PromoController::class, 'update']);
Route::delete('/promos/{id}', [PromoController::class, 'destroy']);
Route::put('/promos/{id}/toggle', [PromoController::class, 'toggleStatus']);
Route::post('/promos/validate', [PromoController::class, 'validatePromo']);

// Payment Routes
Route::get('/payments', [PaymentController::class, 'index']); // All payments or filter by user
Route::get('/payments/order/{orderId}', [PaymentController::class, 'getByOrder']); // Get payment by order
Route::post('/payments', [PaymentController::class, 'store']); // Create payment
Route::post('/payments/{id}/upload-proof', [PaymentController::class, 'uploadProof']); // Upload payment proof
Route::post('/payments/{id}/confirm', [PaymentController::class, 'confirm']); // Confirm payment (admin)
Route::post('/payments/{id}/fail', [PaymentController::class, 'markAsFailed']); // Mark as failed (admin)
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

