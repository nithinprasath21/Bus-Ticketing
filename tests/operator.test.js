const request = require("supertest");
const app = require("../index");
const OperatorService = require("../services/operatorService");
const OperatorRepository = require("../repositories/operatorRepository");

jest.mock("../services/operatorService");
jest.mock("../repositories/operatorRepository");

describe("Operator API", () => {
  test("POST /api/operators/register - should register an operator", async () => {
    const mockOperator = { operatorName: "Operator", contactEmail: "op@test.com", phone: "1234567890" };
    OperatorService.registerOperator.mockResolvedValue(mockOperator);

    const res = await request(app).post("/api/operators/register").send(mockOperator);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockOperator));
  });

  test("POST /api/trips - should create a trip", async () => {
    const mockTrip = { source: "CityA", destination: "CityB", busId: "bus123", operatorId: "operator123", departureTime: new Date(), arrivalTime: new Date(), price: 100, availableSeats: ["A1", "A2"] };
    OperatorService.createTrip.mockResolvedValue(mockTrip);

    const res = await request(app).post("/api/trips").send(mockTrip);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(mockTrip));
  });
});
