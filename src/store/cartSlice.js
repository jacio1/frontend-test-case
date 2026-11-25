import { createSelector, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], isCheckingOut: false },
  reducers: {
    addToCart(state, { payload: product }) {
      if (state.isCheckingOut) {
        return;
      }

      const item = state.items.find((item) => item.id === product.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(state, { payload: id }) {
      if (state.isCheckingOut) {
        return;
      }

      state.items = state.items.filter((item) => item.id !== id);
    },

    updateQuantity(state, { payload: { id, quantity } }) {
      if (state.isCheckingOut) {
        return;
      }

      const index = state.items.findIndex((item) => item.id === id);
      if (index === -1) {
        return;
      }

      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
    },

    startCheckout(state) {
      if (state.items.length > 0) {
        state.isCheckingOut = true;
      }
    },

    completeCheckout(state) {
      if (state.isCheckingOut) {
        state.items = [];
        state.isCheckingOut = false;
      }
    },

    cancelCheckout(state) {
      state.isCheckingOut = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  startCheckout,
  completeCheckout,
  cancelCheckout,
} = cartSlice.actions;

export const selectCart = (state) => state.cart.items;
export const selectIsCheckingOut = (state) => state.cart.isCheckingOut;

export const selectCartSummary = createSelector([selectCart], (items) => {
  let cartCount = 0;
  let totalPrice = 0;

  for (const { price, quantity } of items) {
    cartCount += quantity;
    totalPrice += price * quantity;
  }

  return { cartCount, totalPrice };
});

export default cartSlice.reducer;
