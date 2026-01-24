import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import { PlusIcon } from '@heroicons/react/24/outline';
import { confirmAlert, successAlert, errorAlert } from '@/utils/alerts';

export default function Index({ clients }) {
    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [addresses, setAddresses] = useState([]);

    // Extract data and pagination from clients prop
    const clientsData = clients.data || clients;
    const paginationLinks = clients.links || null;

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            if (search) {
                router.get(route('clients.index'), { search }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            } else {
                router.get(route('clients.index'), {}, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const { data: createData, setData: setCreateData, post, processing: creating, errors: createErrors, reset: resetCreate } = useForm({
        business_name: '',
        ruc: '',
        email: '',
        phone: '',
    });

    const { data: editData, setData: setEditData, put, processing: editing, errors: editErrors, reset: resetEdit } = useForm({
        business_name: '',
        ruc: '',
        email: '',
        phone: '',
    });

    const openCreateModal = () => {
        resetCreate();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        resetCreate();
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setEditData({
            business_name: client.business_name || '',
            ruc: client.ruc || '',
            email: client.email || '',
            phone: client.phone || '',
        });
        setAddresses(client.addresses || []);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingClient(null);
        setAddresses([]);
        resetEdit();
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => {
                closeCreateModal();
                successAlert('Creado', 'El cliente ha sido creado exitosamente');
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(route('clients.update', editingClient.id), {
            onSuccess: () => {
                saveAddresses();
                closeEditModal();
                successAlert('Actualizado', 'El cliente ha sido actualizado exitosamente');
            },
        });
    };

    const addAddress = () => {
        setAddresses([...addresses, { address: '', zone: '', isNew: true }]);
    };

    const removeAddress = async (index, addressId) => {
        if (addressId) {
            // Si tiene ID, eliminar del servidor
            const confirmed = await confirmAlert(
                '¿Eliminar dirección?',
                '¿Estás seguro de eliminar esta dirección?',
                'Sí, eliminar',
                'Cancelar'
            );
            
            if (!confirmed) return;
            
            router.delete(route('client-addresses.destroy', addressId), {
                preserveScroll: true,
                onSuccess: () => {
                    setAddresses(addresses.filter((_, i) => i !== index));
                    successAlert('Eliminado', 'La dirección ha sido eliminada exitosamente');
                },
                onError: () => {
                    errorAlert('Error', 'No se pudo eliminar la dirección');
                }
            });
        } else {
            // Si no tiene ID, solo remover del array
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    const updateAddress = (index, field, value) => {
        const newAddresses = [...addresses];
        newAddresses[index][field] = value;
        setAddresses(newAddresses);
    };

    const saveAddresses = () => {
        const newAddresses = addresses.filter(addr => addr.isNew && addr.address && addr.zone);
        
        if (newAddresses.length > 0) {
            newAddresses.forEach(addr => {
                router.post(route('client-addresses.store'), {
                    client_id: editingClient.id,
                    address: addr.address,
                    zone: addr.zone,
                }, {
                    preserveScroll: true,
                });
            });
        }

        // Actualizar direcciones existentes
        const existingAddresses = addresses.filter(addr => !addr.isNew && addr.id);
        existingAddresses.forEach(addr => {
            router.put(route('client-addresses.update', addr.id), {
                address: addr.address,
                zone: addr.zone,
            }, {
                preserveScroll: true,
            });
        });
    };

    const handleDelete = async (id, name) => {
        const confirmed = await confirmAlert(
            '¿Eliminar cliente?',
            `¿Estás seguro de eliminar el cliente "${name}"?`,
            'Sí, eliminar',
            'Cancelar'
        );
        
        if (!confirmed) return;
        
        router.delete(route('clients.destroy', id), {
            onSuccess: () => {
                successAlert('Eliminado', 'El cliente ha sido eliminado exitosamente');
            },
            onError: () => {
                errorAlert('Error', 'No se pudo eliminar el cliente');
            },
        });
    };

    const handlePageChange = (url) => {
        router.visit(url, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Clientes
                </h2>
            }
        >
            <Head title="Clientes" />

            <div className="py-6">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lista de Clientes
                                </h3>
                                <button
                                    onClick={openCreateModal}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Cliente
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por razón social, RUC o email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                RUC
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Razón Social
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Teléfono
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Direcciones
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {clientsData.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <p className="text-gray-500 text-lg mb-2">
                                                            {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                                                        </p>
                                                        {!search && (
                                                            <button
                                                                onClick={openCreateModal}
                                                                className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700"
                                                            >
                                                                Crear primer cliente
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            clientsData.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{client.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{client.ruc}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {client.business_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {client.email || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {client.phone || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {client.addresses?.length || 0} direcciones
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(client)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(client.id, client.business_name)}
                                                                className="text-red-600 hover:text-red-900 ml-4"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {paginationLinks && !search && (
                                <Pagination
                                    links={paginationLinks}
                                    onPageChange={handlePageChange}
                                />
                            )}

                            {clientsData.length > 0 && search && (
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                    <div className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{clientsData.length}</span> resultados
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Crear Cliente */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="2xl">
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Nuevo Cliente
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="create_business_name" value="Razón Social" />
                            <TextInput
                                id="create_business_name"
                                type="text"
                                value={createData.business_name}
                                onChange={(e) => setCreateData('business_name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ej: Empresa SAC"
                                required
                            />
                            <InputError message={createErrors.business_name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="create_ruc" value="RUC" />
                                <TextInput
                                    id="create_ruc"
                                    type="text"
                                    value={createData.ruc}
                                    onChange={(e) => setCreateData('ruc', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 20123456789"
                                    maxLength={11}
                                    required
                                />
                                <InputError message={createErrors.ruc} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="create_phone" value="Teléfono" />
                                <TextInput
                                    id="create_phone"
                                    type="text"
                                    value={createData.phone}
                                    onChange={(e) => setCreateData('phone', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 987654321"
                                    required
                                />
                                <InputError message={createErrors.phone} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="create_email" value="Email" />
                            <TextInput
                                id="create_email"
                                type="email"
                                value={createData.email}
                                onChange={(e) => setCreateData('email', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ej: contacto@empresa.com"
                                required
                            />
                            <InputError message={createErrors.email} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton disabled={creating}>
                            {creating ? 'Guardando...' : 'Guardar'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Editar Cliente */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="2xl">
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Editar Cliente
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit_business_name" value="Razón Social" />
                            <TextInput
                                id="edit_business_name"
                                type="text"
                                value={editData.business_name}
                                onChange={(e) => setEditData('business_name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ej: Empresa SAC"
                                required
                            />
                            <InputError message={editErrors.business_name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="edit_ruc" value="RUC" />
                                <TextInput
                                    id="edit_ruc"
                                    type="text"
                                    value={editData.ruc}
                                    onChange={(e) => setEditData('ruc', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 20123456789"
                                    maxLength={11}
                                    required
                                />
                                <InputError message={editErrors.ruc} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="edit_phone" value="Teléfono" />
                                <TextInput
                                    id="edit_phone"
                                    type="text"
                                    value={editData.phone}
                                    onChange={(e) => setEditData('phone', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 987654321"
                                    required
                                />
                                <InputError message={editErrors.phone} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_email" value="Email" />
                            <TextInput
                                id="edit_email"
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData('email', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ej: contacto@empresa.com"
                                required
                            />
                            <InputError message={editErrors.email} className="mt-2" />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-medium text-gray-900">Direcciones de Entrega</h3>
                            <button
                                type="button"
                                onClick={addAddress}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Dirección
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">No hay direcciones registradas</p>
                                <p className="text-xs text-gray-400">Haz clic en "Agregar Dirección" para comenzar</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {addresses.map((address, index) => (
                                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <InputLabel htmlFor={`address_${index}`} value="Dirección" />
                                                <TextInput
                                                    id={`address_${index}`}
                                                    type="text"
                                                    value={address.address || ''}
                                                    onChange={(e) => updateAddress(index, 'address', e.target.value)}
                                                    className="mt-1 block w-full text-sm"
                                                    placeholder="Ej: Av. Principal 123"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor={`zone_${index}`} value="Zona" />
                                                <TextInput
                                                    id={`zone_${index}`}
                                                    type="text"
                                                    value={address.zone || ''}
                                                    onChange={(e) => updateAddress(index, 'zone', e.target.value)}
                                                    className="mt-1 block w-full text-sm"
                                                    placeholder="Ej: Norte"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAddress(index, address.id)}
                                            className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Eliminar dirección"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeEditModal}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton disabled={editing}>
                            {editing ? 'Actualizando...' : 'Actualizar'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}