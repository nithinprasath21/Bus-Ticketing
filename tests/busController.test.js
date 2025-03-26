const request = require("supertest");
const app = require("../index");
const BusService = require("../services/busService");

jest.mock("../services/busService");

describe("Bus Controller", () => {
  test("returns all buses", async () => {
    BusService.getAllBuses.mockResolvedValue([{ name: "Bus1" }, { name: "Bus2" }]);

    const res = await request(app).get("/api/buses");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: "Bus1" }, { name: "Bus2" }]);
  });

  test("creates a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusService.createBus.mockResolvedValue(busData);

    const res = await request(app).post("/api/buses").send(busData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(busData);
  });
});
