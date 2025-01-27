import { apiSlice } from './apiSlice';
import { SUBSCRIPTIONS_URL } from '../constants';

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIPTIONS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    getSubscriptions: builder.query({
      query: () => ({
        url: SUBSCRIPTIONS_URL,
      }),
      providesTags: ['Subscriptions'],
    }),
    deleteSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `${SUBSCRIPTIONS_URL}/${subscriptionId}`,
        method: 'DELETE',
      }),
    }),
    getSubscription: builder.query({
      query: (id) => ({
        url: `${SUBSCRIPTIONS_URL}/${id}`,
      }),
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIPTIONS_URL}/${data.subscriptionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useDeleteSubscriptionMutation,
  useGetSubscriptionQuery, 
  useUpdateSubscriptionMutation,
} = subscriptionApiSlice;
