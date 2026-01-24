import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Select from 'react-select';
import { merchandiseEntryService } from '@/services/merchandiseEntryService';
import { productEntryService } from '@/services/productEntryService';
import { supplierService } from '@/services/supplierService';
import { dispatchService } from '@/services/dispatchService';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { confirmAlert, successAlert, errorAlert, warningAlert } from '@/utils/alerts';

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

export default function Index({ auth }) {
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [viewingEntry, setViewingEntry] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [clients, setClients] = useState([]);
    const [clientAddresses, setClientAddresses] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Bulk assignment states
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [dispatches, setDispatches] = useState([]);
    const [selectedDispatch, setSelectedDispatch] = useState(null);
    const [dispatchOptions, setDispatchOptions] = useState([]);
    
    // Options for react-select
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [addressOptions, setAddressOptions] = useState([]);
    
    const [formData, setFormData] = useState({
        reception_date: getTodayLocalDate(),
        guide_number: '',
        supplier_id: '',
        client_id: '',
        client_address_id: '',
        total_weight: '',
        total_freight: '',
        products: [],
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadEntries();
        loadSuppliers();
        loadClients();
        loadDispatches();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredEntries(entries);
        } else {
            const filtered = entries.filter(entry =>
                entry.guide_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.supplier?.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.client?.business_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEntries(filtered);
        }
    }, [searchTerm, entries]);

    const loadEntries = async () => {
        try {
            setLoading(true);
            const data = await merchandiseEntryService.getAll();
            // Filtrar solo entradas con estado Pending
            const pendingData = data.filter(entry => entry.status === 'Pending');
            const sortedData = pendingData.sort((a, b) => b.id - a.id);
            setEntries(sortedData);
            setFilteredEntries(sortedData);
            setError(null);
        } catch (err) {
            setError('Error al cargar entradas de mercadería');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const data = await supplierService.getAll();
            setSuppliers(data);
            // Convert to react-select format
            const options = data.map(supplier => ({
                value: supplier.id,
                label: `${supplier.ruc_dni} - ${supplier.business_name}`
            }));
            setSupplierOptions(options);
        } catch (err) {
            console.error('Error al cargar proveedores:', err);
        }
    };

    const loadClients = async () => {
        try {
            const response = await axios.get('/api/clients');
            setClients(response.data);
            // Convert to react-select format
            const options = response.data.map(client => ({
                value: client.id,
                label: `${client.ruc_dni} - ${client.business_name}`
            }));
            setClientOptions(options);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
        }
    };

    const loadClientAddresses = async (clientId) => {
        try {
            const response = await axios.get(`/api/client-addresses?client_id=${clientId}`);
            setClientAddresses(response.data);
            // Convert to react-select format
            const options = response.data.map(address => ({
                value: address.id,
                label: `${address.address} - ${address.zone}`
            }));
            setAddressOptions(options);
        } catch (err) {
            console.error('Error al cargar direcciones:', err);
            setClientAddresses([]);
            setAddressOptions([]);
        }
    };

    const loadDispatches = async () => {
        try {
            const data = await dispatchService.getAll();
            setDispatches(data);
            // Convert to react-select format - solo despachos que no están completados
            const options = data.map(dispatch => ({
                value: dispatch.id,
                label: `Despacho #${dispatch.id} - ${formatDateForDisplay(dispatch.dispatch_date)} - ${dispatch.driver_name}`
            }));
            setDispatchOptions(options);
        } catch (err) {
            console.error('Error al cargar despachos:', err);
        }
    };

    const handleOpenModal = async (entry = null) => {
        if (entry) {
            setEditingEntry(entry);
            const productsData = await productEntryService.getByMerchandiseEntryId(entry.id);
            setFormData({
                reception_date: formatDateForInput(entry.reception_date),
                guide_number: entry.guide_number,
                supplier_id: entry.supplier_id,
                client_id: entry.client_id,
                client_address_id: entry.client_address_id,
                total_weight: entry.total_weight,
                total_freight: entry.total_freight,
                products: productsData,
            });
            await loadClientAddresses(entry.client_id);
        } else {
            setEditingEntry(null);
            setFormData({
                reception_date: getTodayLocalDate(),
                guide_number: '',
                supplier_id: '',
                client_id: '',
                client_address_id: '',
                total_weight: '',
                total_freight: '',
                products: [],
            });
            setClientAddresses([]);
        }
        setFormErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEntry(null);
        setFormData({
            reception_date: getTodayLocalDate(),
            guide_number: '',
            supplier_id: '',
            client_id: '',
            client_address_id: '',
            total_weight: '',
            total_freight: '',
            products: [],
        });
        setFormErrors({});
        setClientAddresses([]);
    };

    const handleViewProducts = async (entry) => {
        try {
            setViewingEntry(entry);
            const productsData = await productEntryService.getByMerchandiseEntryId(entry.id);
            setProducts(productsData);
            setShowProductsModal(true);
        } catch (err) {
            setError('Error al cargar productos');
            console.error(err);
        }
    };

    const handleCloseProductsModal = () => {
        setShowProductsModal(false);
        setViewingEntry(null);
        setProducts([]);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.reception_date) {
            errors.reception_date = 'La fecha de recepción es requerida';
        }

        if (!formData.guide_number.trim()) {
            errors.guide_number = 'El número de guía es requerido';
        }

        if (!formData.supplier_id) {
            errors.supplier_id = 'El proveedor es requerido';
        }

        if (!formData.client_id) {
            errors.client_id = 'El cliente es requerido';
        }

        if (!formData.client_address_id) {
            errors.client_address_id = 'La dirección del cliente es requerida';
        }

        if (!formData.total_weight || parseFloat(formData.total_weight) < 0) {
            errors.total_weight = 'El peso total debe ser mayor o igual a 0';
        }

        if (!formData.total_freight || parseFloat(formData.total_freight) < 0) {
            errors.total_freight = 'El flete total debe ser mayor o igual a 0';
        }

        if (formData.products.length === 0) {
            errors.products = 'Debe agregar al menos un producto';
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
            if (editingEntry) {
                await merchandiseEntryService.update(editingEntry.id, {
                    reception_date: formData.reception_date,
                    guide_number: formData.guide_number,
                    supplier_id: formData.supplier_id,
                    client_id: formData.client_id,
                    client_address_id: formData.client_address_id,
                    total_weight: formData.total_weight,
                    total_freight: formData.total_freight,
                });
                
                for (const product of formData.products) {
                    if (product.id) {
                        await productEntryService.update(product.id, {
                            product_name: product.product_name,
                            quantity: product.quantity,
                            type: product.type || null,
                        });
                    } else if (product.isNew) {
                        await productEntryService.create({
                            merchandise_entry_id: editingEntry.id,
                            product_name: product.product_name,
                            quantity: product.quantity,
                            type: product.type || null,
                        });
                    }
                }
            } else {
                const entryData = {
                    reception_date: formData.reception_date,
                    guide_number: formData.guide_number,
                    supplier_id: formData.supplier_id,
                    client_id: formData.client_id,
                    client_address_id: formData.client_address_id,
                    total_weight: formData.total_weight,
                    total_freight: formData.total_freight,
                };
                
                const newEntry = await merchandiseEntryService.create(entryData);
                
                for (const product of formData.products) {
                    await productEntryService.create({
                        merchandise_entry_id: newEntry.id,
                        product_name: product.product_name,
                        quantity: product.quantity,
                        type: product.type || null,
                    });
                }
            }
            
            await loadEntries();
            handleCloseModal();
            
            if (editingEntry) {
                successAlert('Actualizado', 'La entrada de mercadería ha sido actualizada exitosamente');
            } else {
                successAlert('Creado', 'La entrada de mercadería ha sido creada exitosamente');
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            } else {
                setError('Error al guardar la entrada de mercadería');
            }
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmAlert(
            '¿Está seguro?',
            '¿Desea eliminar esta entrada de mercadería y todos sus productos?',
            'Sí, eliminar',
            'Cancelar'
        );
        
        if (!confirmed) return;

        try {
            await merchandiseEntryService.delete(id);
            await loadEntries();
            successAlert('Eliminado', 'La entrada de mercadería ha sido eliminada exitosamente');
        } catch (err) {
            setError('Error al eliminar la entrada de mercadería');
            errorAlert('Error', 'No se pudo eliminar la entrada de mercadería');
            console.error(err);
        }
    };

    // Bulk assignment functions
    const handleSelectEntry = (entryId) => {
        setSelectedEntries(prev => {
            if (prev.includes(entryId)) {
                return prev.filter(id => id !== entryId);
            } else {
                return [...prev, entryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Solo seleccionar entradas con estado Pending
            const pendingIds = filteredEntries
                .filter(entry => entry.status === 'Pending')
                .map(entry => entry.id);
            setSelectedEntries(pendingIds);
        } else {
            setSelectedEntries([]);
        }
    };

    const handleBulkAssign = async () => {
        if (selectedEntries.length === 0) {
            warningAlert('Atención', 'Por favor seleccione al menos una entrada de mercadería');
            return;
        }

        if (!selectedDispatch) {
            warningAlert('Atención', 'Por favor seleccione un despacho');
            return;
        }

        const confirmed = await confirmAlert(
            '¿Asignar al despacho?',
            `¿Está seguro de asignar ${selectedEntries.length} entrada(s) al despacho seleccionado?`,
            'Sí, asignar',
            'Cancelar'
        );
        
        if (!confirmed) return;

        try {
            await dispatchService.assignBulk(selectedDispatch.value, selectedEntries);
            
            // Reset selections
            setSelectedEntries([]);
            setSelectedDispatch(null);
            
            // Reload entries
            await loadEntries();
            
            successAlert('Éxito', 'Las entradas han sido asignadas exitosamente al despacho');
        } catch (err) {
            setError('Error al asignar entradas al despacho');
            errorAlert('Error', 'No se pudieron asignar las entradas al despacho');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // This will be handled by handleClientChange for react-select
        
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

    const handleSupplierChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            supplier_id: selectedOption ? selectedOption.value : '',
        }));
        if (formErrors.supplier_id) {
            setFormErrors(prev => ({
                ...prev,
                supplier_id: '',
            }));
        }
    };

    const handleClientChange = (selectedOption) => {
        const clientId = selectedOption ? selectedOption.value : '';
        setFormData(prev => ({
            ...prev,
            client_id: clientId,
            client_address_id: '',
        }));
        if (clientId) {
            loadClientAddresses(clientId);
        } else {
            setAddressOptions([]);
        }
        if (formErrors.client_id) {
            setFormErrors(prev => ({
                ...prev,
                client_id: '',
            }));
        }
    };

    const handleAddressChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            client_address_id: selectedOption ? selectedOption.value : '',
        }));
        if (formErrors.client_address_id) {
            setFormErrors(prev => ({
                ...prev,
                client_address_id: '',
            }));
        }
    };

    const addProduct = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { product_name: '', quantity: '', type: '', isNew: true }],
        }));
    };

    const removeProduct = async (index) => {
        const product = formData.products[index];
        
        if (product.id && !product.isNew) {
            const confirmed = await confirmAlert(
                '¿Eliminar producto?',
                '¿Está seguro de eliminar este producto?',
                'Sí, eliminar',
                'Cancelar'
            );
            
            if (!confirmed) return;
            
            try {
                await productEntryService.delete(product.id);
                setFormData(prev => ({
                    ...prev,
                    products: prev.products.filter((_, i) => i !== index),
                }));
                successAlert('Eliminado', 'El producto ha sido eliminado exitosamente');
            } catch (err) {
                setError('Error al eliminar el producto');
                errorAlert('Error', 'No se pudo eliminar el producto');
                console.error(err);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                products: prev.products.filter((_, i) => i !== index),
            }));
        }
    };

    const updateProduct = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((product, i) =>
                i === index ? { ...product, [field]: value } : product
            ),
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Entradas de Mercadería</h2>}
        >
            <Head title="Entradas de Mercadería" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lista de Entradas de Mercadería
                                </h3>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nueva Entrada
                                </button>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar por N° Guía, Proveedor o Cliente..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Bulk assignment bar */}
                            {selectedEntries.length > 0 && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-blue-900">
                                            {selectedEntries.length} entrada(s) seleccionada(s)
                                        </span>
                                        <div className="flex-1">
                                            <Select
                                                value={selectedDispatch}
                                                onChange={setSelectedDispatch}
                                                options={dispatchOptions}
                                                placeholder="Seleccionar despacho..."
                                                isClearable
                                                className="text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handleBulkAssign}
                                            disabled={!selectedDispatch}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            Asignar a Despacho
                                        </button>
                                        <button
                                            onClick={() => setSelectedEntries([])}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Cargando entradas...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedEntries.length > 0 && selectedEntries.length === filteredEntries.filter(e => e.status === 'Pending').length}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Guía</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flete (S/)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredEntries.length === 0 ? (
                                                <tr>
                                                    <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                                                        {searchTerm ? 'No se encontraron entradas' : 'No hay entradas registradas'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredEntries.map((entry, index) => (
                                                    <tr key={entry.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            {entry.status === 'Pending' && (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEntries.includes(entry.id)}
                                                                    onChange={() => handleSelectEntry(entry.id)}
                                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatDateForDisplay(entry.reception_date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.guide_number}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.supplier?.business_name || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {entry.client?.business_name || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {parseFloat(entry.total_weight).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {parseFloat(entry.total_freight).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                entry.status === 'Pending' 
                                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {entry.status === 'Pending' ? 'Pendiente' : 'Despachado'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleViewProducts(entry)}
                                                                className="text-green-600 hover:text-green-900 mr-4"
                                                                title="Ver productos"
                                                            >
                                                                <EyeIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenModal(entry)}
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                                title="Editar"
                                                            >
                                                                <PencilIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(entry.id)}
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
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {editingEntry ? 'Editar Entrada de Mercadería' : 'Nueva Entrada de Mercadería'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reception_date" className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Recepción <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                id="reception_date"
                                                name="reception_date"
                                                value={formData.reception_date}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.reception_date
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                            />
                                            {formErrors.reception_date && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.reception_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="guide_number" className="block text-sm font-medium text-gray-700 mb-2">
                                                N° de Guía <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="guide_number"
                                                name="guide_number"
                                                value={formData.guide_number}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.guide_number
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="Ingrese número de guía"
                                            />
                                            {formErrors.guide_number && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.guide_number}</p>
                                            )}
                                        </div>

                                        {/* Supplier */}
                                        <div>
                                            <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Proveedor <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                id="supplier_id"
                                                name="supplier_id"
                                                value={supplierOptions.find(opt => opt.value === formData.supplier_id)}
                                                onChange={handleSupplierChange}
                                                options={supplierOptions}
                                                placeholder="Buscar proveedor por RUC o Razón Social..."
                                                isClearable
                                                isSearchable
                                                noOptionsMessage={() => "No se encontraron proveedores"}
                                                className={formErrors.supplier_id ? 'react-select-error' : ''}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderColor: formErrors.supplier_id ? '#f87171' : base.borderColor,
                                                        '&:hover': {
                                                            borderColor: formErrors.supplier_id ? '#f87171' : base.borderColor,
                                                        }
                                                    })
                                                }}
                                            />
                                            {formErrors.supplier_id && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.supplier_id}</p>
                                            )}
                                        </div>

                                        {/* Client */}
                                        <div>
                                            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Cliente <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                id="client_id"
                                                name="client_id"
                                                value={clientOptions.find(opt => opt.value === formData.client_id)}
                                                onChange={handleClientChange}
                                                options={clientOptions}
                                                placeholder="Buscar cliente por RUC o Razón Social..."
                                                isClearable
                                                isSearchable
                                                noOptionsMessage={() => "No se encontraron clientes"}
                                                className={formErrors.client_id ? 'react-select-error' : ''}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderColor: formErrors.client_id ? '#f87171' : base.borderColor,
                                                        '&:hover': {
                                                            borderColor: formErrors.client_id ? '#f87171' : base.borderColor,
                                                        }
                                                    })
                                                }}
                                            />
                                            {formErrors.client_id && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.client_id}</p>
                                            )}
                                        </div>

                                        {/* Client Address */}
                                        <div>
                                            <label htmlFor="client_address_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Dirección del Cliente <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                id="client_address_id"
                                                name="client_address_id"
                                                value={addressOptions.find(opt => opt.value === formData.client_address_id)}
                                                onChange={handleAddressChange}
                                                options={addressOptions}
                                                placeholder={formData.client_id ? "Seleccione una dirección..." : "Primero seleccione un cliente"}
                                                isClearable
                                                isSearchable
                                                isDisabled={!formData.client_id}
                                                noOptionsMessage={() => "No hay direcciones disponibles"}
                                                className={formErrors.client_address_id ? 'react-select-error' : ''}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderColor: formErrors.client_address_id ? '#f87171' : base.borderColor,
                                                        backgroundColor: !formData.client_id ? '#f3f4f6' : base.backgroundColor,
                                                        '&:hover': {
                                                            borderColor: formErrors.client_address_id ? '#f87171' : base.borderColor,
                                                        }
                                                    })
                                                }}
                                            />
                                            {formErrors.client_address_id && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.client_address_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="total_weight" className="block text-sm font-medium text-gray-700 mb-2">
                                                Peso Total (kg) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="total_weight"
                                                name="total_weight"
                                                value={formData.total_weight}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.total_weight
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="0.00"
                                            />
                                            {formErrors.total_weight && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.total_weight}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="total_freight" className="block text-sm font-medium text-gray-700 mb-2">
                                                Flete Total (S/) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="total_freight"
                                                name="total_freight"
                                                value={formData.total_freight}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    formErrors.total_freight
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                                placeholder="0.00"
                                            />
                                            {formErrors.total_freight && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.total_freight}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-md font-semibold text-gray-900">
                                                Productos <span className="text-red-500">*</span>
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addProduct}
                                                className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-1" />
                                                Agregar Producto
                                            </button>
                                        </div>

                                        {formErrors.products && (
                                            <p className="mb-2 text-sm text-red-600">{formErrors.products}</p>
                                        )}

                                        <div className="space-y-3">
                                            {formData.products.map((product, index) => (
                                                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Nombre del producto"
                                                            value={product.product_name}
                                                            onChange={(e) => updateProduct(index, 'product_name', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <input
                                                            type="number"
                                                            placeholder="Cant."
                                                            value={product.quantity}
                                                            onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Tipo (opcional)"
                                                            value={product.type || ''}
                                                            onChange={(e) => updateProduct(index, 'type', e.target.value)}
                                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProduct(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.products.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center py-4">
                                                    No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingEntry ? 'Actualizar' : 'Crear'}
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

            {showProductsModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseProductsModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Productos de la Entrada {viewingEntry?.guide_number}
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                        No hay productos registrados
                                                    </td>
                                                </tr>
                                            ) : (
                                                products.map((product, index) => (
                                                    <tr key={product.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.type || '-'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseProductsModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
