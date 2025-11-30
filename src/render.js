// src/render.js
import { state, elements } from './state.js';
import { generateStars, formatPrice, capitalize } from './utils.js';
import { getFavorites, getFavoritesCount } from '../storage.js';

// Compatibility: provide a no-op loader for templates when templates are embedded
export const loadTemplates = async () => {
    return Promise.resolve();
};

let filledHeartSvg = '';
let outlineHeartSvg = '';

export const setHeartSvgs = (filled, outline) => {
    filledHeartSvg = filled || '';
    outlineHeartSvg = outline || '';
};

export const heartHtml = (isFavorite) => isFavorite ? filledHeartSvg : outlineHeartSvg;

export const renderLoading = () => {
    const skeletons = Array.from({ length: 8 }, () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-price"></div>
            </div>
        </div>
    `).join('');
    elements.productsGrid.innerHTML = skeletons;
};

export const renderError = (message) => {
    elements.productsGrid.innerHTML = `
        <div class="error-state" style="grid-column: 1 / -1;">
            <div class="error-state-icon">Warning</div>
            <h3 class="error-state-title">Oops! Something went wrong</h3>
            <p class="empty-state-text">${message}</p>
            <button class="retry-btn" data-action="retry">Try Again</button>
        </div>
    `;
};

export const renderEmptyState = (type) => {
    const content = type === 'favorites'
        ? {
            icon: 'No favorites',
            title: 'No favorites yet',
            text: 'Start adding products to your favorites!',
            btnText: 'Browse Products',
            action: 'showProducts'
        }
        : {
            icon: 'No results',
            title: 'No products found',
            text: 'Try adjusting your search or filter criteria.',
            btnText: 'Clear Filters',
            action: 'clearFilters'
        };

    elements.productsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">${content.icon}</div>
            <h3 class="empty-state-title">${content.title}</h3>
            <p class="empty-state-text">${content.text}</p>
            <button class="empty-state-btn" data-action="${content.action}">${content.btnText}</button>
        </div>
    `;
};

export const renderProductCard = (product, isFavorite) => `
    <article class="product-card" data-product-id="${product.id}">
        <div class="product-image-container">
            <span class="product-category">${product.category}</span>
            <button 
                class="favorite-btn ${isFavorite ? 'active' : ''}" 
                data-action="toggle-favorite"
                data-product-id="${product.id}"
                aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
            >
                ${isFavorite ? filledHeartSvg : outlineHeartSvg}
            </button>
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy" />
        </div>
        <div class="product-info">
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <div class="product-rating">
                <span class="rating-stars">${generateStars(product.rating.rate)}</span>
                <span class="rating-count">(${product.rating.count})</span>
            </div>
            <div class="product-footer">
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="add-to-cart-btn" data-action="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    </article>
`;

export const renderProducts = (products) => {
    if (products.length === 0) {
        renderEmptyState(state.currentView);
        return;
    }
    const productsHtml = [...products].map(p => renderProductCard(p, getFavorites().some(f => f.id === p.id))).join('');
    elements.productsGrid.innerHTML = productsHtml;
};

export const renderCategoryTabs = (categories) => {
    const tabsHtml = categories.map(category => `
        <button class="category-tab ${state.currentCategory === category ? 'active' : ''}" data-category="${category}">${capitalize(category)}</button>
    `).join('');
    elements.categoryTabs.innerHTML = tabsHtml;
};

export const updateFavoritesBadge = () => {
    const count = getFavoritesCount();
    elements.favoritesBadge.textContent = count;
    elements.favoritesBadge.dataset.count = count;
};

export const updateSectionHeader = () => {
    const products = state.currentView === 'favorites' ? getFavorites() : state.filteredProducts;
    elements.sectionTitle.textContent = state.currentView === 'favorites' ? 'My Favorites' : 'Products';
    elements.productsCount.textContent = `${products.length} item${products.length !== 1 ? 's' : ''}`;
};

export default { setHeartSvgs, renderLoading, renderError, renderEmptyState, renderProducts, renderCategoryTabs, updateFavoritesBadge, updateSectionHeader };
