function showSuccessMessage(message) {
    // Crear un toast de éxito
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    
    // Mostrar el toast usando transform directamente
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

