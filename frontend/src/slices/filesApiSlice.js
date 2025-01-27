import { apiSlice } from './apiSlice';
import { FILES_URL } from '../constants';

export const filesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImg: builder.mutation({
      query: (data) => ({
        url: `${FILES_URL}/uploadImag`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['File'],
    }),
    getImg: builder.query({
      query: (id) => ({
        url: `${FILES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useUploadImgMutation,
  useGetImgQuery,
} = filesApiSlice;
