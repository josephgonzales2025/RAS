import React from 'react';

export default function Pagination({ links, onPageChange }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {links[0].url && (
                    <button
                        onClick={() => onPageChange(links[0].url)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                )}
                {links[links.length - 1].url && (
                    <button
                        onClick={() => onPageChange(links[links.length - 1].url)}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Siguiente
                    </button>
                )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{links.find(l => l.active)?.label || 1}</span>
                        {' '}de{' '}
                        <span className="font-medium">{links.length - 2}</span>
                        {' '}páginas
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {links.map((link, index) => {
                            // Skip if it's a "..." separator without URL
                            if (!link.url && link.label === '...') {
                                return (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            // Previous button
                            if (index === 0) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => link.url && onPageChange(link.url)}
                                        disabled={!link.url}
                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                            !link.url ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            // Next button
                            if (index === links.length - 1) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => link.url && onPageChange(link.url)}
                                        disabled={!link.url}
                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                            !link.url ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            // Page numbers
                            return (
                                <button
                                    key={index}
                                    onClick={() => link.url && onPageChange(link.url)}
                                    disabled={!link.url}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                                        link.active
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                            : 'text-gray-900 hover:bg-gray-50'
                                    } ${!link.url ? 'cursor-not-allowed' : ''}`}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
