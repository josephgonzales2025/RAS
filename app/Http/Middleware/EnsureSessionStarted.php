<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionStarted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Forzar el inicio de sesión si no existe
        if (!$request->hasSession() || !$request->session()->isStarted()) {
            $request->session()->start();
        }

        // Asegurar que el token CSRF existe en la sesión
        if (!$request->session()->has('_token')) {
            $request->session()->regenerateToken();
        }

        return $next($request);
    }
}