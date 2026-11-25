import { configureStore, createSlice } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice";

const initialState = {
  products: [],
  user: null,
  loading: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setProducts(state, { payload: products }) {
      state.products = products;
      state.loading = false;
    },

    setUser(state, { payload: user }) {
      state.user = user;
    },
  },
});

export const { setProducts, setUser } = appSlice.actions;

export const selectProducts = (state) => state.app.products;
export const selectUser = (state) => state.app.user;
export const selectLoading = (state) => state.app.loading;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    cart: cartReducer,
  },
});
