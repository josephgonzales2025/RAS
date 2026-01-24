import Swal from 'sweetalert2';

/**
 * Muestra un mensaje de confirmación
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto descriptivo
 * @param {string} confirmButtonText - Texto del botón de confirmar
 * @param {string} cancelButtonText - Texto del botón de cancelar
 * @returns {Promise<boolean>} true si el usuario confirma, false si cancela
 */
export const confirmAlert = async (
    title = '¿Estás seguro?',
    text = '',
    confirmButtonText = 'Aceptar',
    cancelButtonText = 'Cancelar'
) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
    });
    return result.isConfirmed;
};

/**
 * Muestra un mensaje de éxito
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto descriptivo
 */
export const successAlert = (title = 'Éxito', text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'OK',
    });
};

/**
 * Muestra un mensaje de error
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto descriptivo
 */
export const errorAlert = (title = 'Error', text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'OK',
    });
};

/**
 * Muestra un mensaje de advertencia
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto descriptivo
 */
export const warningAlert = (title = 'Advertencia', text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'OK',
    });
};

/**
 * Muestra un mensaje de información
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto descriptivo
 */
export const infoAlert = (title = 'Información', text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'info',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'OK',
    });
};

/**
 * Muestra un toast (notificación pequeña)
 * @param {string} title - Título del mensaje
 * @param {string} icon - Tipo de icono: 'success', 'error', 'warning', 'info'
 * @param {number} timer - Tiempo en milisegundos
 */
export const toastAlert = (title, icon = 'success', timer = 3000) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    return Toast.fire({
        icon,
        title,
    });
};
