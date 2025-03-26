const AdminService = require("../services/adminService");
const AdminRepository = require("../repositories/adminRepository");

jest.mock("../repositories/adminRepository");

describe("Admin Service", () => {
  test("returns all users", async () => {
    AdminRepository.getAllUsers.mockResolvedValue([{ id: "1", name: "John Doe" }]);
    const users = await AdminService.getAllUsers();
    expect(users).toEqual([{ id: "1", name: "John Doe" }]);
  });

  test("blocks a user", async () => {
    AdminRepository.updateUserStatus.mockResolvedValue({ id: "1", isActive: false });

    const result = await AdminService.blockUser("1");

    expect(result.isActive).toBe(false);
  });

  test("verifies an operator", async () => {
    AdminRepository.verifyOperator.mockResolvedValue({ id: "2", isVerified: true });

    const result = await AdminService.verifyOperator("2");

    expect(result.isVerified).toBe(true);
  });
});
