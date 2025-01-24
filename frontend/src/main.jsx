import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Home,
  Products,
  ProductDetails,
  LoginSignUp,
  Cart,
  Checkout,
  SuccessPage,
  Profile,
  MyOrders,
  OrderDetails,
  Dashboard,
  AllProducts,
  AllOrders,
  AddProduct,
  AllUsers,
  UpdateOrder,
  UpdateProduct,
} from "./components";
import Layout from "./Layout.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/products/:keyword" element={<Products />} />
      <Route path="/login" element={<LoginSignUp />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<ProtectedRoute element={Checkout} />} />
      <Route
        path="/success"
        element={<ProtectedRoute element={SuccessPage} />}
      />
      <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
      <Route path="/orders" element={<ProtectedRoute element={MyOrders} />} />
      <Route
        path="/orders/:id"
        element={<ProtectedRoute element={OrderDetails} />}
      />
      <Route
        path="/admin/dashboard"
        element={<AdminRoute element={Dashboard} />}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute element={AllProducts} />}
      />
      <Route
        path="/admin/addproduct"
        element={<AdminRoute element={AddProduct} />}
      />
      <Route
        path="/admin/orders"
        element={<AdminRoute element={AllOrders} />}
      />
      <Route path="/admin/users" element={<AdminRoute element={AllUsers} />} />
      <Route
        path="/admin/orders/:id"
        element={<AdminRoute element={UpdateOrder} />}
      />
      <Route
        path="/admin/products/:id"
        element={<AdminRoute element={UpdateProduct} />}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
