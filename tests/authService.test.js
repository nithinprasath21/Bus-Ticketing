const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");

jest.mock("../repositories/userRepository");
jest.mock("bcrypt");

describe("AuthService", () => {
  it("should register a new user", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.createUser.mockResolvedValue({ name: "John", email: "john@example.com", role: "passenger" });

    const user = await authService.registerUser("John", "john@example.com", "password123", "passenger");

    expect(user).toHaveProperty("email", "john@example.com");
  });

  it("should throw error if user already exists", async () => {
    userRepository.findByEmail.mockResolvedValue({ email: "existing@example.com" });

    await expect(authService.registerUser("John", "existing@example.com", "password", "passenger"))
      .rejects.toThrow("User already exists");
  });

  it("should login a user with valid credentials", async () => {
    bcrypt.compare.mockResolvedValue(true);
    userRepository.findByEmail.mockResolvedValue({ email: "user@example.com", password: "hashedpass", role: "operator" });

    const response = await authService.loginUser("user@example.com", "password123");

    expect(response).toHaveProperty("role", "operator");
  });
});
