const request = require("supertest");
const app = require("../index");
const UserRepository = require("../repositories/userRepository");
const AuthService = require("../services/authService");

jest.mock("../repositories/userRepository");
jest.mock("../services/authService");

describe("AuthController Tests", () => {
  it("should register a user and return 201 status", async () => {
    AuthService.register.mockResolvedValue({ email: "test@example.com", _id: "12345" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if user already exists", async () => {
    AuthService.register.mockRejectedValue(new Error("User already exists"));

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(400);
  });

  it("should return a JWT token on successful login", async () => {
    AuthService.login.mockResolvedValue("mockedJwtToken");

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should return 401 if login credentials are invalid", async () => {
    AuthService.login.mockRejectedValue(new Error("Invalid credentials"));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongPass" });

    expect(res.status).toBe(401);
  });
});
