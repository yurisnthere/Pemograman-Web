<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get a user
$user = App\Models\User::first();
if (!$user) {
    echo "No users found. Please run: php artisan db:seed\n";
    exit;
}

echo "Testing order creation...\n";
echo "User: {$user->name} (ID: {$user->id})\n\n";

// Test creating an order
try {
    $order = App\Models\Order::create([
        'user_id' => $user->id,
        'items' => [
            ['id' => 1, 'name' => 'Nasi Putih', 'price' => 5000],
            ['id' => 2, 'name' => 'Ayam Goreng', 'price' => 15000]
        ],
        'total' => 20000,
        'status' => 'pending'
    ]);

    echo "✓ Order created successfully!\n";
    echo "Order ID: {$order->id}\n";
    echo "Items: " . json_encode($order->items) . "\n";
    echo "Total: Rp {$order->total}\n";
    echo "Status: {$order->status}\n";

} catch (\Exception $e) {
    echo "✗ Error creating order:\n";
    echo $e->getMessage() . "\n";
}
