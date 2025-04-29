import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

let accessTokens = {};

const users = [
  { email: 'passenger1@example.com', password: 'pass123' },
  { email: 'passenger2@example.com', password: 'pass123' },
  { email: 'passenger3@example.com', password: 'pass123' },
];

export const options = {
  scenarios: {
    auth_load: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      exec: 'auth',
    },
    search_load: {
      executor: 'constant-arrival-rate',
      rate: 5,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 20,
      exec: 'searchBus',
    },
    booking_load: {
      executor: 'constant-arrival-rate',
      rate: 3,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 20,
      exec: 'bookTrip',
    },
  },
};

function getRandomUser() {
  return users[Math.floor(Math.random() * users.length)];
}

export function auth() {
  const user = getRandomUser();
  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/api/auth/login`, payload, params);

  check(res, {
    'login success': (r) => r.status === 200 && r.json('accessToken') !== undefined,
  });

  if (res.status === 200) {
    accessTokens[__VU] = res.json('accessToken');
  }

  sleep(1);
}

export function searchBus() {
  const payload = JSON.stringify({
    source: "Coimbatore",
    destination: "Banglore",
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/passenger/buses/search`, payload, params);

  check(res, {
    'search bus success': (r) => r.status === 200,
    'buses found or handled': (r) => r.json('data') !== undefined,
  });

  sleep(1);
}

export function bookTrip() {
  const user = getRandomUser();
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });
  const loginParams = {
    headers: { 'Content-Type': 'application/json' },
  };
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, loginParams);

  check(loginRes, {
    'login success': (r) => r.status === 200 && r.json('accessToken') !== undefined,
  });

  if (loginRes.status !== 200) {
    console.error('Login failed, skipping booking');
    return;
  }

  const token = loginRes.json('accessToken');

  const bookPayload = JSON.stringify({
    tripId: "680d499328c1c7fc12d1999a",
    selectedSeats: ["a1", "a2"],
  });
  const bookParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  const res = http.post(`${BASE_URL}/passenger/bookings`, bookPayload, bookParams);

  check(res, {
    'booking success': (r) => r.status === 200 || r.status === 201,
    'ticket booked': (r) => r.json('success') === true,
  });

  sleep(1);
}