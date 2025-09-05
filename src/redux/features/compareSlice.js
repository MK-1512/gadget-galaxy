import { createSlice } from '@reduxjs/toolkit';

// Function to get compare list from localStorage for persistence
const getCompareFromStorage = () => {
    try {
        const persistedState = localStorage.getItem('compare');
        if (persistedState) {
            return JSON.parse(persistedState);
        }
    } catch (e) {
        console.error("Could not parse compare list from localStorage", e);
    }
    return { items: [] };
};

const initialState = getCompareFromStorage();

const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        toggleCompareItem(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (existingItem) {
                // If item exists, remove it
                state.items = state.items.filter((item) => item.id !== newItem.id);
            } else {
                // If item does not exist, add it (only if list is not full)
                if (state.items.length < 4) {
                    state.items.push(newItem);
                }
            }
            // Save to localStorage
            localStorage.setItem('compare', JSON.stringify(state));
        },
        // === NEW REDUCER ADDED HERE ===
        clearCompareList(state) {
            state.items = []; // Reset the items array to be empty
            // Update localStorage to reflect the empty state
            localStorage.setItem('compare', JSON.stringify({ items: [] }));
        },
    },
});

// === EXPORT THE NEW ACTION HERE ===
export const { toggleCompareItem, clearCompareList } = compareSlice.actions;
export default compareSlice.reducer;