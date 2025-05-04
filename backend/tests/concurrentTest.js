const axios = require("axios");

const users = [
  { email: "passenger1@example.com", password: "pass123" },
  { email: "passenger2@example.com", password: "pass123" },
  { email: "passenger3@example.com", password: "pass123" },
  { email: "passenger4@example.com", password: "pass123" },
  { email: "passenger5@example.com", password: "pass123" },
];

const executionOrder = [
  "passenger3@example.com",
  "passenger5@example.com",
  "passenger1@example.com",
  "passenger4@example.com",
  "passenger2@example.com",
];
const orderedUsers = executionOrder.map(email =>
  users.find(user => user.email === email)
);

const loginUrl = "http://localhost:3000/api/auth/login";
const bookingUrl = "http://localhost:3000/api/passenger/bookings";
const bookingPayload = {
  tripId: "681211274651b87fd4248b3b",
  selectedSeats: ["a4"],
};

async function loginAndBook(user) {
  try {
    console.log(`[${user.email}] Logging in...`);
    const loginResponse = await axios.post(loginUrl, user);
    const token = loginResponse.data.data.token;

    console.log(`[${user.email}] Booking ticket...`);
    const bookingResponse = await axios.post(
      bookingUrl,
      bookingPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = bookingResponse.data;
    const isSuccess = responseData.success === true;

    return {
      user: user.email,
      status: isSuccess ? "success" : "failed",
      response: responseData,
    };
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    return {
      user: user.email,
      status: "failed",
      response: errorMsg,
    };
  }
}

(async () => {
  const results = await Promise.allSettled(
    orderedUsers.map(user => loginAndBook(user))
  );

  console.log("\n=== Booking Results ===\n");

  results.forEach((result, index) => {
    const email = orderedUsers[index].email;

    if (result.status === "fulfilled") {
      const { status, response } = result.value;
      const symbol = status === "success" ? "✅" : "❌";
      console.log(`${symbol} ${email}:`);
      console.dir(response, { depth: null });
    } else {
      console.log(`❌ ${email}: Unexpected error`);
      console.error(result.reason);
    }

    console.log("---------------------------------------------------");
  });
})();
