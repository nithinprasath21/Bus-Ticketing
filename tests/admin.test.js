const request = require("supertest");
const app = require("../index");
const AdminService = require("../services/adminService");
const AdminRepository = require("../repositories/adminRepository");

jest.mock("../services/adminService");
jest.mock("../repositories/adminRepository");

describe("Admin API", () => {
  test("GET /api/admin/users returns all users", async () => {
    AdminService.getAllUsers.mockResolvedValue([{ _id: "1", name: "John Doe", email: "john@example.com", role: "passenger", phone: "1234567890" }]);

    const response = await request(app).get("/api/admin/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ _id: "1", name: "John Doe", email: "john@example.com", role: "passenger", phone: "1234567890" }]);
  });

  test("Blocks a user", async () => {
    AdminRepository.updateUserStatus.mockResolvedValue({ _id: "1", isBlocked: true });

    const result = await AdminService.blockUser("1");

    expect(result.isBlocked).toBe(true);
  });

  test("Verifies an operator", async () => {
    AdminRepository.verifyOperator.mockResolvedValue({ _id: "2", isVerified: true });

    const result = await AdminService.verifyOperator("2");

    expect(result.isVerified).toBe(true);
  });
});
