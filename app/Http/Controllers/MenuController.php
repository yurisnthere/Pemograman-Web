<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;

class MenuController extends Controller
{
    public function getMenu() {
        return MenuItem::all();
    }

    // CREATE
    public function store(Request $request)
    {
        return MenuItem::create($request->all());
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $menu = MenuItem::findOrFail($id);
        $menu->update($request->all());
        return $menu;
    }

    // DELETE
    public function destroy($id)
    {
        MenuItem::destroy($id);
        return response()->json(['success' => true]);
    }

}
