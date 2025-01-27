import { apiSlice } from './apiSlice';
import { PRICES_URL } from '../constants';

export const priceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPrice: builder.mutation({
      query: (data) => ({
        url: `${PRICES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Price'],
    }),
    getPrices: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRICES_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Prices'],
    }),
    deletePrice: builder.mutation({
      query: (priceId) => ({
        url: `${PRICES_URL}/${priceId}`,
        method: 'DELETE',
      }),
    }),
    getPriceById: builder.query({
      query: (id) => ({
        url: `${PRICES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getPriceByProductId: builder.query({
        query: (productId) => ({
          url: `${PRICES_URL}/product/${productId}`,
        }),
        keepUnusedDataFor: 5,
      }),
    updatePrice: builder.mutation({
      query: (data) => ({
        url: `${PRICES_URL}/${data.priceId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Price'],
    }),
  }),
});

export const {
  useCreatePriceMutation,
  useGetPricesQuery,
  useDeletePriceMutation,
  useGetPriceByIdQuery,
  useGetPriceProductIdQuery,
  useUpdatePriceMutation,
} = priceApiSlice;
