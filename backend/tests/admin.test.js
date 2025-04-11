const AdminService = require('../services/adminService.js');
const userModel = require('../models/userModel.js');
const tripModel = require('../models/tripModel.js');
const bookingModel = require('../models/bookingModel.js');

jest.mock('../models/userModel.js');
jest.mock('../models/tripModel.js');
jest.mock('../models/bookingModel.js');

describe('AdminService Unit Tests (with mocked models)', () => {
  let adminService;

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user if found', async () => {
      const mockUser = { id: '1', name: 'Test' };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.getUser('1');
      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.getUser('123')).rejects.toThrow('User is not found');
    });
  });

  describe('blockUser', () => {
    it('should block user if found', async () => {
      const mockUser = { id: '1', isBlocked: false, save: jest.fn().mockResolvedValue({ isBlocked: true }) };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.blockUser('1');
      expect(mockUser.isBlocked).toBe(true);
      expect(result).toEqual({ isBlocked: true });
    });

    it('should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.blockUser('1')).rejects.toThrow('User is not found');
    });
  });

  describe('unblockUser', () => {
    it('should unblock user if found', async () => {
      const mockUser = { id: '1', isBlocked: true, save: jest.fn().mockResolvedValue({ isBlocked: false }) };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.unblockUser('1');
      expect(mockUser.isBlocked).toBe(false);
      expect(result).toEqual({ isBlocked: false });
    });

    it('should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.unblockUser('1')).rejects.toThrow('User is not found');
    });
  });

  describe('approveOperator', () => {
    it('should verify operator if valid', async () => {
      const mockOperator = { id: 'op1', role: 'operator', isVerified: false, save: jest.fn().mockResolvedValue({ isVerified: true }) };
      userModel.findById.mockResolvedValue(mockOperator);

      const result = await adminService.approveOperator('op1');
      expect(mockOperator.isVerified).toBe(true);
      expect(result).toEqual({ isVerified: true });
    });

    it('should throw error if operator not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.approveOperator('bad')).rejects.toThrow('Operator is not found');
    });

    it('should throw error if user is not an operator', async () => {
      userModel.findById.mockResolvedValue({ id: 'op2', role: 'passenger' });
      await expect(adminService.approveOperator('op2')).rejects.toThrow('Operator is not found');
    });
  });

  describe('cancelTrip', () => {
    it('should cancel a valid trip', async () => {
      const trip = { id: 'trip1', status: 'active', save: jest.fn().mockResolvedValue({ status: 'Cancelled' }) };
      tripModel.findById.mockResolvedValue(trip);

      const result = await adminService.cancelTrip('trip1');
      expect(trip.status).toBe('Cancelled');
      expect(result.status).toBe('Cancelled');
    });

    it('should throw error if trip not found', async () => {
      tripModel.findById.mockResolvedValue(null);
      await expect(adminService.cancelTrip('bad')).rejects.toThrow('Trip is not found');
    });

    it('should throw error if trip already cancelled', async () => {
      const trip = { id: 'trip2', status: 'Cancelled' };
      tripModel.findById.mockResolvedValue(trip);
      await expect(adminService.cancelTrip('trip2')).rejects.toThrow('Trip is already cancelled');
    });
  });

  describe('deletePassengerBooking', () => {
    it('should delete booking if valid passenger', async () => {
      const booking = { id: 'b1', passenger: 'u1', toString: () => 'u1' };
      bookingModel.findById.mockResolvedValue(booking);
      bookingModel.findByIdAndDelete.mockResolvedValue(true);

      const result = await adminService.deletePassengerBooking('u1', 'b1');
      expect(result).toBe(true);
    });

    it('should throw error if booking not found', async () => {
      bookingModel.findById.mockResolvedValue(null);
      await expect(adminService.deletePassengerBooking('u1', 'bad')).rejects.toThrow('Booking not found');
    });

    it('should throw error if user unauthorized', async () => {
      const booking = { id: 'b2', passenger: 'someoneElse', toString: () => 'someoneElse' };
      bookingModel.findById.mockResolvedValue(booking);
      await expect(adminService.deletePassengerBooking('u1', 'b2')).rejects.toThrow('Unauthorized to delete this booking');
    });
  });
});
