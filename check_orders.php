<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking Orders ===\n\n";

$totalOrders = App\Models\Order::count();
echo "Total orders in database: $totalOrders\n\n";

if ($totalOrders > 0) {
    echo "All orders:\n";
    App\Models\Order::with('user')->orderBy('created_at', 'desc')->get()->each(function($order) {
        echo "- ID: {$order->id}, User: {$order->user->name}, Status: {$order->status}, Total: Rp {$order->total}\n";
        echo "  Items: " . json_encode($order->items) . "\n";
        echo "  Created: {$order->created_at}\n\n";
    });
} else {
    echo "No orders found. Create an order first.\n";
}
