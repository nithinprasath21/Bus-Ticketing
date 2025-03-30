const request = require("supertest");
const app = require("../index");
const OperatorService = require("../services/operatorService");
const OperatorRepository = require("../repositories/operatorRepository");

jest.mock("../services/operatorService");
jest.mock("../repositories/operatorRepository");

describe("Operator API", () => {
  test("POST /api/operators/register - should register an operator", async () => {
    const mockOperator = { name: "Operator", email: "op@test.com" };
    OperatorService.registerOperator.mockResolvedValue(mockOperator);

    const res = await request(app).post("/api/operators/register").send(mockOperator);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockOperator));
  });

  test("POST /api/trips - should create a trip", async () => {
    const mockTrip = { from: "CityA", to: "CityB" };
    OperatorService.createTrip.mockResolvedValue(mockTrip);

    const res = await request(app).post("/api/trips").send(mockTrip);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockTrip));
  });

  test("Service - should register an operator", async () => {
    const mockOperator = { name: "Test Operator", email: "test@test.com" };
    OperatorRepository.createOperator.mockResolvedValue(mockOperator);

    const result = await OperatorService.registerOperator(mockOperator);

    expect(result).toEqual(mockOperator);
  });

  test("Service - should create a trip", async () => {
    const mockTrip = { from: "CityA", to: "CityB" };
    OperatorRepository.createTrip.mockResolvedValue(mockTrip);

    const result = await OperatorService.createTrip(mockTrip);

    expect(result).toEqual(mockTrip);
  });
});
