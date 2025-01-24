import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productApi";
import { userAPI } from "./api/userApi";
import { orderAPI } from "./api/orderApi";
import cartReducer, { loadCart } from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    [productAPI.reducerPath]: productAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    cart: cartReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productAPI.middleware,
      userAPI.middleware,
      orderAPI.middleware
    ),
});

const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

store.dispatch(loadCart(cartItems));
