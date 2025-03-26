const AuthService = require("../services/authService");
const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

jest.mock("../repositories/userRepository");

describe("Auth Service", () => {
  test("hashes password and registers user", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.createUser.mockResolvedValue({ email: "test@example.com", _id: "12345" });

    const user = await AuthService.register({ email: "test@example.com", password: "123456" });

    expect(user).toHaveProperty("_id");
    expect(user.email).toBe("test@example.com");
  });

  test("throws error if user exists", async () => {
    UserRepository.findByEmail.mockResolvedValue({ email: "test@example.com" });

    await expect(AuthService.register({ email: "test@example.com", password: "123456" }))
      .rejects.toThrow("User already exists");
  });

  test("returns JWT on login", async () => {
    UserRepository.findByEmail.mockResolvedValue({ email: "test@example.com", password: "hashedPass" });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const token = await AuthService.login("test@example.com", "correctPassword");

    expect(token).toBeDefined();
  });

  test("throws error on invalid login", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);

    await expect(AuthService.login("invalid@example.com", "wrongPassword"))
      .rejects.toThrow("Invalid credentials");
  });
});
