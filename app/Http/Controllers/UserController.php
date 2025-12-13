<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 


class UserController extends Controller
{
        public function login(Request $request) {
        $user = User::where('username', $request->username)
                    ->where('password', $request->password)
                    ->first();

        if (!$user) {
            return response()->json(['error' => 'Login gagal'], 401);
        }

        return $user;
    }

}
