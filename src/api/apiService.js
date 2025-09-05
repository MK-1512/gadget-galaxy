import { mockProducts } from './mockData';

// This function simulates an API call delay
const simulateApiCall = (data, delay = 500) => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

const apiService = {
  getAllProducts: () => {
    // We wrap our local data in a simulated API call
    return simulateApiCall({ data: { products: mockProducts } });
  },
  getProductById: (id) => {
    const productId = parseInt(id, 10);
    const product = mockProducts.find(p => p.id === productId);
    // We wrap the single product in a simulated API call
    return simulateApiCall({ data: product });
  },
  // We can add more functions later if needed, e.g., for categories
  getCategories: () => {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return simulateApiCall({ data: categories });
  },
};

export default apiService;