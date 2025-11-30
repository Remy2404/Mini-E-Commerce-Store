import { initApp, attachEventListeners, retryFetch } from './src/init.js';
import { handleFavoriteClick, addToCart, clearFilters } from './src/actions.js';
import { filterByCategory, showProducts, showFavorites } from './src/filters.js';
import * as storage from './storage.js';

window.app = {
    handleFavoriteClick,
    addToCart,
    filterByCategory,
    showProducts,
    showFavorites,
    clearFilters,
    retryFetch,
    // convenience access to storage API
    getFavorites: storage.getFavorites || (() => []),
};

// Initialize and attach event listeners
initApp().then(() => attachEventListeners());
