const request = require("supertest");
const app = require("../index");
const AdminService = require("../services/adminService");
const AdminRepository = require("../repositories/adminRepository");

jest.mock("../services/adminService");
jest.mock("../repositories/adminRepository");

describe("Admin API", () => {
  test("GET /api/admin/users returns all users", async () => {
    AdminService.getAllUsers.mockResolvedValue([{ id: "1", name: "John Doe" }]);

    const response = await request(app).get("/api/admin/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "1", name: "John Doe" }]);
  });

  test("Blocks a user", async () => {
    AdminRepository.updateUserStatus.mockResolvedValue({ id: "1", isActive: false });

    const result = await AdminService.blockUser("1");

    expect(result.isActive).toBe(false);
  });

  test("Verifies an operator", async () => {
    AdminRepository.verifyOperator.mockResolvedValue({ id: "2", isVerified: true });

    const result = await AdminService.verifyOperator("2");

    expect(result.isVerified).toBe(true);
  });
});
