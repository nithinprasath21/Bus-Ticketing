const request = require("supertest");
const app = require("../index");
const OperatorService = require("../services/operatorService");

jest.mock("../services/operatorService");

describe("Operator Controller Tests", () => {
  it("should register an operator", async () => {
    OperatorService.registerOperator.mockResolvedValue({ name: "Operator", email: "op@test.com" });

    const response = await request(app).post("/api/operators/register").send({
      name: "Operator",
      email: "op@test.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should create a trip", async () => {
    OperatorService.createTrip.mockResolvedValue({ from: "CityA", to: "CityB" });

    const response = await request(app).post("/api/trips").send({
      from: "CityA",
      to: "CityB",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
