require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthRepository = require("../repositories/authRepository");
const AuthService = require("../services/authService");
const userModel = require("../models/userModel");

jest.mock("../models/userModel");

describe("AuthService Unit Tests", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user if email is not taken", async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue({ name: "Test User" });

      const result = await authService.register({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        password: "password123",
        role: "passenger",
      });

      expect(userModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: "Test User" });
    });

    it("should throw an error if email already exists", async () => {
      userModel.findOne.mockResolvedValue({ email: "test@example.com" });

      await expect(
        authService.register({
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          password: "password123",
          role: "passenger",
        })
      ).rejects.toThrow("User already exists with this email");
    });
  });

  describe("login", () => {
    it("should return JWT token on valid credentials", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        role: "passenger",
        password: await bcrypt.hash("password123", 10),
      };
      userModel.findOne.mockResolvedValue(mockUser);
      const result = await authService.login("test@example.com", "password123");
      expect(typeof result.token).toBe("string");
      const decoded = jwt.decode(result.token);
      expect(decoded.id).toBe("user123");
      expect(decoded.role).toBe("passenger");
      expect(result.email).toBe("test@example.com");
      expect(result.role).toBe("passenger");
    });

    it("should throw error if user not found", async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(authService.login("test@example.com", "password123")).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error if password is incorrect", async () => {
      const mockUser = {
        _id: "user123",
        role: "passenger",
        password: await bcrypt.hash("correct-password", 10),
      };

      userModel.findOne.mockResolvedValue(mockUser);

      await expect(authService.login("test@example.com", "wrong-password")).rejects.toThrow(
        "Invalid email or password"
      );
    });
  });

  describe("logout", () => {
    it("should always return true", async () => {
      const result = await authService.logout({ id: "u1" });
      expect(result).toBe(true);
    });
  });

  describe("updateForgottenPassword", () => {
    it("should return true if user exists", async () => {
      const email = "test@example.com";
      const password = "newPassword123";
      const hashed = await bcrypt.hash(password, 10);
      userModel.findOne.mockResolvedValue({ email });
      userModel.updateOne.mockResolvedValue({ acknowledged: true });
      const result = await authService.updateForgottenPassword(email, password);
      expect(result).toBe(true);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { email },
        expect.objectContaining({ $set: { password: expect.any(String) } })
      );
    });
    it("should throw error if user not found", async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(authService.updateForgottenPassword("missing@example.com", "any"))
        .rejects
        .toThrow("Email does not exist");
    });
  });
});

describe("AuthRepository", () => {
  let authRepository;

  beforeEach(() => {
    authRepository = new AuthRepository();
    jest.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const mockUser = { _id: "user123", email: "john@example.com", name: "John" };
      userModel.findOne.mockResolvedValue(mockUser);
      const result = await authRepository.findUserByEmail("john@example.com");
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(result).toEqual(mockUser);
    });
  });

  describe("updateUser", () => {
    it("should update a user by ID", async () => {
      const updateData = { name: "Updated" };
      const updatedUser = { _id: "user123", ...updateData };

      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await authRepository.updateUser("user123", updateData);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user123", updateData, { new: true });
      expect(result).toEqual(updatedUser);
    });
  });

  describe("saveUser", () => {
    it("should save the user instance", async () => {
      const mockUserInstance = { save: jest.fn().mockResolvedValue(true) };

      const result = await authRepository.saveUser(mockUserInstance);

      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
