import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1/",
    credentials: "include", // This ensures cookies are included with requests
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "me/update",
        method: "PUT",
        body: userData,
      }),
    }),
    getUserDetails: builder.query({ query: () => "/me" }),
    getAllUsers: builder.query({ query: () => "/admin/users" }),
    logoutUser: builder.query({ query: () => "/logout" }),
    removeUser: builder.mutation({
      query: (id) => ({
        url: `admin/user/${id}`,
        method: "DELETE",
        body: id,
      }),
    }),
    getSingleUser: builder.query({ query: (id) => `admin/user/${id}` }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetAllUsersQuery,
  useLogoutUserQuery,
  useRemoveUserMutation,
  useGetSingleUserQuery,
} = userAPI;
