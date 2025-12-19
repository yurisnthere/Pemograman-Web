<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function getMenu() {
        return MenuItem::all();
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer',
            'category' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->only(['name', 'price', 'category']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menu', 'public');
            $data['image'] = $imagePath;
        }

        return MenuItem::create($data);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer',
            'category' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $menu = MenuItem::findOrFail($id);
        $data = $request->only(['name', 'price', 'category']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }

            $imagePath = $request->file('image')->store('menu', 'public');
            $data['image'] = $imagePath;
        }

        $menu->update($data);
        return $menu;
    }

    // DELETE
    public function destroy($id)
    {
        $menu = MenuItem::findOrFail($id);

        // Delete image if exists
        if ($menu->image && Storage::disk('public')->exists($menu->image)) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();
        return response()->json(['success' => true]);
    }

}
