import { createSlice } from '@reduxjs/toolkit';

// === FIX: DEFINITION FOR THE MISSING FUNCTION IS ADDED HERE ===
// Check localStorage for a logged-in user when the app loads
const getInitialAuthState = () => {
    try {
        const persistedState = localStorage.getItem('authState');
        if (persistedState) {
            const authState = JSON.parse(persistedState);
            // Optional: You might want to add a token expiry check here in a real app
            return authState;
        }
    } catch (e) {
        console.error("Could not parse auth state from localStorage", e);
    }
    // If nothing is found or an error occurs, return the default logged-out state
    return { user: null, isAuthenticated: false };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialAuthState(), // This line now works correctly
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('authState', JSON.stringify(state));
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authState');
        },
        updateUserProfile(state, action) {
            if (state.user) {
                // Update the user in the Redux state
                state.user = { ...state.user, ...action.payload };
                // Update the user's session in localStorage
                localStorage.setItem('authState', JSON.stringify(state));

                // Also update the master "users" database in localStorage
                try {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.email === state.user.email);
                    if (userIndex !== -1) {
                        users[userIndex] = { ...users[userIndex], ...action.payload };
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                } catch (e) {
                    console.error("Failed to update user database in localStorage", e);
                }
            }
        },
    },
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;