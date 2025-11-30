// General utility functions used across the app
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalf) stars += '½';
    stars += '☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0));
    return stars;
};

export const formatPrice = (price) => `$${price.toFixed(2)}`;

export const getCategories = (products) => {
    const categories = products.map(product => product.category);
    return ['all', ...new Set(categories)];
};

export const capitalize = (str) =>
    str.split(' ')
       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
       .join(' ');

// Simple toast helper that app code can call
export const showToast = (elements, message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'Success', error: 'Error', info: 'Info' };
    toast.innerHTML = `
        <span>${icons[type]}</span>
        <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

export default { debounce, generateStars, formatPrice, getCategories, capitalize, showToast };
