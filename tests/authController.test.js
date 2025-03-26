const request = require("supertest");
const app = require("../index");
const AuthService = require("../services/authService");

jest.mock("../services/authService");

describe("Auth Controller", () => {
  test("registers a user", async () => {
    AuthService.register.mockResolvedValue({ email: "test@example.com", _id: "12345" });

    const res = await request(app).post("/api/auth/register").send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("returns 400 if user exists", async () => {
    AuthService.register.mockRejectedValue(new Error("User already exists"));

    const res = await request(app).post("/api/auth/register").send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(400);
  });

  test("returns JWT on login", async () => {
    AuthService.login.mockResolvedValue("mockedJwtToken");

    const res = await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("returns 401 if login fails", async () => {
    AuthService.login.mockRejectedValue(new Error("Invalid credentials"));

    const res = await request(app).post("/api/auth/login").send({ email: "wrong@example.com", password: "wrongPass" });

    expect(res.status).toBe(401);
  });
});
