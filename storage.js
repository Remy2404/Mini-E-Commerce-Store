/**
 * Storage Module - LocalStorage utilities for favorites
 * Demonstrates: Arrow functions, Spread operator, LocalStorage, ES Modules
 */

const FAVORITES_KEY = 'ministore_favorites';

/**
 * Get all favorites from localStorage
 * @returns {Array} Array of favorite products
 */
export const getFavorites = () => {
    try {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
};

/**
 * Save favorites array to localStorage
 * @param {Array} favorites - Array of favorite products
 */
export const saveFavorites = (favorites) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};

/**
 * Add a product to favorites using spread operator
 * @param {Object} product - Product to add
 * @returns {Array} Updated favorites array
 */
export const addToFavorites = (product) => {
    const favorites = getFavorites();
    
    // Check if already exists
    if (favorites.some(fav => fav.id === product.id)) {
        return favorites;
    }
    
    // Use spread operator to create new array with added product
    const updatedFavorites = [...favorites, { ...product, addedAt: Date.now() }];
    saveFavorites(updatedFavorites);
    return updatedFavorites;
};

/**
 * Remove a product from favorites
 * @param {number} productId - Product ID to remove
 * @returns {Array} Updated favorites array
 */
export const removeFromFavorites = (productId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== productId);
    saveFavorites(updatedFavorites);
    return updatedFavorites;
};

/**
 * Toggle favorite status
 * @param {Object} product - Product to toggle
 * @returns {Object} { isFavorite: boolean, favorites: Array }
 */
export const toggleFavorite = (product) => {
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === product.id);
    
    if (existingIndex !== -1) {
        // Remove from favorites using spread and filter
        const updatedFavorites = favorites.filter((_, index) => index !== existingIndex);
        saveFavorites(updatedFavorites);
        return { isFavorite: false, favorites: updatedFavorites };
    } else {
        // Add to favorites using spread operator
        const updatedFavorites = [...favorites, { ...product, addedAt: Date.now() }];
        saveFavorites(updatedFavorites);
        return { isFavorite: true, favorites: updatedFavorites };
    }
};

/**
 * Check if a product is in favorites
 * @param {number} productId - Product ID to check
 * @returns {boolean}
 */
export const isFavorite = (productId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === productId);
};

/**
 * Clear all favorites
 */
export const clearAllFavorites = () => {
    saveFavorites([]);
    return [];
};

/**
 * Get favorites count
 * @returns {number}
 */
export const getFavoritesCount = () => {
    return getFavorites().length;
};
