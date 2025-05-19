import { apiSlice } from './apiSlice';

export const passengerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchBuses: builder.query<{ success: boolean; data: any[] }, { source: string; destination: string; date?: string }>({
      query: ({ source, destination, date }) => {
        const params = new URLSearchParams({ source, destination });
        if (date) params.append("date", date);
        return `/passenger/buses/search?${params.toString()}`;
        providesTags: ['BusSearch']
      },
    }),

    getBookings: builder.query<any[], void>({
      query: () => `/passenger/bookings`,
      transformResponse: (response: { success: boolean; data: any[] }) => response.data,
      providesTags: ['Bookings'],
    }),
  }),
});

export const {
  useSearchBusesQuery,
  useLazySearchBusesQuery,
  useGetBookingsQuery,
} = passengerApi;
