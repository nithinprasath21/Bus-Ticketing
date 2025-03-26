const request = require("supertest");
const app = require("../index");
const OperatorService = require("../services/operatorService");

jest.mock("../services/operatorService");

describe("Operator Controller", () => {
  it("should register an operator", async () => {
    const mockOperator = { name: "Operator", email: "op@test.com" };
    OperatorService.registerOperator.mockResolvedValue(mockOperator);

    const res = await request(app).post("/api/operators/register").send(mockOperator);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockOperator));
  });

  it("should create a trip", async () => {
    const mockTrip = { from: "CityA", to: "CityB" };
    OperatorService.createTrip.mockResolvedValue(mockTrip);

    const res = await request(app).post("/api/trips").send(mockTrip);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockTrip));
  });
});
