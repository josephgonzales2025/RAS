# 📋 Plan de Migración a Inertia.js + React

## 🎯 Objetivo
Refactorizar el proyecto de una arquitectura SPA con API REST a un monolito moderno usando **Inertia.js + React + Laravel 12**, eliminando completamente los problemas de CSRF y mejorando la arquitectura.

---

## 🔍 Análisis del Estado Actual

### Problemas Identificados:
1. ❌ Error 419 (CSRF) en peticiones POST/DELETE
2. ❌ Cookies de sesión no se establecen correctamente
3. ❌ Arquitectura híbrida confusa (rutas API en web.php)
4. ❌ Código JavaScript duplicado para manejo de tokens
5. ❌ Manejo manual de estado y navegación

### Arquitectura Actual:
- Frontend: JavaScript vanilla + jQuery + DataTables
- Backend: Laravel 12 con rutas API
- Autenticación: Laravel Auth tradicional
- Base de datos: MySQL

---

## ✨ Arquitectura Propuesta

### Stack Tecnológico:
```
┌─────────────────────────────────────────┐
│         Laravel 12 Backend              │
│  (Controladores, Modelos, Validación)  │
└─────────────────┬───────────────────────┘
                  │
         ┌────────▼────────┐
         │   Inertia.js    │
         │   (Adaptador)   │
         └────────┬────────┘
                  │
┌─────────────────▼───────────────────────┐
│            React Frontend               │
│  (Componentes, Hooks, Tailwind CSS)    │
└─────────────────────────────────────────┘
```

### Beneficios:
- ✅ **Sin CSRF manual**: Inertia lo maneja automáticamente
- ✅ **Componentes reutilizables**: React components
- ✅ **Routing del servidor**: No necesitas React Router
- ✅ **Validación automática**: Los errores se pasan automáticamente
- ✅ **Código más limpio**: Menos boilerplate
- ✅ **TypeScript opcional**: Para mejor type safety

---

## 📦 Fase 1: Instalación y Configuración (2-3 horas)

### 1.1 Instalar Dependencias

```bash
# Instalar Inertia.js server-side
composer require inertiajs/inertia-laravel

# Instalar dependencias de Node.js
npm install @inertiajs/react react react-dom
npm install -D @vitejs/plugin-react

# Opcional: TypeScript
npm install -D typescript @types/react @types/react-dom
```

### 1.2 Publicar Middleware de Inertia

```bash
php artisan inertia:middleware
```

### 1.3 Configurar Vite (vite.config.js)

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
```

### 1.4 Registrar Middleware

En `bootstrap/app.php`, agregar el middleware de Inertia:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
})
```

### 1.5 Crear Layout Base de Blade

`resources/views/app.blade.php`:
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### 1.6 Configurar App Principal de React

`resources/js/app.jsx`:
```jsx
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - ${import.meta.env.VITE_APP_NAME}`,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
```

---

## 🏗️ Fase 2: Estructura de Carpetas (30 minutos)

```
resources/js/
├── app.jsx                 # Punto de entrada
├── Components/             # Componentes reutilizables
│   ├── Layout/
│   │   ├── AppLayout.jsx   # Layout principal
│   │   ├── Sidebar.jsx     # Sidebar
│   │   └── Navbar.jsx      # Navbar
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Input.jsx
│   │   └── Select.jsx
│   └── Common/
│       ├── DataTable.jsx   # Wrapper para DataTables
│       └── SearchBar.jsx
├── Pages/                  # Páginas de Inertia
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Dashboard.jsx
│   ├── Clients/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   └── Edit.jsx
│   ├── Suppliers/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   └── Edit.jsx
│   ├── MerchandiseEntries/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   └── Edit.jsx
│   └── Dispatches/
│       ├── Index.jsx
│       ├── Create.jsx
│       └── Show.jsx
├── Hooks/                  # Custom React hooks
│   ├── useForm.js
│   └── useTable.js
└── Utils/                  # Utilidades
    ├── format.js
    └── validation.js
