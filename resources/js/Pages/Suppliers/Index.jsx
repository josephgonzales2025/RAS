import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { supplierService } from '@/services/supplierService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { confirmAlert, successAlert, errorAlert } from '@/utils/alerts';

export default function Index({ auth }) {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        ruc_dni: '',
        business_name: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadSuppliers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSuppliers(suppliers);
        } else {
            const filtered = suppliers.filter(supplier =>
                supplier.ruc_dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.business_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        }
    }, [searchTerm, suppliers]);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            const data = await supplierService.getAll();
            // Sort suppliers by ID in descending order (newest first)
            const sortedData = data.sort((a, b) => b.id - a.id);
            setSuppliers(sortedData);
            setFilteredSuppliers(sortedData);
            setError(null);
        } catch (err) {
            setError('Error al cargar proveedores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                ruc_dni: supplier.ruc_dni,
                business_name: supplier.business_name,
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                ruc_dni: '',
                business_name: '',
            });
        }
        setFormErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({
            ruc_dni: '',
            business_name: '',
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.ruc_dni.trim()) {
            errors.ruc_dni = 'El RUC/DNI es requerido';
        } else if (formData.ruc_dni.length > 11) {
            errors.ruc_dni = 'El RUC/DNI no puede tener más de 11 caracteres';
        }

        if (!formData.business_name.trim()) {
            errors.business_name = 'La razón social es requerida';
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
            if (editingSupplier) {
                await supplierService.update(editingSupplier.id, formData);
                await loadSuppliers();
                successAlert('Actualizado', 'El proveedor ha sido actualizado exitosamente');
            } else {
                const newSupplier = await supplierService.create(formData);
                // Add new supplier at the beginning of the list
                setSuppliers(prev => [newSupplier, ...prev]);
                setFilteredSuppliers(prev => [newSupplier, ...prev]);
                successAlert('Creado', 'El proveedor ha sido creado exitosamente');
            }
            handleCloseModal();
        } catch (err) {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            } else {
                setError('Error al guardar el proveedor');
            }
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmAlert(
            '¿Eliminar proveedor?',
            '¿Está seguro de eliminar este proveedor?',
            'Sí, eliminar',
            'Cancelar'
        );
        
        if (!confirmed) return;

        try {
            await supplierService.delete(id);
            await loadSuppliers();
            successAlert('Eliminado', 'El proveedor ha sido eliminado exitosamente');
        } catch (err) {
            setError('Error al eliminar el proveedor');
            errorAlert('Error', 'No se pudo eliminar el proveedor');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Proveedores</h2>}
        >
            <Head title="Proveedores" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Add Button */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lista de Proveedores
                                </h3>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Proveedor
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar por RUC/DNI o Razón Social..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                    {error}
                                </div>
                            )}

                            {/* Loading State */}
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    <p className="mt-2 text-gray-600">Cargando proveedores...</p>
                                </div>
                            ) : (
                                /* Suppliers Table */
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    RUC/DNI
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Razón Social
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredSuppliers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                        {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredSuppliers.map((supplier, index) => (
                                                    <tr key={supplier.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {supplier.ruc_dni}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {supplier.business_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleOpenModal(supplier)}
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                                title="Editar"
                                                            >
                                                                <PencilIcon className="h-5 w-5 inline" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(supplier.id)}
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

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                            aria-hidden="true"
                            onClick={handleCloseModal}
                        ></div>

                        {/* Center modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                                    </h3>

                                    {/* RUC/DNI Field */}
                                    <div className="mb-4">
                                        <label htmlFor="ruc_dni" className="block text-sm font-medium text-gray-700 mb-2">
                                            RUC/DNI <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="ruc_dni"
                                            name="ruc_dni"
                                            value={formData.ruc_dni}
                                            onChange={handleInputChange}
                                            maxLength={11}
                                            className={`mt-1 block w-full rounded-md shadow-sm ${
                                                formErrors.ruc_dni
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            placeholder="Ingrese RUC o DNI"
                                        />
                                        {formErrors.ruc_dni && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.ruc_dni}</p>
                                        )}
                                    </div>

                                    {/* Business Name Field */}
                                    <div className="mb-4">
                                        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Razón Social <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="business_name"
                                            name="business_name"
                                            value={formData.business_name}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full rounded-md shadow-sm ${
                                                formErrors.business_name
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                            }`}
                                            placeholder="Ingrese razón social"
                                        />
                                        {formErrors.business_name && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.business_name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingSupplier ? 'Actualizar' : 'Crear'}
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
        </AuthenticatedLayout>
    );
}