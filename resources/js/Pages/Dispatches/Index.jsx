import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import Select from 'react-select';
import { dispatchService } from '@/services/dispatchService';
import { merchandiseEntryService } from '@/services/merchandiseEntryService';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { confirmAlert, successAlert, errorAlert, warningAlert } from '@/utils/alerts';
import Pagination from '@/Components/Pagination';

// Helper function to get today's date in local timezone
const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper function to convert a date string from server to local date format
const formatDateForInput = (dateString) => {
    if (!dateString) return getTodayLocalDate();
    // Parse the date as if it's in local timezone (not UTC)
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}`;
};

// Helper function to format date for display in table
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    // Parse the date components without timezone conversion
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-PE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
};

export default function Index({ auth, dispatches: dispatchesProp, filters = {} }) {
    const dispatchesData = dispatchesProp.data || dispatchesProp;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showEntriesModal, setShowEntriesModal] = useState(false);
    const [showZoneSelectionModal, setShowZoneSelectionModal] = useState(false);
    const [editingDispatch, setEditingDispatch] = useState(null);
    const [selectedDispatch, setSelectedDispatch] = useState(null);
    const [pendingEntries, setPendingEntries] = useState([]);
    const [assignedEntries, setAssignedEntries] = useState([]);
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [availableZones, setAvailableZones] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [entriesSearchTerm, setEntriesSearchTerm] = useState('');
    
    const [formData, setFormData] = useState({
        dispatch_date: getTodayLocalDate(),
        driver_name: '',
        driver_license: '',
        transport_company_name: '',
        transport_company_ruc: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadPendingEntries();
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            router.get(route('dispatches.index'), { search: searchTerm }, {
                preserveState: true,
                replace: true
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handlePageChange = (url) => {
        router.visit(url);
    };

    const loadPendingEntries = async () => {
        try {
            const response = await merchandiseEntryService.getAll();
            // The API already filters by status='Pending' and returns paginated data
            const pending = response.data || [];
            setPendingEntries(pending);
            return pending;
        } catch (err) {
            console.error('Error al cargar entradas pendientes:', err);
            return [];
        }
    };

    const loadDispatchEntries = async (dispatchId) => {
        try {
            const dispatch = await dispatchService.getById(dispatchId);
            const entries = dispatch.merchandiseEntries || [];
            console.log('Entradas cargadas:', entries);
            console.log('Primera entrada:', entries[0]);
            if (entries[0]) {
                console.log('clientAddress:', entries[0].clientAddress);
                console.log('client_address:', entries[0].client_address);
            }
            setAssignedEntries(entries);
            return entries;
        } catch (err) {
            console.error('Error al cargar entradas del despacho:', err);
            setAssignedEntries([]);
            return [];
        }
    };

    const handleOpenModal = (dispatch = null) => {
        if (dispatch) {
            setEditingDispatch(dispatch);
            setFormData({
                dispatch_date: formatDateForInput(dispatch.dispatch_date),
                driver_name: dispatch.driver_name,
                driver_license: dispatch.driver_license,
                transport_company_name: dispatch.transport_company_name,
                transport_company_ruc: dispatch.transport_company_ruc,
            });
        } else {
            setEditingDispatch(null);
            setFormData({
                dispatch_date: getTodayLocalDate(),
                driver_name: '',
                driver_license: '',
                transport_company_name: '',
                transport_company_ruc: '',
            });
        }
        setFormErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDispatch(null);
        setFormData({
            dispatch_date: getTodayLocalDate(),
            driver_name: '',
            driver_license: '',
            transport_company_name: '',
            transport_company_ruc: '',
        });
        setFormErrors({});
    };

    const handleOpenAssignModal = async (dispatch) => {
        setSelectedDispatch(dispatch);
        setShowAssignModal(true);
        
        // Recargar datos frescos después de abrir el modal
        const pendingData = await loadPendingEntries();
        const assignedData = await loadDispatchEntries(dispatch.id);
        
        setSelectedEntries([]);
        setPendingEntries(pendingData);
        setAssignedEntries(assignedData);
    };

    const handleCloseAssignModal = () => {
        setShowAssignModal(false);
        setSelectedDispatch(null);
        setAssignedEntries([]);
        setSelectedEntries([]);
    };

    const handleOpenEntriesModal = async (dispatch) => {
        setSelectedDispatch(dispatch);
        await loadDispatchEntries(dispatch.id);
        setShowEntriesModal(true);
    };

    const handleCloseEntriesModal = () => {
        setShowEntriesModal(false);
        setSelectedDispatch(null);
        setAssignedEntries([]);
        setEntriesSearchTerm('');
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.dispatch_date) {
            errors.dispatch_date = 'La fecha de despacho es requerida';
        }

        if (!formData.driver_name.trim()) {
            errors.driver_name = 'El nombre del conductor es requerido';
        }

        if (!formData.driver_license.trim()) {
            errors.driver_license = 'La licencia del conductor es requerida';
        }

        if (!formData.transport_company_name.trim()) {
            errors.transport_company_name = 'El nombre de la empresa de transporte es requerido';
        }

        if (!formData.transport_company_ruc.trim()) {
            errors.transport_company_ruc = 'El RUC de la empresa de transporte es requerido';
        } else if (formData.transport_company_ruc.length !== 11) {
            errors.transport_company_ruc = 'El RUC debe tener 11 dígitos';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (editingDispatch) {
                await dispatchService.update(editingDispatch.id, formData);
                successAlert('Actualizado', 'El despacho ha sido actualizado exitosamente');
            } else {
                await dispatchService.create(formData);
                successAlert('Creado', 'El despacho ha sido creado exitosamente');
            }
            
            router.reload();
            handleCloseModal();
        } catch (err) {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            } else {
                setError('Error al guardar el despacho');
            }
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmAlert(
            '¿Eliminar despacho?',
            '¿Está seguro de eliminar este despacho? Las entradas asignadas volverán a estado Pendiente.',
            'Sí, eliminar',
            'Cancelar'
        );
        
        if (!confirmed) return;

        try {
            await dispatchService.delete(id);
            router.reload();
            await loadPendingEntries();
            successAlert('Eliminado', 'El despacho ha sido eliminado exitosamente');
        } catch (err) {
            setError('Error al eliminar el despacho');
            errorAlert('Error', 'No se pudo eliminar el despacho');
        }
    };

    const handleOpenZoneSelectionModal = async (dispatch) => {
        try {
            // Cargar las entradas del despacho
            const dispatchData = await dispatchService.getById(dispatch.id);
            const entries = dispatchData.merchandiseEntries || [];
            
            // Extraer zonas únicas
            const zones = [...new Set(entries.map(entry => entry.client_address?.zone).filter(Boolean))];
            
            setAvailableZones(zones);
            setSelectedZones(zones); // Por defecto todas seleccionadas
            setSelectedDispatch(dispatch);
            setShowZoneSelectionModal(true);
        } catch (err) {
            console.error('Error al cargar zonas:', err);
            errorAlert('Error', 'No se pudieron cargar las zonas del despacho');
        }
    };

    const handleZoneToggle = (zone) => {
        setSelectedZones(prev => 
            prev.includes(zone) 
                ? prev.filter(z => z !== zone)
                : [...prev, zone]
        );
    };

    const handleSelectAllZones = () => {
        setSelectedZones(availableZones);
    };

    const handleDeselectAllZones = () => {
        setSelectedZones([]);
    };

    const handleExportPDF = async () => {
        if (selectedZones.length === 0) {
            warningAlert('Seleccione zonas', 'Debe seleccionar al menos una zona para exportar');
            return;
        }

        try {
            // Hacer la petición POST con axios y obtener el PDF como blob
            const response = await axios.post(
                `/api/dispatches/${selectedDispatch.id}/export-pdf`,
                { zones: selectedZones },
                { responseType: 'blob' }
            );
            
            // Crear un enlace temporal para descargar el PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `despacho-${selectedDispatch.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setShowZoneSelectionModal(false);
            successAlert('PDF Generado', 'El PDF se ha descargado exitosamente');
        } catch (err) {
            console.error('Error al exportar PDF:', err);
            errorAlert('Error', 'No se pudo exportar el PDF');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEntrySelect = (entryId) => {
        setSelectedEntries(prev => {
            if (prev.includes(entryId)) {
                return prev.filter(id => id !== entryId);
            } else {
                return [...prev, entryId];
            }
        });
    };

    const handleAssignEntries = async () => {
        if (selectedEntries.length === 0) {
            warningAlert('Atención', 'Seleccione al menos una entrada para asignar');
            return;
        }

        try {
            await dispatchService.assignBulk(selectedDispatch.id, selectedEntries);
            
            router.reload();
            
            // Esperar un momento para que la DB se actualice
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const pendingData = await loadPendingEntries();
            const assignedData = await loadDispatchEntries(selectedDispatch.id);
            
            // Limpiar selección y actualizar estados
            setSelectedEntries([]);
            setPendingEntries(pendingData);
            setAssignedEntries(assignedData);
        } catch (err) {
            setError('Error al asignar entradas al despacho');
            console.error(err);
        }
    };

    const handleRemoveEntry = async (entryId) => {
        const confirmed = await confirmAlert(
            '¿Quitar entrada?',
            '¿Está seguro de quitar esta entrada del despacho?',
            'Sí, quitar',
            'Cancelar'
        );
        
        if (!confirmed) return;

        try {
            await dispatchService.removeMerchandiseEntry(selectedDispatch.id, entryId);
            
            // Esperar un momento para que la DB se actualice
            await new Promise(resolve => setTimeout(resolve, 300));
            
            router.reload();
            const pendingData = await loadPendingEntries();
            const assignedData = await loadDispatchEntries(selectedDispatch.id);
            
            // Forzar actualización del estado
            setPendingEntries(pendingData);
            setAssignedEntries(assignedData);
        } catch (err) {
            setError('Error al remover la entrada del despacho');
            console.error(err);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Despachos</h2>}
        >
            <Head title="Despachos" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lista de Despachos
                                </h3>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Despacho
                                </button>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar por Conductor, Empresa o RUC..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Cargando despachos...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conductor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Total (kg)</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Flete Total (S/.)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entradas</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dispatchesData.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                                        {searchTerm ? 'No se encontraron despachos' : 'No hay despachos registrados'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                dispatchesData.map((dispatch, index) => (
                                                    <tr key={dispatch.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDateForDisplay(dispatch.dispatch_date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.driver_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispatch.transport_company_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                            {new Intl.NumberFormat('es-PE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }).format(dispatch.total_weight || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                            S/. {new Intl.NumberFormat('es-PE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }).format(dispatch.total_freight || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {dispatch.merchandiseEntries?.length || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleOpenEntriesModal(dispatch)}
                                                                className="text-green-600 hover:text-green-900 mr-4"
                                                                title="Ver entradas"
                                                            >
                                                                <EyeIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenAssignModal(dispatch)}
                                                                className="text-purple-600 hover:text-purple-900 mr-4"
                                                                title="Asignar entradas"
                                                            >
                                                                <DocumentTextIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenZoneSelectionModal(dispatch)}
                                                                className="text-green-600 hover:text-green-900 mr-4"
                                                                title="Exportar PDF"
                                                            >
                                                                <ArrowDownTrayIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenModal(dispatch)}
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                                title="Editar"
                                                            >
                                                                <PencilIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(dispatch.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="h-5 w-5 inline" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {dispatchesProp.links && (
                                <Pagination
                                    links={dispatchesProp.links}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {editingDispatch ? 'Editar Despacho' : 'Nuevo Despacho'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="dispatch_date" className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Despacho <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                id="dispatch_date"
                                                name="dispatch_date"
                                                value={formData.dispatch_date}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.dispatch_date
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                            />
                                            {formErrors.dispatch_date && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.dispatch_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="driver_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre del Conductor <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="driver_name"
                                                name="driver_name"
                                                value={formData.driver_name}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.driver_name
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="Ingrese nombre del conductor"
                                            />
                                            {formErrors.driver_name && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.driver_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="driver_license" className="block text-sm font-medium text-gray-700 mb-2">
                                                Licencia del Conductor <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="driver_license"
                                                name="driver_license"
                                                value={formData.driver_license}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.driver_license
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="Ingrese licencia"
                                            />
                                            {formErrors.driver_license && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.driver_license}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="transport_company_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Empresa de Transporte <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="transport_company_name"
                                                name="transport_company_name"
                                                value={formData.transport_company_name}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.transport_company_name
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="Ingrese nombre de empresa"
                                            />
                                            {formErrors.transport_company_name && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.transport_company_name}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="transport_company_ruc" className="block text-sm font-medium text-gray-700 mb-2">
                                                RUC Empresa de Transporte <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="transport_company_ruc"
                                                name="transport_company_ruc"
                                                value={formData.transport_company_ruc}
                                                onChange={handleInputChange}
                                                maxLength={11}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.transport_company_ruc
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="Ingrese RUC (11 dígitos)"
                                            />
                                            {formErrors.transport_company_ruc && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.transport_company_ruc}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingDispatch ? 'Actualizar' : 'Crear'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Assigning Entries */}
            {showAssignModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseAssignModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Gestionar Entradas - Despacho del {selectedDispatch && formatDateForDisplay(selectedDispatch.dispatch_date)}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Pending Entries */}
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center justify-between">
                                            <span>Entradas Pendientes ({pendingEntries.length})</span>
                                            {selectedEntries.length > 0 && (
                                                <button
                                                    onClick={handleAssignEntries}
                                                    className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-1" />
                                                    Asignar ({selectedEntries.length})
                                                </button>
                                            )}
                                        </h4>
                                        <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                                            {pendingEntries.length === 0 ? (
                                                <p className="text-center text-gray-500 py-4">No hay entradas pendientes</p>
                                            ) : (
                                                <div className="divide-y divide-gray-200">
                                                    {pendingEntries.map(entry => (
                                                        <div key={entry.id} className="p-3 hover:bg-gray-50 flex items-start">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedEntries.includes(entry.id)}
                                                                onChange={() => handleEntrySelect(entry.id)}
                                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <div className="ml-3 flex-1">
                                                                <p className="text-sm font-medium text-gray-900">Guía: {entry.guide_number}</p>
                                                                <p className="text-xs text-gray-500">Cliente: {entry.client?.business_name}</p>
                                                                <p className="text-xs text-gray-500">Proveedor: {entry.supplier?.business_name}</p>
                                                                <p className="text-xs text-gray-500">Peso: {entry.total_weight} kg | Flete: S/ {entry.total_freight}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Assigned Entries */}
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                                            Entradas Asignadas ({assignedEntries.length})
                                        </h4>
                                        <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                                            {assignedEntries.length === 0 ? (
                                                <p className="text-center text-gray-500 py-4">No hay entradas asignadas</p>
                                            ) : (
                                                <div className="divide-y divide-gray-200">
                                                    {assignedEntries.map(entry => (
                                                        <div key={entry.id} className="p-3 hover:bg-gray-50 flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900">Guía: {entry.guide_number}</p>
                                                                <p className="text-xs text-gray-500">Cliente: {entry.client?.business_name}</p>
                                                                <p className="text-xs text-gray-500">Proveedor: {entry.supplier?.business_name}</p>
                                                                <p className="text-xs text-gray-500">Peso: {entry.total_weight} kg | Flete: S/ {entry.total_freight}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveEntry(entry.id)}
                                                                className="text-red-600 hover:text-red-900 ml-2"
                                                                title="Quitar del despacho"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseAssignModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Viewing Entries */}
            {showEntriesModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseEntriesModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Entradas del Despacho - {selectedDispatch && formatDateForDisplay(selectedDispatch.dispatch_date)}
                                </h3>

                                {/* Buscador */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar por N° Guía, RUC o Razón Social..."
                                        value={entriesSearchTerm}
                                        onChange={(e) => setEntriesSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="overflow-x-auto">
                                    {assignedEntries.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No hay entradas asignadas a este despacho
                                        </div>
                                    ) : (
                                        (() => {
                                            // Filtrar entradas por término de búsqueda
                                            const filteredEntries = assignedEntries.filter(entry => {
                                                if (!entriesSearchTerm) return true;
                                                const searchLower = entriesSearchTerm.toLowerCase();
                                                return (
                                                    entry.guide_number?.toLowerCase().includes(searchLower) ||
                                                    entry.client?.business_name?.toLowerCase().includes(searchLower) ||
                                                    entry.client?.ruc_dni?.toLowerCase().includes(searchLower) ||
                                                    entry.supplier?.business_name?.toLowerCase().includes(searchLower) ||
                                                    entry.supplier?.ruc_dni?.toLowerCase().includes(searchLower)
                                                );
                                            });

                                            // Agrupar entradas por zona
                                            const entriesByZone = filteredEntries.reduce((acc, entry) => {
                                                // Intentar con camelCase y snake_case
                                                const clientAddr = entry.clientAddress || entry.client_address;
                                                const zone = clientAddr?.zone || 'Sin Zona';
                                                if (!acc[zone]) {
                                                    acc[zone] = [];
                                                }
                                                acc[zone].push(entry);
                                                return acc;
                                            }, {});

                                            // Ordenar las zonas alfabéticamente
                                            const sortedZones = Object.keys(entriesByZone).sort();

                                            return sortedZones.map((zone) => (
                                                <div key={zone} className="mb-6">
                                                    <h4 className="text-md font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded mb-2">
                                                        Zona: {zone}
                                                    </h4>
                                                    <table className="min-w-full divide-y divide-gray-200 mb-4 table-fixed">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                                <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Guía</th>
                                                                <th className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                                                <th className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                                                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                                                                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flete (S/)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {entriesByZone[zone].map((entry, index) => (
                                                                <tr key={entry.id}>
                                                                    <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                                                                    <td className="px-4 py-4 text-sm text-gray-900 truncate" title={entry.guide_number}>{entry.guide_number}</td>
                                                                    <td className="px-4 py-4 text-sm text-gray-900 truncate" title={entry.client?.business_name}>{entry.client?.business_name || 'N/A'}</td>
                                                                    <td className="px-4 py-4 text-sm text-gray-900 truncate" title={entry.supplier?.business_name}>{entry.supplier?.business_name || 'N/A'}</td>
                                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                                        {parseFloat(entry.total_weight).toFixed(2)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {parseFloat(entry.total_freight).toFixed(2)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-gray-100">
                                                            <tr>
                                                                <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                                    Subtotal {zone}:
                                                                </td>
                                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                                    {entriesByZone[zone].reduce((sum, entry) => sum + parseFloat(entry.total_weight), 0).toFixed(2)} kg
                                                                </td>
                                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                                    S/ {entriesByZone[zone].reduce((sum, entry) => sum + parseFloat(entry.total_freight), 0).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            ));
                                        })()
                                    )}

                                    {assignedEntries.length > 0 && (() => {
                                        const filteredEntries = assignedEntries.filter(entry => {
                                            if (!entriesSearchTerm) return true;
                                            const searchLower = entriesSearchTerm.toLowerCase();
                                            return (
                                                entry.guide_number?.toLowerCase().includes(searchLower) ||
                                                entry.client?.business_name?.toLowerCase().includes(searchLower) ||
                                                entry.client?.ruc_dni?.toLowerCase().includes(searchLower) ||
                                                entry.supplier?.business_name?.toLowerCase().includes(searchLower) ||
                                                entry.supplier?.ruc_dni?.toLowerCase().includes(searchLower)
                                            );
                                        });

                                        if (filteredEntries.length === 0) {
                                            return (
                                                <div className="text-center py-8 text-gray-500">
                                                    No se encontraron entradas con el término de búsqueda
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="border-t-2 border-gray-300 pt-4 mt-4">
                                                <table className="min-w-full table-fixed">
                                                    <tfoot className="bg-blue-50">
                                                        <tr>
                                                            <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                                                TOTALES GENERALES:
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                                {filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.total_weight), 0).toFixed(2)} kg
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                                S/ {filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.total_freight), 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseEntriesModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Selección de Zonas para PDF */}
            {showZoneSelectionModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Seleccionar Zonas para Exportar
                                </h3>

                                <div className="mb-4">
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={handleSelectAllZones}
                                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Seleccionar Todas
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeselectAllZones}
                                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Deseleccionar Todas
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded p-3">
                                        {availableZones.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No hay zonas disponibles para este despacho</p>
                                        ) : (
                                            availableZones.map(zone => (
                                                <label key={zone} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedZones.includes(zone)}
                                                        onChange={() => handleZoneToggle(zone)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">{zone}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        {selectedZones.length} de {availableZones.length} zonas seleccionadas
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleExportPDF}
                                    disabled={selectedZones.length === 0}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Exportar PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowZoneSelectionModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}