```

---

## 🔄 Fase 3: Migración por Módulo (Estimado: 20-30 horas)

### Estrategia: Migrar módulo por módulo, manteniendo funcionalidad

### 3.1 Autenticación (2 horas)

**Antes (Blade tradicional):**
```blade
<!-- login.blade.php -->
<form method="POST" action="{{ route('login') }}">
    @csrf
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
```

**Después (Inertia + React):**

`app/Http/Controllers/Auth/LoginController.php`:
```php
use Inertia\Inertia;

public function showLoginForm()
{
    return Inertia::render('Auth/Login');
}

public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        return redirect()->intended('/');
    }

    return back()->withErrors([
        'email' => 'Las credenciales no coinciden.',
    ]);
}
```

`resources/js/Pages/Auth/Login.jsx`:
```jsx
import { useForm } from '@inertiajs/react';
import { Button, Input } from '@/Components/UI';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <Input
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                />
                <Input
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    error={errors.password}
                />
                <Button type="submit" disabled={processing}>
                    {processing ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
            </form>
        </div>
    );
}
```

### 3.2 Layout Principal (3 horas)

`resources/js/Components/Layout/AppLayout.jsx`:
```jsx
import { Link, usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar user={auth.user} />
            <div className="lg:ml-64">
                <Navbar user={auth.user} />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
```

### 3.3 Módulo de Clientes (5 horas)

**Controlador:**
```php
namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'clients' => Client::with('addresses')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'ruc' => 'required|string|max:20',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);

        Client::create($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Cliente creado exitosamente');
    }

    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client->load('addresses'),
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'ruc' => 'required|string|max:20',
            'email' => 'required|email',
            'phone' => 'required|string',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Cliente actualizado exitosamente');
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Cliente eliminado exitosamente');
    }
}
```

**Página Index:**
```jsx
// resources/js/Pages/Clients/Index.jsx
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Button } from '@/Components/UI';

