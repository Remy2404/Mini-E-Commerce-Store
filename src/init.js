// src/init.js
import { fetchProducts } from '../api.js';
import { loadIcons, getIcon } from '../icons.js';
import { state, elements } from './state.js';
import { getFavorites } from '../storage.js';
import { debounce, showToast } from './utils.js';
import { setHeartSvgs, renderLoading, renderProducts, renderCategoryTabs, renderError, updateFavoritesBadge, updateSectionHeader } from './render.js';
import { filterProducts, filterByCategory } from './filters.js';
import { handleFavoriteClick, addToCart, clearFilters } from './actions.js';

export const initApp = async () => {
    try {
        state.isLoading = true;
        renderLoading();

        const products = await fetchProducts();
        state.products = [...products];
        state.filteredProducts = [...products];

        // load icons and set heart svgs
        await loadIcons();
        const filled = getIcon('filledHeart') || '';
        const outline = getIcon('outlineHeart') || '';
        setHeartSvgs(filled, outline);

        const categories = [...new Set(products.map(p => p.category))];
        const allCats = ['all', ...categories];
        renderCategoryTabs(allCats);
        renderProducts(products);
        updateFavoritesBadge();
        updateSectionHeader();

        state.isLoading = false;
        state.error = null;
        console.log('App initialized successfully with', products.length, 'products');
    } catch (err) {
        state.isLoading = false;
        state.error = err.message || String(err);
        renderError('Failed to load products. Please check your connection and try again.');
        console.error('Failed to initialize app:', err);
    }
};

export const retryFetch = () => initApp();

// Wiring event listeners (delegation)
export const attachEventListeners = () => {
    // Search
    const handleSearch = debounce((query) => {
        state.searchQuery = query;
        if (state.currentView === 'products') {
            filterProducts();
        } else {
            const favorites = getFavorites();
            const q = query.toLowerCase();
            const filtered = favorites.filter(product => product.title.toLowerCase().includes(q) || product.category.toLowerCase().includes(q));
            renderProducts(filtered);
            updateSectionHeader();
        }
    }, 300);

    elements.searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

    // View toggles
    elements.productsBtn.addEventListener('click', () => {
        state.currentView = 'products';
        elements.productsBtn.classList.add('active');
        elements.favoritesBtn.classList.remove('active');
        elements.categoryTabs.classList.remove('hidden');
        filterProducts();
    });
    elements.favoritesBtn.addEventListener('click', () => {
        state.currentView = 'favorites';
        elements.favoritesBtn.classList.add('active');
        elements.productsBtn.classList.remove('active');
        elements.categoryTabs.classList.add('hidden');
        const favorites = getFavorites();
        renderProducts(favorites);
        updateSectionHeader();
    });

    // Category tabs delegation
    elements.categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-tab');
        if (!btn) return;
        const category = btn.dataset.category;
        if (category) filterByCategory(category);
    });

    // Products grid delegation for actions
    elements.productsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const pid = btn.dataset.productId || btn.closest('[data-product-id]')?.dataset.productId;
        const productId = pid ? Number(pid) : null;
        if (action === 'toggle-favorite' && productId !== null) {
            handleFavoriteClick(productId);
        } else if (action === 'add-to-cart' && productId !== null) {
            addToCart(productId);
        } else if (action === 'retry') {
            retryFetch();
        } else if (action === 'showProducts') {
            // mimic click on products
            elements.productsBtn.click();
        } else if (action === 'clearFilters') {
            clearFilters();
        }
    });

    // keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') clearFilters();
    });
};

export default { initApp, retryFetch, attachEventListeners };
