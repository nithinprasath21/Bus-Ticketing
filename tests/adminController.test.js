const request = require("supertest");
const express = require("express");
const adminRoutes = require("../routes/adminRoutes");
const AdminService = require("../services/adminService");

jest.mock("../services/adminService");

const app = express();
app.use(express.json());
app.use("/api/admin", adminRoutes);

describe("Admin Controller", () => {
  test("GET /api/admin/users returns all users", async () => {
    AdminService.getAllUsers.mockResolvedValue([{ id: "1", name: "John Doe" }]);

    const response = await request(app).get("/api/admin/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "1", name: "John Doe" }]);
  });
});
