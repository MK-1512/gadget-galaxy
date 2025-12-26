import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
    try {
        const persistedState = localStorage.getItem('cart');
        if (persistedState) {
            return JSON.parse(persistedState);
        }
    } catch (e) {
        console.error("Could not parse cart from localStorage", e);
    }
    return { items: [], totalQuantity: 0, totalAmount: 0 };
};

const initialState = getCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1, totalPrice: newItem.price });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
     deleteItemFromCart(state, action) {
        const id = action.payload;
        const itemToDelete = state.items.find(item => item.id === id);
        if(itemToDelete) {
            state.totalQuantity -= itemToDelete.quantity;
            state.items = state.items.filter(item => item.id !== id);
            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            localStorage.setItem('cart', JSON.stringify(state));
        }
     },
clearCart(state) {
    state.items = [];
    state.totalQuantity = 0;
    state.totalAmount = 0;
    localStorage.removeItem('cart');
}
  },
});

export const { addItemToCart, removeItemFromCart, deleteItemFromCart,clearCart} = cartSlice.actions;
export default cartSlice.reducer;