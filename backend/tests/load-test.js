import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '1m',
};

const BASE_URL = 'http://localhost:3000';

const users = [
  { email: 'passenger1@example.com', password: 'pass123' },
  { email: 'passenger2@example.com', password: 'pass123' },
  { email: 'passenger3@example.com', password: 'pass123' },
];

export default function () {
  const user = users[__VU % users.length];

  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const loginHeaders = {
    headers: { 'Content-Type': 'application/json' },
  };

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, loginHeaders);

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login success true': (r) => r.json('success') === true,
    'login has token': (r) => !!r.json('data.token'),
  });

  const token = loginRes.json('data.token');
  if (!token) return;

  const source = 'Coimbatore';
  const destination = 'Banglore';
  const query = `?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`;
  const searchUrl = `${BASE_URL}/api/passenger/buses/search` + query;

  const searchHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const searchRes = http.get(searchUrl, searchHeaders);

  check(searchRes, {
    'bus search status is 200': (r) => r.status === 200,
    'bus search success': (r) => r.json('success') === true,
    'bus data returned': (r) => Array.isArray(r.json('data')) && r.json('data').length > 0,
  });

  sleep(1);

  const trips = searchRes.json('data');
  if (Array.isArray(trips) && trips.length > 0) {
    const trip = trips[0];
    const tripId = trip._id;
    const availableSeats = trip.availableSeats;

    if (availableSeats && availableSeats.length >= 2) {
      const selectedSeats = availableSeats.slice(0, 2);

      const bookingPayload = JSON.stringify({
        tripId,
        selectedSeats,
      });

      const bookingHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const bookingRes = http.post(
        `${BASE_URL}/api/passenger/booking`,
        bookingPayload,
        { headers: bookingHeaders }
      );

      if (bookingRes && bookingRes.status === 200 && bookingRes.body) {
        check(bookingRes, {
          'booking status is 200': (r) => r.status === 200,
          'booking success': (r) => r.json('success') === true,
        });
      } else {
        console.error('Booking failed:', bookingRes.status, bookingRes.body);
      }
    }
  }
}