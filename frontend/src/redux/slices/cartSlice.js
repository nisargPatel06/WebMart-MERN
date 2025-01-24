import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  shippingInfo: JSON.parse(sessionStorage.getItem("shippingInfo")) || {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      sessionStorage.setItem(
        "shippingInfo",
        JSON.stringify(state.shippingInfo)
      );
    },
  },
});

export const {
  loadCart,
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
  saveShippingInfo,
} = cartSlice.actions;

export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalAmount = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;
