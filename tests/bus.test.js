const request = require("supertest");
const app = require("../index");
const BusService = require("../services/busService");
const BusRepository = require("../repositories/busRepository");

jest.mock("../services/busService");
jest.mock("../repositories/busRepository");

describe("Bus API", () => {
  test("GET /api/buses - should return all buses", async () => {
    BusService.getAllBuses.mockResolvedValue([{ name: "Bus1" }, { name: "Bus2" }]);

    const res = await request(app).get("/api/buses");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: "Bus1" }, { name: "Bus2" }]);
  });

  test("POST /api/buses - should create a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusService.createBus.mockResolvedValue(busData);

    const res = await request(app).post("/api/buses").send(busData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(busData);
  });

  test("Service - should create a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusRepository.createBus.mockResolvedValue(busData);

    const result = await BusService.createBus(busData);

    expect(result).toEqual(busData);
  });

  test("Service - should fetch all buses", async () => {
    BusRepository.getAllBuses.mockResolvedValue([{ name: "Bus1" }, { name: "Bus2" }]);

    const result = await BusService.getAllBuses();

    expect(result).toEqual([{ name: "Bus1" }, { name: "Bus2" }]);
  });
});
