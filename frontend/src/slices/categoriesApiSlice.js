import { apiSlice } from './apiSlice';
import { CATEGORIES_URL } from '../constants';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    getCategories: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: CATEGORIES_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Categories'],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `${CATEGORIES_URL}/all`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'DELETE',
      }),
    }),
    addProductToCategory: builder.mutation({
      query: ({ categoryId, productId }) => ({
        url: `${CATEGORIES_URL}/${categoryId}/product`,
        method: 'POST',
        body: { categoryId, productId },
      }),
      invalidatesTags: ['Category'],
    }),
    deleteProductFromCategory: builder.mutation({
      query: ({ categoryId, productId }) => ({
        url: `${CATEGORIES_URL}/${categoryId}/product`,
        method: 'DELETE',
        body: { categoryId, productId }
      }),
    }),

    getCategory: builder.query({
      query: (id) => ({
        url: `${CATEGORIES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useDeleteProductFromCategoryMutation,
  useAddProductToCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApiSlice;
