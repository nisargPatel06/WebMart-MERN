import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderAPI = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "order/new",
        method: "POST",
        body: orderData,
      }),
    }),
    getMyOrders: builder.query({ query: () => "orders/me" }),
    getOrderDetails: builder.query({ query: (id) => `order/${id}` }),
    getAllOrders: builder.query({ query: () => "admin/orders" }),
    removeOrder: builder.mutation({
      query: (id) => ({
        url: `admin/order/${id}`,
        method: "DELETE",
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, status }) => ({
        url: `admin/order/${id}`,
        method: "PUT",
        body: { status },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetAllOrdersQuery,
  useRemoveOrderMutation,
  useUpdateOrderMutation,
} = orderAPI;
