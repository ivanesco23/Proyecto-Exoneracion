<?php

use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

function color_perfil()
{
    return "01833b";
}

function db_schema()
{
    return env("SQL_SCHEME", "dbo.");
}

// function str_tipo_role()
// {
//     $Role = Role::where("id", user()->id_role)->first();
//     return $Role->nombre;
// }

function nombre_sistema()
{
    return "Sistema Reclutamiento";
}

function random_number()
{
    return time();
}

function calcular_edad($fecha_nacimiento){
    list($ano, $mes, $dia) = explode("-", $fecha_nacimiento);
    $ano_diferencia  = date("Y") - $ano;
    $mes_diferencia = date("m") - $mes;
    $dia_diferencia   = date("d") - $dia;

    if ($dia_diferencia < 0 || $mes_diferencia < 0)
    {
        $ano_diferencia--;
    }

    return $ano_diferencia;
}

function tipo_role()
{
    return user()->id_role;
}

function id()
{
    return check() ? user()->id : 0;
}

// function EsRoot(){ return (codigo_cuenta() == configG('codigo_sai_root')) ? true : false; }

function subdominio()
{
    $host = '';
    if (isset($_SERVER['HTTP_HOST'])) {
        $host = $_SERVER['HTTP_HOST'];
    }
    $urlParts = explode('.', $host);
    $subdomain = $urlParts[0];
    return $subdomain;
}

function Iniciales($string)
{
    $words = explode(" ", ucwords($string));
    $initials = null;
    foreach ($words as $w) {
        $initials .= $w[0];
    }
    return $initials;
}

function StrMes($mes)
{
    $lista_meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return $lista_meses[$mes - 1];
}

function StringToBool($string)
{
    $bool = $string == 'on' ? true : false;
    return $bool;
}

function generar_token()
{
    $token = bcrypt(Str::random(32));
    return $token;
}

function user()
{
    return Auth::user();
}

function autenticar($usuario, $clave)
{
    return Auth::attempt(['usuario' => $usuario, 'password' => $clave]);
}

function logoff()
{
    Session::flush();
    Auth::logout();
}

function check()
{
    return Auth::check();
}

function NullToVacio($string)
{
    return ($string == null) ? '' : $string;
}

function NullToString($string, $null_string)
{
    return ($string == null) ? $string = $null_string : $string;
}

function NullToInt($int)
{
    return ($int == null) ? 0 : $int;
}

function ReturnModel($sql, $model)
{
    return ($sql->count() <= 0) ? $model : $sql->first();
}

function ReturnModelRows($sql, $model)
{
    return ($sql->count() <= 0) ? $model : $sql->get();
}
