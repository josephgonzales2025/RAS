import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MonthlyStatsChart from '@/Components/MonthlyStatsChart';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ monthlyStats, pendingStats, zoneStats }) {
    const [chartType, setChartType] = useState('line');

    // Calcular totales
    const totalWeight = monthlyStats.reduce((sum, item) => sum + item.total_weight, 0);
    const totalFreight = monthlyStats.reduce((sum, item) => sum + item.total_freight, 0);
    const lastMonthWeight = monthlyStats[monthlyStats.length - 1]?.total_weight || 0;
    const lastMonthFreight = monthlyStats[monthlyStats.length - 1]?.total_freight || 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Sección de Pendientes */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Mercadería Pendiente de Despacho
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-orange-700">
                                        Entradas Pendientes
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-orange-900">
                                        {pendingStats.total_entries}
                                    </div>
                                    <div className="mt-1 text-xs text-orange-600">guías</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-blue-700">
                                        Peso Pendiente
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-blue-900">
                                        {new Intl.NumberFormat('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(pendingStats.total_weight)}
                                    </div>
                                    <div className="mt-1 text-xs text-blue-600">kilogramos</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="text-sm font-medium text-green-700">
                                        Flete Pendiente
                                    </div>
                                    <div className="mt-2 text-3xl font-bold text-green-900">
                                        S/. {new Intl.NumberFormat('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(pendingStats.total_freight)}
                                    </div>
                                    <div className="mt-1 text-xs text-green-600">soles</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Zonas */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Mercadería Pendiente por Zona
                            </h3>
                            {zoneStats.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Zona
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Entradas
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Peso (kg)
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Flete (S/.)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {zoneStats.map((zone, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {zone.zone}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                                        {zone.total_entries}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                                        {new Intl.NumberFormat('es-PE', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(zone.total_weight)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                                        S/. {new Intl.NumberFormat('es-PE', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(zone.total_freight)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Fila de totales */}
                                            <tr className="bg-gray-100 font-semibold">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    TOTAL
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                    {zoneStats.reduce((sum, zone) => sum + zone.total_entries, 0)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                    {new Intl.NumberFormat('es-PE', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(zoneStats.reduce((sum, zone) => sum + zone.total_weight, 0))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                    S/. {new Intl.NumberFormat('es-PE', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(zoneStats.reduce((sum, zone) => sum + zone.total_freight, 0))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No hay mercadería pendiente de despacho
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">
                                    Peso Total (12 meses)
                                </div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(totalWeight)}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">kilogramos</div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">
                                    Flete Total (12 meses)
                                </div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">
                                    S/. {new Intl.NumberFormat('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(totalFreight)}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">soles</div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">
                                    Peso Último Mes
                                </div>
                                <div className="mt-2 text-3xl font-bold text-blue-600">
                                    {new Intl.NumberFormat('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(lastMonthWeight)}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">kilogramos</div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">
                                    Flete Último Mes
                                </div>
                                <div className="mt-2 text-3xl font-bold text-green-600">
                                    S/. {new Intl.NumberFormat('es-PE', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(lastMonthFreight)}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">soles</div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Despachos por Mes
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Peso y flete despachado en los últimos 12 meses
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setChartType('line')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            chartType === 'line'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Líneas
                                    </button>
                                    <button
                                        onClick={() => setChartType('bar')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            chartType === 'bar'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Barras
                                    </button>
                                </div>
                            </div>
                            <div className="h-96">
                                <MonthlyStatsChart 
                                    data={monthlyStats} 
                                    type={chartType}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

