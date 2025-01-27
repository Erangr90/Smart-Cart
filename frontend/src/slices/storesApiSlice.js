import { apiSlice } from './apiSlice';
import { STORES_URL } from '../constants';

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createStore: builder.mutation({
      query: (data) => ({
        url: `${STORES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),
    getStores: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: STORES_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Stores'],
    }),
    deleteStore: builder.mutation({
      query: (storeId) => ({
        url: `${STORES_URL}/${storeId}`,
        method: 'DELETE',
      }),
    }),
    getStore: builder.query({
      query: (id) => ({
        url: `${STORES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateStore: builder.mutation({
      query: (data) => ({
        url: `${STORES_URL}/${data.storeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useGetStoresQuery,
  useDeleteStoreMutation,
  useGetStoreQuery, 
  useUpdateStoreMutation,
} = storeApiSlice;
