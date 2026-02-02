import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./featuresRedux/userSlice";
export const store=configureStore({
    //can add more slices later
    reducer: {
        user: userReducer,
    },  devTools: window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
});