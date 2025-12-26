import { createSlice } from '@reduxjs/toolkit';

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
                state.items = state.items.filter((item) => item.id !== newItem.id);
            } else {
                if (state.items.length < 4) {
                    state.items.push(newItem);
                }
            }
            localStorage.setItem('compare', JSON.stringify(state));
        },
        clearCompareList(state) {
            state.items = [];
            localStorage.setItem('compare', JSON.stringify({ items: [] }));
        },
    },
});

export const { toggleCompareItem, clearCompareList } = compareSlice.actions;
export default compareSlice.reducer;