const request = require("supertest");
const app = require("../index");
const BusService = require("../services/busService");
const BusRepository = require("../repositories/busRepository");

jest.mock("../services/busService");
jest.mock("../repositories/busRepository");

describe("Bus API", () => {
  test("GET /api/buses - should return all buses", async () => {
    BusService.getAllBuses.mockResolvedValue([{ busName: "Bus1" }, { busName: "Bus2" }]);

    const res = await request(app).get("/api/buses");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ busName: "Bus1" }, { busName: "Bus2" }]);
  });

  test("POST /api/buses - should create a bus", async () => {
    const busData = { busName: "Express", busType: "AC", totalSeats: 50, operatorId: "operator123", amenities: ["WiFi", "TV"] };
    BusService.createBus.mockResolvedValue(busData);

    const res = await request(app).post("/api/buses").send(busData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(busData);
  });
});