export default function Index({ clients }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            router.delete(`/clients/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <Link href="/clients/create">
                    <Button>Nuevo Cliente</Button>
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Razón Social</th>
                            <th className="px-6 py-3 text-left">RUC</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Teléfono</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-6 py-4">{client.business_name}</td>
                                <td className="px-6 py-4">{client.ruc}</td>
                                <td className="px-6 py-4">{client.email}</td>
                                <td className="px-6 py-4">{client.phone}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        href={`/clients/${client.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
```

**Página Create/Edit:**
```jsx
// resources/js/Pages/Clients/Create.jsx
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';
import { Input, Button } from '@/Components/UI';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        business_name: '',
        ruc: '',
        email: '',
        phone: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/clients');
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Nuevo Cliente</h1>
                
                <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
                    <Input
                        label="Razón Social"
                        value={data.business_name}
                        onChange={e => setData('business_name', e.target.value)}
                        error={errors.business_name}
                    />
                    
                    <Input
                        label="RUC"
                        value={data.ruc}
                        onChange={e => setData('ruc', e.target.value)}
                        error={errors.ruc}
                    />
                    
                    <Input
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        error={errors.email}
                    />
                    
                    <Input
                        label="Teléfono"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        error={errors.phone}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <Link href="/clients">
                            <Button variant="secondary">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
```

### 3.4 Módulo de Despachos (8 horas)

**El problema actual de CSRF se resuelve automáticamente:**

```jsx
// resources/js/Pages/Dispatches/Show.jsx
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Components/Layout/AppLayout';

export default function Show({ dispatch, availableEntries }) {
    const { data, setData, post, delete: destroy } = useForm({
        merchandise_entry_id: '',
    });

    // ✅ NO MÁS PROBLEMAS DE CSRF - Inertia lo maneja automáticamente
    const handleAssign = (e) => {
        e.preventDefault();
        post(`/dispatches/${dispatch.id}/assign`, {
            onSuccess: () => {
                setData('merchandise_entry_id', '');
                // Inertia recarga automáticamente los datos
            },
        });
    };

    const handleRemove = (entryId) => {
        if (confirm('¿Eliminar esta entrada?')) {
            destroy(`/dispatches/${dispatch.id}/remove/${entryId}`);
        }
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold mb-6">
                Despacho #{dispatch.id}
            </h1>

            {/* Formulario para asignar */}
            <form onSubmit={handleAssign} className="mb-6">
                <select
                    value={data.merchandise_entry_id}
                    onChange={e => setData('merchandise_entry_id', e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Seleccionar entrada...</option>
                    {availableEntries.map(entry => (
                        <option key={entry.id} value={entry.id}>
                            {entry.guide_number} - {entry.client.business_name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                    Asignar
                </button>
            </form>

            {/* Tabla de entradas asignadas */}
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th>Guía</th>
                        <th>Cliente</th>
                        <th>Peso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {dispatch.merchandise_entries.map(entry => (
                        <tr key={entry.id}>
                            <td>{entry.guide_number}</td>
                            <td>{entry.client.business_name}</td>
                            <td>{entry.total_weight} kg</td>
                            <td>
                                <button
                                    onClick={() => handleRemove(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
```

**Controlador simplificado:**
```php
public function show(Dispatch $dispatch)
{
    return Inertia::render('Dispatches/Show', [
        'dispatch' => $dispatch->load(['merchandiseEntries.client']),
        'availableEntries' => MerchandiseEntry::where('status', 'Pending')
            ->with('client')
            ->get(),
    ]);
}

public function assignMerchandiseEntry(Request $request, Dispatch $dispatch)
{
    $validated = $request->validate([
        'merchandise_entry_id' => 'required|exists:merchandise_entries,id',
    ]);

    $entry = MerchandiseEntry::findOrFail($validated['merchandise_entry_id']);
    $entry->update([
        'dispatch_id' => $dispatch->id,
        'status' => 'Dispatched'
    ]);

    return back()->with('success', 'Entrada asignada exitosamente');
}

public function removeMerchandiseEntry(Dispatch $dispatch, MerchandiseEntry $entry)
{
    $entry->update([
        'dispatch_id' => null,
        'status' => 'Pending'
    ]);

    return back()->with('success', 'Entrada eliminada del despacho');
}
```

---

## 🔧 Fase 4: Componentes Reutilizables (4 horas)

### 4.1 Input Component

```jsx
// resources/js/Components/UI/Input.jsx
export default function Input({ 
    label, 
    error, 
    className = '', 
    ...props 
}) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full px-3 py-2 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
```

### 4.2 Button Component

```jsx
// resources/js/Components/UI/Button.jsx
export default function Button({ 
    children, 
    variant = 'primary', 
    className = '',
    disabled,
    ...props 
}) {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    return (
        <button
            className={`
                px-4 py-2 rounded-lg font-medium
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
```

### 4.3 Modal Component

```jsx
// resources/js/Components/UI/Modal.jsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-medium mb-4">
                                    {title}
                                </Dialog.Title>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
```

---

## 📝 Fase 5: Actualizar Rutas (1 hora)

**Antes (routes/web.php con API):**
```php
Route::prefix('api')->group(function () {
    Route::apiResource('clients', ClientController::class);
    // ... más rutas API
});
```

**Después (routes/web.php con Inertia):**
```php
Route::middleware(['auth'])->group(function () {
    Route::get('/', fn() => Inertia::render('Dashboard'));
    
    // Clientes
    Route::resource('clients', ClientController::class);
    
    // Proveedores
    Route::resource('suppliers', SupplierController::class);
    
    // Entradas de Mercadería
    Route::resource('merchandise-entries', MerchandiseEntryController::class);
    
    // Despachos
    Route::resource('dispatches', DispatchController::class);
    Route::post('dispatches/{dispatch}/assign', [DispatchController::class, 'assignMerchandiseEntry']);
    Route::delete('dispatches/{dispatch}/remove/{entry}', [DispatchController::class, 'removeMerchandiseEntry']);
});
```

---

## 🧪 Fase 6: Testing (4 horas)

```jsx
// tests/Feature/ClientTest.php
use Inertia\Testing\AssertableInertia as Assert;

test('can view clients index', function () {
    $user = User::factory()->create();
    $clients = Client::factory(3)->create();

    $this->actingAs($user)
        ->get('/clients')
        ->assertInertia(fn (Assert $page) =>
            $page->component('Clients/Index')
                ->has('clients', 3)
        );
});

test('can create client', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/clients', [
            'business_name' => 'Test Client',
            'ruc' => '12345678901',
            'email' => 'test@example.com',
            'phone' => '987654321',
        ])
        ->assertRedirect('/clients')
        ->assertSessionHas('success');

    $this->assertDatabaseHas('clients', [
        'business_name' => 'Test Client',
    ]);
});
```

---

## 📊 Cronograma Estimado

| Fase | Tarea | Tiempo Estimado |
|------|-------|-----------------|
| 1 | Instalación y configuración | 2-3 horas |
| 2 | Estructura de carpetas | 30 min |
| 3.1 | Migración: Autenticación | 2 horas |
| 3.2 | Migración: Layout | 3 horas |
| 3.3 | Migración: Clientes | 5 horas |
| 3.3 | Migración: Proveedores | 4 horas |
| 3.4 | Migración: Entradas de Mercadería | 6 horas |
| 3.5 | Migración: Despachos | 8 horas |
| 4 | Componentes UI reutilizables | 4 horas |
| 5 | Actualizar rutas | 1 hora |
| 6 | Testing y correcciones | 4 horas |
| **TOTAL** | | **39-40 horas** |

---

## 🚀 Fase 7: Deployment

### 7.1 Preparación para Producción

```bash
# Compilar assets
npm run build

# Cachear configuración y rutas
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimizar Composer
composer install --optimize-autoloader --no-dev
```

### 7.2 Variables de Entorno

```env
APP_ENV=production
APP_DEBUG=false
SESSION_DRIVER=database
SESSION_LIFETIME=120
VITE_APP_NAME="${APP_NAME}"
```

---

## 📚 Recursos Adicionales

### Documentación Oficial:
- [Inertia.js Docs](https://inertiajs.com/)
- [Laravel Inertia Adapter](https://inertiajs.com/server-side-setup)
- [React Docs](https://react.dev/)

### Librerías Útiles:
```bash
# Headless UI (componentes accesibles)
npm install @headlessui/react

# Heroicons (iconos)
npm install @heroicons/react

# React Hook Form (formularios avanzados)
npm install react-hook-form

# Date picker
npm install react-datepicker

# React Query (para caching)
npm install @tanstack/react-query
```

---

## ✅ Checklist de Migración

### Pre-migración:
- [ ] Hacer backup completo de la base de datos
- [ ] Hacer backup del código actual
- [ ] Documentar funcionalidad actual
- [ ] Crear rama de desarrollo `git checkout -b migration/inertia`

### Durante la migración:
- [ ] Instalar dependencias
- [ ] Configurar Vite
- [ ] Crear estructura de carpetas
- [ ] Migrar autenticación
- [ ] Migrar layout principal
- [ ] Migrar módulo por módulo
- [ ] Crear componentes reutilizables
- [ ] Escribir tests

### Post-migración:
- [ ] Testing exhaustivo
- [ ] Verificar rendimiento
- [ ] Revisar accesibilidad
- [ ] Actualizar documentación
- [ ] Deploy a staging
- [ ] Deploy a producción

---

## 💡 Consejos y Mejores Prácticas

### 1. **Migración Gradual**
No migres todo a la vez. Empieza con un módulo simple (como Clientes) y úsalo como plantilla.

### 2. **Compartir Props Globales**
En `app/Http/Middleware/HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],