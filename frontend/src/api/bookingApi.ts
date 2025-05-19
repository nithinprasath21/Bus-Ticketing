import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableSeats: builder.query<string[], string>({
      query: (tripId) => `/passenger/buses/${tripId}/seats`,
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    bookSeats: builder.mutation<
      { success: boolean; message?: string },
      { tripId: string; selectedSeats: string[] }
    >({
      query: ({ tripId, selectedSeats }) => ({
        url: "/passenger/bookings",
        method: "POST",
        body: {
          tripId,
          selectedSeats: selectedSeats.map((seat) => ({ seatNumber: seat })),
        },
      }),
      invalidatesTags: ['BusSearch', 'Bookings'],
    }),

    cancelBooking: builder.mutation<
      { success: boolean; message?: string },
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/passenger/bookings/${bookingId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ['Bookings'],
    }),

    partialCancelBooking: builder.mutation<
      { success: boolean; message?: string },
      { bookingId: string; seats: string[] }
    >({
      query: ({ bookingId, seats }) => ({
        url: `/passenger/bookings/${bookingId}/partial-cancel`,
        method: "PATCH",
        body: { seats },
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useCancelBookingMutation,
  usePartialCancelBookingMutation,
  useGetAvailableSeatsQuery,
  useBookSeatsMutation,
} = bookingApi;
