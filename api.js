const PRODUCTS_API_URL = `https://fakestoreapi.com/products`;

export const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
}