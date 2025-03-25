const request = require("supertest");
const app = require("../server"); // Your Express server file
const BusService = require("../services/busService");

jest.mock("../services/busService");

describe("BusController API", () => {
  it("should return all buses", async () => {
    const mockBuses = [{ name: "Bus1" }, { name: "Bus2" }];
    BusService.getAllBuses.mockResolvedValue(mockBuses);

    const res = await request(app).get("/api/buses");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBuses);
  });

  it("should create a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusService.createBus.mockResolvedValue(busData);

    const res = await request(app).post("/api/buses").send(busData);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(busData);
  });
});
