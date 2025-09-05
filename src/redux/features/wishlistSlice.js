import { createSlice } from '@reduxjs/toolkit';

const getWishlistFromStorage = () => {
    try {
        const persistedState = localStorage.getItem('wishlist');
        if (persistedState) return JSON.parse(persistedState);
    } catch (e) {
        console.error("Could not parse wishlist from localStorage", e);
    }
    return { items: [] };
};

const initialState = getWishlistFromStorage();

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlistItem(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            if (existingItem) {
                state.items = state.items.filter((item) => item.id !== newItem.id);
            } else {
                state.items.push(newItem);
            }
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        removeWishlistItem(state, action) {
            state.items = state.items.filter((item) => item.id !== action.payload);
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        clearWishlist(state) {
            state.items = [];
            localStorage.setItem('wishlist', JSON.stringify(state));
        }
    },
});

export const { toggleWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
