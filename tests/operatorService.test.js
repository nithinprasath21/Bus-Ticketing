const OperatorService = require("../services/operatorService");
const OperatorRepository = require("../repositories/operatorRepository");

jest.mock("../repositories/operatorRepository");

describe("Operator Service Tests", () => {
  it("should register an operator", async () => {
    const mockOperator = { name: "Test Operator", email: "test@test.com" };
    OperatorRepository.createOperator.mockResolvedValue(mockOperator);

    const result = await OperatorService.registerOperator(mockOperator);
    expect(result).toEqual(mockOperator);
  });

  it("should create a trip", async () => {
    const mockTrip = { from: "CityA", to: "CityB" };
    OperatorRepository.createTrip.mockResolvedValue(mockTrip);

    const result = await OperatorService.createTrip(mockTrip);
    expect(result).toEqual(mockTrip);
  });
});
