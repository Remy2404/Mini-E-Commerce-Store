// Centralized state and DOM element references
export const state = {
    products: [],
    filteredProducts: [],
    favorites: [],
    currentView: 'products', // 'products' or 'favorites'
    currentCategory: 'all',
    searchQuery: '',
    isLoading: false,
    error: null
};

export const elements = {
    productsGrid: document.getElementById('products-grid'),
    searchInput: document.getElementById('search-input'),
    categoryTabs: document.getElementById('category-tabs'),
    productsBtn: document.getElementById('products-btn'),
    favoritesBtn: document.getElementById('favorites-btn'),
    favoritesBadge: document.getElementById('favorites-badge'),
    sectionTitle: document.getElementById('section-title'),
    productsCount: document.getElementById('products-count'),
    toastContainer: document.getElementById('toast-container')
};

export default { state, elements };
