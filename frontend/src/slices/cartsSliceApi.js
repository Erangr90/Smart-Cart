import { apiSlice } from './apiSlice';
import { CARTS_URL } from '../constants';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: `${CARTS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    getCarts: builder.query({
      query: () => ({
        url: CARTS_URL,
      }),
      providesTags: ['Carts'],
    }),
    deleteCart: builder.mutation({
      query: (cartId) => ({
        url: `${CARTS_URL}/${cartId}`,
        method: 'DELETE',
      }),
    }),
    getCart: builder.query({
      query: (id) => ({
        url: `${CARTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCart: builder.mutation({
      query: (data) => ({
        url: `${CARTS_URL}/${data.chainId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useCreateCartMutation,
  useGetCartsQuery,
  useDeleteCartMutation,
  useGetCartQuery, 
  useUpdateCartMutation,
} = cartApiSlice;
