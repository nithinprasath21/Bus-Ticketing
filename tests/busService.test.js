const BusService = require("../services/busService");
const BusRepository = require("../repositories/busRepository");

jest.mock("../repositories/busRepository");

describe("BusService", () => {
  it("should create a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusRepository.createBus.mockResolvedValue(busData);

    const result = await BusService.createBus(busData);
    expect(result).toEqual(busData);
  });

  it("should fetch all buses", async () => {
    const mockBuses = [{ name: "Bus1" }, { name: "Bus2" }];
    BusRepository.getAllBuses.mockResolvedValue(mockBuses);

    const result = await BusService.getAllBuses();
    expect(result).toEqual(mockBuses);
  });
});
