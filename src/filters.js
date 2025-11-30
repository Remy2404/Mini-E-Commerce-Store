// src/filters.js
import { state } from './state.js';
import { getFavorites } from '../storage.js';
import { renderProducts, updateSectionHeader } from './render.js';

export const filterProducts = () => {
    let filtered = [...state.products];
    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === state.currentCategory);
    }
    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        filtered = filtered.filter(product => product.title.toLowerCase().includes(q) || product.description.toLowerCase().includes(q) || product.category.toLowerCase().includes(q));
    }
    state.filteredProducts = filtered;
    renderProducts(filtered);
    updateSectionHeader();
};

export const filterByCategory = (category) => {
    state.currentCategory = category;
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    filterProducts();
};

export const handleSearch = (debouncedFn) => debouncedFn; // placeholder, actual debounced wrapper is provided by app entry

export const showProducts = (renderFn) => {
    state.currentView = 'products';
    const { productsBtn, favoritesBtn, categoryTabs } = (awaitElements());
    productsBtn.classList.add('active');
    favoritesBtn.classList.remove('active');
    categoryTabs.classList.remove('hidden');
    filterProducts();
};

export const showFavorites = () => {
    state.currentView = 'favorites';
    document.getElementById('favorites-btn').classList.add('active');
    document.getElementById('products-btn').classList.remove('active');
    document.getElementById('category-tabs').classList.add('hidden');
    const favorites = getFavorites();
    renderProducts(favorites);
    updateSectionHeader();
};

// small helper to get elements without creating another import cycle
function awaitElements() {
    return {
        productsBtn: document.getElementById('products-btn'),
        favoritesBtn: document.getElementById('favorites-btn'),
        categoryTabs: document.getElementById('category-tabs')
    };
}

export default { filterProducts, filterByCategory, showProducts, showFavorites };
