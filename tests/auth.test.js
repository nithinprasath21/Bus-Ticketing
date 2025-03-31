const request = require("supertest");
const app = require("../index");
const AuthService = require("../services/authService");
const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

jest.mock("../services/authService");
jest.mock("../repositories/userRepository");

describe("Authentication API", () => {
  test("Registers a user successfully", async () => {
    AuthService.register.mockResolvedValue({ email: "test@example.com", _id: "12345", role: "passenger", phone: "1234567890", name: "Test User" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456", name: "Test User", role: "passenger", phone: "1234567890" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("Returns 400 if user already exists", async () => {
    AuthService.register.mockRejectedValue(new Error("User already exists"));

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456", name: "Test User", role: "passenger", phone: "1234567890" });

    expect(res.status).toBe(400);
  });

  test("Returns JWT on successful login", async () => {
    AuthService.login.mockResolvedValue("mockedJwtToken");

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Returns 401 for invalid login", async () => {
    AuthService.login.mockRejectedValue(new Error("Invalid credentials"));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongPass" });

    expect(res.status).toBe(401);
  });
});
