<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login()
    {
        if (!check()) {
            //return view('auth.login');
        } else {
            return redirect('/');
        }
    }

    public function registrar()
    {
        if (!check()) {
            //return view('auth.registrar');
        } else {
            return redirect('/');
        }
    }

    public function registrar_usuario(Request $request)
    {
        try {
            $role = 3; //Candidato

            $usuario = new User();
            $usuario->id_role = $role;
            $usuario->name = $request->name;
            $usuario->email = $request->email;
            $usuario->password = bcrypt($request->get('password'));
    
            $usuario->save();

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function auth(Request $request)
    {
        if (Auth::attempt(['email' => $request->get('email'), 'password' => $request->get('password')])) {
            
            $usuario = User::where("email", $request->get('email'))->firstOrFail();
            
            $token = $usuario->createToken("auth_token")->plainTextToken;

            return response()->json([
                "message" => "Sesion Iniciada",
                "data" => [
                    "token_type" => "Bearer",
                    "access_token" => $token,
                    "usuario" => $usuario
                ]
            ]);
        } else {
            return redirect('/login')->with("Info", "Credenciales Incorrectas");
        }
    }

    public function logout()
    {
        logoff();
        return redirect('login');
    }
}
