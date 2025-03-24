const AuthService = require("../services/authService");
const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");

jest.mock("../repositories/userRepository");

describe("AuthService Tests", () => {
  it("should hash password and register a new user", async () => {
    const mockUser = { email: "test@example.com", password: "123456" };
    
    // Mock UserRepository behavior
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.createUser.mockResolvedValue({ ...mockUser, _id: "12345" });

    const user = await AuthService.register(mockUser);
    
    expect(user).toHaveProperty("_id");
    expect(user.email).toBe(mockUser.email);
  });

  it("should throw an error if email already exists", async () => {
    UserRepository.findByEmail.mockResolvedValue({ email: "test@example.com" });

    await expect(AuthService.register({ email: "test@example.com", password: "123456" }))
      .rejects.toThrow("User already exists");
  });

  it("should validate user login and return a JWT token", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const token = await AuthService.login(mockUser.email, "correctPassword");

    expect(token).toBeDefined();
  });

  it("should throw an error if login credentials are invalid", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);

    await expect(AuthService.login("invalid@example.com", "wrongPassword"))
      .rejects.toThrow("Invalid credentials");
  });
});
