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
        role: "passenger",
        password: await bcrypt.hash("password123", 10),
      };

      userModel.findOne.mockResolvedValue(mockUser);

      const token = await authService.login("test@example.com", "password123");

      expect(typeof token).toBe("string");
      const decoded = jwt.decode(token);
      expect(decoded.id).toBe("user123");
      expect(decoded.role).toBe("passenger");
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

  describe("forgotPassword", () => {
    it("should return true if user exists", async () => {
      userModel.findOne.mockResolvedValue({ email: "test@example.com" });

      const result = await authService.forgotPassword("test@example.com");
      expect(result).toBe(true);
    });

    it("should throw error if user not found", async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(authService.forgotPassword("missing@example.com")).rejects.toThrow(
        "User not found"
      );
    });
  });
});
describe("AuthRepository", () => {
  let authRepository;

  beforeEach(() => {
    authRepository = new AuthRepository();
    jest.clearAllMocks();
  });

  describe("findUserById", () => {
    it("should find a user by ID", async () => {
      const mockUser = { _id: "user123", name: "John" };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await authRepository.findUserById("user123");

      expect(userModel.findById).toHaveBeenCalledWith("user123");
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
