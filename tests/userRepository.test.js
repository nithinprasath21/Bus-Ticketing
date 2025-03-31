const mongoose = require("mongoose");
const UserRepository = require("../repositories/userRepository");
const User = require("../models/userModel");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User Repository", () => {
  test("should create a new user", async () => {
    const user = await UserRepository.createUser({ name: "Test", email: "test@example.com", password: "123456", phone: "1234567890", role: "passenger" });

    expect(user.email).toBe("test@example.com");
  });

  test("should find a user by email", async () => {
    await User.create({ name: "Test", email: "test@example.com", password: "hashedPass", phone: "1234567890", role: "passenger" });

    const user = await UserRepository.findByEmail("test@example.com");

    expect(user).not.toBeNull();
    expect(user.email).toBe("test@example.com");
  });
});
