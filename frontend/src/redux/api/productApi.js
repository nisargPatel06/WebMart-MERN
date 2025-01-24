import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({
        keyword,
        page,
        minPrice,
        maxPrice,
        activeCategory,
        rating,
      }) => {
        let base = `products?keyword=${keyword}&page=${page}`;
        if (minPrice || maxPrice) {
          base += `&price[gte]=${minPrice}&price[lte]=${maxPrice}`;
        }
        if (activeCategory !== "All") base += `&category=${activeCategory}`;
        if (rating) base += `&ratings[gte]=${rating}`;

        return base;
      },
    }),
    getAdminProducts: builder.query({ query: () => "admin/products" }),
    getProductDetails: builder.query({ query: (id) => `products/${id}` }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "admin/products/create",
        method: "POST",
        body: productData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `admin/products/${id}`,
        method: "PUT",
        body: productData,
      }),
    }),
    removeProduct: builder.mutation({
      query: (id) => ({
        url: `admin/products/${id}`,
        method: "DELETE",
        body: id,
      }),
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "review",
        method: "PUT",
        body: reviewData,
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAdminProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,
  useCreateReviewMutation,
} = productAPI;
