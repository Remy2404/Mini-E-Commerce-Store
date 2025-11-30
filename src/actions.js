// src/actions.js
import { state } from './state.js';
import { toggleFavorite, getFavorites } from '../storage.js';
import { updateFavoritesBadge, updateSectionHeader, renderProducts, heartHtml } from './render.js';
import { showToast } from './utils.js';
import { elements } from './state.js';

export const handleFavoriteClick = (productId) => {
    const product = [...state.products].find(p => p.id === productId) || getFavorites().find(p => p.id === productId);
    if (!product) return;
    const { isFavorite: isNowFavorite } = toggleFavorite(product);
    updateFavoritesBadge();
    if (isNowFavorite) {
        showToast(elements, 'Added to favorites!', 'success');
    } else {
        showToast(elements, 'Removed from favorites', 'info');
    }
    if (state.currentView === 'favorites') {
        // re-render favorites list
        const favorites = getFavorites();
        renderProducts(favorites);
        updateSectionHeader();
    } else {
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        if (card) {
            const btn = card.querySelector('.favorite-btn');
            btn.classList.toggle('active', isNowFavorite);
            btn.innerHTML = heartHtml(isNowFavorite);
        }
    }
};

export const addToCart = (productId) => {
    const product = state.products.find(p => p.id === productId);
    if (product) {
        showToast(elements, `${product.title.substring(0, 30)}... added to cart!`, 'success');
    }
};

export const clearFilters = () => {
    state.currentCategory = 'all';
    state.searchQuery = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    // re-filter
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === 'all'));
    // trigger a re-filter by calling a global filter function if available
    const event = new Event('filters:clear');
    document.dispatchEvent(event);
};

export default { handleFavoriteClick, addToCart, clearFilters };
