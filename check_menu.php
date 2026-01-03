<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$menuCount = App\Models\MenuItem::count();
echo "Total menu items: $menuCount\n\n";

if ($menuCount > 0) {
    echo "Menu items:\n";
    App\Models\MenuItem::all()->each(function($item) {
        echo "- ID: {$item->id}, Name: {$item->name}, Price: Rp {$item->price}\n";
    });
} else {
    echo "Tidak ada menu di database. Jalankan: php artisan db:seed\n";
}
