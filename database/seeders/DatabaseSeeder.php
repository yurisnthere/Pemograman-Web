<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        DB::table('users')->insert([
            'name' => 'Administrator',
            'email' => 'admin@warteg.com',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Test User
        DB::table('users')->insert([
            'name' => 'User Test',
            'email' => 'user@test.com',
            'username' => 'user',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Sample Menu Items (using placeholder image for demo)
        $menuItems = [
            ['name' => 'Nasi Putih', 'price' => 5000, 'category' => 'Nasi', 'image' => 'images/no-image.svg'],
            ['name' => 'Ayam Goreng', 'price' => 15000, 'category' => 'Lauk', 'image' => 'images/no-image.svg'],
            ['name' => 'Tempe Goreng', 'price' => 3000, 'category' => 'Lauk', 'image' => 'images/no-image.svg'],
            ['name' => 'Tahu Goreng', 'price' => 3000, 'category' => 'Lauk', 'image' => 'images/no-image.svg'],
            ['name' => 'Sayur Asem', 'price' => 5000, 'category' => 'Sayur', 'image' => 'images/no-image.svg'],
            ['name' => 'Sayur Lodeh', 'price' => 5000, 'category' => 'Sayur', 'image' => 'images/no-image.svg'],
            ['name' => 'Rendang', 'price' => 20000, 'category' => 'Lauk', 'image' => 'images/no-image.svg'],
            ['name' => 'Ikan Goreng', 'price' => 12000, 'category' => 'Lauk', 'image' => 'images/no-image.svg'],
            ['name' => 'Es Teh Manis', 'price' => 3000, 'category' => 'Minuman', 'image' => 'images/no-image.svg'],
            ['name' => 'Es Jeruk', 'price' => 5000, 'category' => 'Minuman', 'image' => 'images/no-image.svg'],
        ];

        foreach ($menuItems as $item) {
            DB::table('menu_items')->insert([
                'name' => $item['name'],
                'price' => $item['price'],
                'category' => $item['category'],
                'image' => $item['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create Sample Promos
        DB::table('promos')->insert([
            'code' => 'HEMAT10',
            'description' => 'Diskon 10% untuk semua menu',
            'discount_percentage' => 10,
            'min_purchase' => 20000,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(1),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('promos')->insert([
            'code' => 'SPESIAL20',
            'description' => 'Diskon 20% minimal belanja 50rb',
            'discount_percentage' => 20,
            'min_purchase' => 50000,
            'valid_from' => now(),
            'valid_until' => now()->addMonths(1),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('promos')->insert([
            'code' => 'GRATISONGKIR',
            'description' => 'Gratis ongkir untuk pembelian hari ini!',
            'discount_percentage' => 5,
            'min_purchase' => 0,
            'valid_from' => now(),
            'valid_until' => now()->addDays(7),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
