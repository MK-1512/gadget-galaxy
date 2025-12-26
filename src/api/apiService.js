import { mockProducts } from './mockData';

const simulateApiCall = (data, delay = 500) => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

const apiService = {
  getAllProducts: () => {
    return simulateApiCall({ data: { products: mockProducts } });
  },
  getProductById: (id) => {
    const productId = parseInt(id, 10);
    const product = mockProducts.find(p => p.id === productId);
    return simulateApiCall({ data: product });
  },
  getCategories: () => {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    return simulateApiCall({ data: categories });
  },
};

export default apiService;