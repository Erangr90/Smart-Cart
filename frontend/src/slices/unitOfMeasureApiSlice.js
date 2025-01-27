import { apiSlice } from './apiSlice';
import { UNIT_OF_MEASURE_URL} from '../constants';

export const unitOfMeasureApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUnitOfMeasure: builder.mutation({
      query: (data) => ({
        url: `${UNIT_OF_MEASURE_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UnitOfMeasure'],
    }),
    getUnitsOfMeasure: builder.query({
      query: () => ({
        url: UNIT_OF_MEASURE_URL,
      }),
      providesTags: ['UnitsOfMeasure'],
    }),
    deleteUnitOfMeasure: builder.mutation({
      query: (unitOfMeasureId) => ({
        url: `${UNIT_OF_MEASURE_URL}/${unitOfMeasureId}`,
        method: 'DELETE',
      }),
    }),
    getUnitOfMeasure: builder.query({
      query: (id) => ({
        url: `${UNIT_OF_MEASURE_URL}/${id}`,
      }),
    }),
    updateUnitOfMeasure: builder.mutation({
      query: (data) => ({
        url: `${UNIT_OF_MEASURE_URL}/${data.unitOfMeasureId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['UnitOfMeasure'],
    }),
  }),
});

export const {
  useCreateUnitOfMeasureMutation,
  useGetUnitsOfMeasureQuery,
  useDeleteUnitOfMeasureMutation,
  useGetUnitOfMeasureQuery, 
  useUpdateUnitOfMeasureMutation,
} = unitOfMeasureApiSlice;
