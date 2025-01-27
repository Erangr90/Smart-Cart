import { apiSlice } from './apiSlice';
import { CHAINS_URL } from '../constants';

export const chainApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChain: builder.mutation({
      query: (data) => ({
        url: `${CHAINS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Chain'],
    }),
    getChains: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: CHAINS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Chains'],
    }),
    deleteChain: builder.mutation({
      query: (chainId) => ({
        url: `${CHAINS_URL}/${chainId}`,
        method: 'DELETE',
      }),
    }),
    getChain: builder.query({
      query: (id) => ({
        url: `${CHAINS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateChain: builder.mutation({
      query: (data) => ({
        url: `${CHAINS_URL}/${data.chainId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Chain'],
    }),
  }),
});

export const {
  useCreateChainMutation,
  useGetChainsQuery,
  useDeleteChainMutation,
  useGetChainQuery, 
  useUpdateChainMutation,
} = chainApiSlice;
