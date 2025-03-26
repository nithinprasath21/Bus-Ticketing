const BusService = require("../services/busService");
const BusRepository = require("../repositories/busRepository");

jest.mock("../repositories/busRepository");

describe("Bus Service", () => {
  test("creates a bus", async () => {
    const busData = { name: "Express", seats: 50 };
    BusRepository.createBus.mockResolvedValue(busData);

    const result = await BusService.createBus(busData);

    expect(result).toEqual(busData);
  });

  test("fetches all buses", async () => {
    BusRepository.getAllBuses.mockResolvedValue([{ name: "Bus1" }, { name: "Bus2" }]);

    const result = await BusService.getAllBuses();

    expect(result).toEqual([{ name: "Bus1" }, { name: "Bus2" }]);
  });
});
