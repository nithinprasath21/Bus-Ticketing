require("dotenv").config();
const OperatorService = require("../services/operatorService");
const busModel = require("../models/busModel");
const tripModel = require("../models/tripModel");

jest.mock("../models/busModel");
jest.mock("../models/tripModel");

describe("OperatorService Unit Tests", () => {
  let operatorService;

  beforeEach(() => {
    operatorService = new OperatorService();
    jest.clearAllMocks();
  });

  describe("getBuses", () => {
    it("should return list of buses", async () => {
      const mockBuses = [{ busName: "Bus 1" }, { busName: "Bus 2" }];
      busModel.find.mockResolvedValue(mockBuses);

      const result = await operatorService.getBuses();
      expect(result).toEqual(mockBuses);
    });
  });

  describe("getBus", () => {
    it("should return a bus by ID", async () => {
      const mockBus = { id: "bus1", busName: "Bus X" };
      busModel.findById.mockResolvedValue(mockBus);

      const result = await operatorService.getBus("bus1");
      expect(result).toEqual(mockBus);
    });

    it("should throw error if bus not found", async () => {
      busModel.findById.mockResolvedValue(null);
      await expect(operatorService.getBus("invalid")).rejects.toThrow("Bus not found");
    });
  });

  describe("createTrip", () => {
    it("should create a trip", async () => {
      const newTrip = { source: "City A", destination: "City B", busId: "bus1" };
      busModel.findById.mockResolvedValue({ id: "bus1", seats: ["1", "2", "3"] });
      tripModel.create.mockResolvedValue(newTrip);
      const result = await operatorService.createTrip(newTrip);
      expect(result).toEqual(newTrip);
    });
  });

  describe("updateBus", () => {
    it("should update and return the updated bus", async () => {
      const updatedBus = { id: "bus1", busName: "Updated Bus" };
      busModel.findByIdAndUpdate.mockResolvedValue(updatedBus);

      const result = await operatorService.updateBus("bus1", { busName: "Updated Bus" });
      expect(result).toEqual(updatedBus);
    });

    it("should throw error if update fails", async () => {
      busModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(operatorService.updateBus("invalid", {})).rejects.toThrow("Bus not found or failed to update");
    });
  });

  describe("deleteBus", () => {
    it("should delete a bus", async () => {
      const deletedBus = { id: "bus1" };
      busModel.findByIdAndDelete.mockResolvedValue(deletedBus);

      await expect(operatorService.deleteBus("bus1")).resolves.toBeUndefined();
    });

    it("should throw error if deletion fails", async () => {
      busModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(operatorService.deleteBus("invalid")).rejects.toThrow("Bus not found or already deleted");
    });
  });

  describe("createTrip", () => {
    it("should create a trip", async () => {
      const newTrip = { source: "City A", destination: "City B" };
      tripModel.create.mockResolvedValue(newTrip);

      const result = await operatorService.createTrip(newTrip);
      expect(result).toEqual(newTrip);
    });
  });

  describe("getMyTrips", () => {
    it("should return trips by operator ID", async () => {
      const mockTrips = [{ operatorId: "op1" }, { operatorId: "op1" }];
      tripModel.find.mockResolvedValue(mockTrips);

      const result = await operatorService.getMyTrips("op1");
      expect(result).toEqual(mockTrips);
    });
  });

  describe("getTrip", () => {
    it("should return a trip by ID", async () => {
      const mockTrip = { id: "trip1", source: "X", destination: "Y" };
      tripModel.findById.mockResolvedValue(mockTrip);

      const result = await operatorService.getTrip("trip1");
      expect(result).toEqual(mockTrip);
    });

    it("should throw error if trip not found", async () => {
      tripModel.findById.mockResolvedValue(null);
      await expect(operatorService.getTrip("bad")).rejects.toThrow("Trip not found");
    });
  });

  describe("updateTrip", () => {
    it("should update and return trip", async () => {
      const updatedTrip = { id: "trip1", status: "updated" };
      tripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);

      const result = await operatorService.updateTrip("trip1", { status: "updated" });
      expect(result).toEqual(updatedTrip);
    });

    it("should throw error if update fails", async () => {
      tripModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(operatorService.updateTrip("invalid", {})).rejects.toThrow("Trip not found or failed to update");
    });
  });

  describe("deleteTrip", () => {
    it("should delete a trip", async () => {
      const deletedTrip = { id: "trip1" };
      tripModel.findByIdAndDelete.mockResolvedValue(deletedTrip);

      await expect(operatorService.deleteTrip("trip1")).resolves.toBeUndefined();
    });

    it("should throw error if deletion fails", async () => {
      tripModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(operatorService.deleteTrip("bad")).rejects.toThrow("Trip not found or already deleted");
    });
  });

  describe("cancelTrip", () => {
    it("should cancel and return trip", async () => {
      const canceledTrip = { id: "trip1", status: "canceled" };
      tripModel.findByIdAndUpdate.mockResolvedValue(canceledTrip);

      const result = await operatorService.cancelTrip("trip1");
      expect(result.status).toBe("canceled");
    });

    it("should throw error if cancel fails", async () => {
      tripModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(operatorService.cancelTrip("bad")).rejects.toThrow("Trip not found or already canceled");
    });
  });
});
