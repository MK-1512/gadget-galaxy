import { createSlice } from '@reduxjs/toolkit';

const getInitialAuthState = () => {
    try {
        const persistedState = localStorage.getItem('authState');
        if (persistedState) {
            const authState = JSON.parse(persistedState);
            return authState;
        }
    } catch (e) {
        console.error("Could not parse auth state from localStorage", e);
    }
    return { user: null, isAuthenticated: false };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialAuthState(),
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
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('authState', JSON.stringify(state));

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