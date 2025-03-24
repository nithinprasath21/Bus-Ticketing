const mongoose = require("mongoose");
const UserRepository = require("../repositories/userRepository");
const User = require("../models/userSchema");
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

test("should create a new user", async () => {
  const user = await UserRepository.createUser({ name: "Test", email: "test@example.com" });
  expect(user.email).toBe("test@example.com");
});

describe("UserRepository Tests", () => {
  it("should create a new user", async () => {
    const mockUser = new User({ email: "test@example.com", password: "hashedPass" });
    const savedUser = await UserRepository.createUser(mockUser);

    expect(savedUser.email).toBe("test@example.com");
  });

  it("should find a user by email", async () => {
    await User.create({ email: "test@example.com", password: "hashedPass" });

    const user = await UserRepository.findByEmail("test@example.com");
    expect(user).not.toBeNull();
    expect(user.email).toBe("test@example.com");
  });
});
