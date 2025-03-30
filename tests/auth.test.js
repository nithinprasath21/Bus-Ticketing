const request = require("supertest");
const app = require("../index");
const AuthService = require("../services/authService");
const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

jest.mock("../services/authService");
jest.mock("../repositories/userRepository");

describe("Authentication API", () => {
  test("Registers a user successfully", async () => {
    AuthService.register.mockResolvedValue({ email: "test@example.com", _id: "12345" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("Returns 400 if user already exists", async () => {
    AuthService.register.mockRejectedValue(new Error("User already exists"));

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

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

describe("Authentication Service", () => {
  test("Hashes password and registers a user", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.createUser.mockResolvedValue({ email: "test@example.com", _id: "12345" });

    const user = await AuthService.register({ email: "test@example.com", password: "123456" });

    expect(user).toHaveProperty("_id");
    expect(user.email).toBe("test@example.com");
  });

  test("Throws error if user already exists", async () => {
    UserRepository.findByEmail.mockResolvedValue({ email: "test@example.com" });

    await expect(AuthService.register({ email: "test@example.com", password: "123456" }))
      .rejects.toThrow("User already exists");
  });

  test("Returns JWT on valid login", async () => {
    UserRepository.findByEmail.mockResolvedValue({ email: "test@example.com", password: "hashedPass" });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const token = await AuthService.login("test@example.com", "correctPassword");

    expect(token).toBeDefined();
  });

  test("Throws error for invalid login", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);

    await expect(AuthService.login("invalid@example.com", "wrongPassword"))
      .rejects.toThrow("Invalid credentials");
  });
});
