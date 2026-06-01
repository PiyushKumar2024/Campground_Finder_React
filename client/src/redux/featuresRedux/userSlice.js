import {createSlice} from '@reduxjs/toolkit';

// Rehydrate state from localStorage to survive page refreshes.
// Without this, a refresh wipes Redux state but keeps the token in localStorage,
// causing RequireAuth to pass but all user-dependent components to break (null IDs).
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : { id: null, username: '', email: '' },
    jwtToken: storedToken || '',
    isLoggedIn: !!(storedToken && storedUser)
}


// createSlice is a function that accepts an initial state, an object of reducer functions, and a "slice name".
// It automatically generates action creators and action types that correspond to the reducers and state.
export const userSlice=createSlice({
    name:'user', // The name of the slice. Used as a prefix for generated action types (e.g., 'user/changeUser').
    initialState, // The initial state defined above.
    reducers:{
        // Reducers are functions that determine how the state changes in response to actions.
        // Redux Toolkit uses "Immer" internally, allowing us to write "mutating" logic (like state.user = ...)
        // which is then converted into safe, immutable state updates.

        // This reducer handles the login action.
        // It expects action.payload to contain { user, token }
        login:(state,action)=>{
            state.user = action.payload.user;
            state.jwtToken = action.payload.token;
            state.isLoggedIn = true;
        },
        // This reducer handles the logout action.
        logout:(state,action)=>{
            state.user={id:null,username:'',email:''};
            state.jwtToken = '';
            state.isLoggedIn = false;
        }
    }
})

// Export the auto-generated action creators.
// These can be dispatched from React components (e.g., dispatch(changeUser(userData))).
export const {login,logout}=userSlice.actions;

// Export the reducer function itself.
// This will be imported in the store configuration to handle updates for this slice.
export default userSlice.reducer;