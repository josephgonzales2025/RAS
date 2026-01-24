import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-40 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                {/* Logo/Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h1 className={`text-xl font-bold transition-opacity duration-200 ${!sidebarOpen && 'opacity-0 w-0'}`}>
                        Sistema RAS
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {sidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        <NavItem
                            href={route('dashboard')}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            }
                            label="Dashboard"
                            collapsed={!sidebarOpen}
                            active={route().current('dashboard')}
                        />
                        <NavItem
                            href={route('clients.index')}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            }
                            label="Clientes"
                            collapsed={!sidebarOpen}
                            active={route().current('clients.*')}
                        />
                        <NavItem
                            href={route('suppliers.index')}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            }
                            label="Proveedores"
                            collapsed={!sidebarOpen}
                            active={route().current('suppliers.*')}
                        />
                        <NavItem
                            href={route('merchandise-entries.index')}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            }
                            label="Entradas"
                            collapsed={!sidebarOpen}
                            active={route().current('merchandise-entries.*')}
                        />
                        <NavItem
                            href={route('dispatches.index')}
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            }
                            label="Despachos"
                            collapsed={!sidebarOpen}
                            active={route().current('dispatches.*')}
                        />
                    </ul>

                    {/* User Section & Logout */}
                    <div className="mt-auto border-t border-gray-700 pt-4 px-2">
                        <div className={`flex items-center px-2 py-2 mb-2 ${sidebarOpen ? '' : 'justify-center'}`}>
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                        {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            {sidebarOpen && (
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-medium truncate">{auth.user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                                </div>
                            )}
                        </div>
                        <Link
                            href={route('profile.edit')}
                            className={`flex items-center p-2 rounded transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white ${!sidebarOpen && 'justify-center'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {sidebarOpen && <span className="ml-3">Perfil</span>}
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`w-full flex items-center p-2 rounded transition-colors duration-200 text-red-300 hover:bg-red-700 hover:text-white ${!sidebarOpen && 'justify-center'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {sidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                {header && (
                    <header className="bg-white shadow-sm">
                        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, collapsed, active }) {
    return (
        <li>
            <Link
                href={href}
                className={`flex items-center p-2 rounded transition-colors duration-200 ${
                    active 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${collapsed && 'justify-center'}`}
            >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
                {!collapsed && <span className="ml-3">{label}</span>}
            </Link>
        </li>
    );
}
