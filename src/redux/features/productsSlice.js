import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api/apiService';

// The thunk now fetches from our simulated local API service
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await apiService.getAllProducts();
  // The filtering logic is no longer needed here!
  return response.data.products;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
  const response = await apiService.getProductById(id);
  return response.data;
});

const initialState = {
  items: [],
  selectedProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        // Reset selected product when fetching a new one
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;