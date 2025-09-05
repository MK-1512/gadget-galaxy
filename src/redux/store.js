import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/productsSlice';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';
import compareReducer from './features/compareSlice'; // NEW: Import the compare reducer
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    compare: compareReducer, // NEW: Add the compare reducer to the store
    auth: authReducer,
  },
});