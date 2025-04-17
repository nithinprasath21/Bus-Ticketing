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

  describe('AdminRepository', () => {
    const AdminRepository = require('../repositories/adminRepository');
    const userModel = require('../models/userModel');
  
    const adminRepository = new AdminRepository();
  
    describe('updateUser', () => {
      it('should call userModel.findByIdAndUpdate with correct params', async () => {
        const userId = 'user123';
        const updateData = { isBlocked: true };
        const updatedUser = { id: userId, isBlocked: true };
  
        userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);
  
        const result = await adminRepository.updateUser(userId, updateData);
  
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
        expect(result).toEqual(updatedUser);
      });
    });
  });  

  describe('getAllUsers', () => {
    it('should return all passengers', async () => {
      const users = [{ name: 'User1' }, { name: 'User2' }];
      userModel.find.mockResolvedValue(users);

      const result = await adminService.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getOperators', () => {
    it('should return all operators', async () => {
      const operators = [{ name: 'Op1' }];
      userModel.find.mockResolvedValue(operators);

      const result = await adminService.getOperators();
      expect(result).toEqual(operators);
    });
  });

  describe('getOperator', () => {
    it('should return operator if found', async () => {
      const operator = { id: 'op1' };
      userModel.findById.mockResolvedValue(operator);

      const result = await adminService.getOperator('op1');
      expect(result).toEqual(operator);
    });

    it('should throw error if operator not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.getOperator('bad')).rejects.toThrow('Operator is not found');
    });
  });

  describe('blockUnblock', () => {
    it('should block if user is not blocked', async () => {
      const mockUser = { isBlocked: false, save: jest.fn().mockResolvedValue({ isBlocked: true }) };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.blockUnblock('u1');
      expect(mockUser.isBlocked).toBe(true);
      expect(result).toEqual({ isBlocked: true });
    });

    it('should unblock if user is already blocked', async () => {
      const mockUser = { isBlocked: true, save: jest.fn().mockResolvedValue({ isBlocked: false }) };
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.blockUnblock('u1');
      expect(mockUser.isBlocked).toBe(false);
      expect(result).toEqual({ isBlocked: false });
    });

    it('should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(adminService.blockUnblock('u1')).rejects.toThrow('User is not found');
    });
  });

  describe('getAllTrips', () => {
    it('should return all trips', async () => {
      const trips = [{ id: 't1' }];
      tripModel.find.mockResolvedValue(trips);

      const result = await adminService.getAllTrips();
      expect(result).toEqual(trips);
    });
  });

  describe('getTripDetails', () => {
    it('should return trip if found', async () => {
      const trip = { id: 't1' };
      tripModel.findById.mockResolvedValue(trip);

      const result = await adminService.getTripDetails('t1');
      expect(result).toEqual(trip);
    });

    it('should throw error if trip not found', async () => {
      tripModel.findById.mockResolvedValue(null);
      await expect(adminService.getTripDetails('bad')).rejects.toThrow('Trip is not found');
    });
  });

  describe('getPassengerBookings', () => {
    it('should return bookings for a passenger', async () => {
      const bookings = [{ id: 'b1' }];
      bookingModel.find.mockResolvedValue(bookings);

      const result = await adminService.getPassengerBookings('u1');
      expect(result).toEqual(bookings);
    });
  });

  describe('updateTrip', () => {
    it('should update only provided trip fields', async () => {
      const tripData = {
        source: 'CityA',
        destination: 'CityB',
        departureTime: '10:00',
        arrivalTime: '12:00',
        price: 100,
        availableSeats: 30
      };
      const updatedTrip = { ...tripData };
      tripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);

      const result = await adminService.updateTrip(tripData, 'trip1');
      expect(result).toEqual(updatedTrip);
      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith('trip1', { $set: tripData }, { new: true });
    });

    it('should handle partial update data', async () => {
      const tripData = {
        destination: 'NewCity'
      };
      const updatedTrip = { destination: 'NewCity' };
      tripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);

      const result = await adminService.updateTrip(tripData, 'trip1');
      expect(result).toEqual(updatedTrip);
    });

    it('should handle updateTrip when all fields are undefined', async () => {
      const tripData = {};
      const updatedTrip = {};
      tripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);
    
      const result = await adminService.updateTrip(tripData, 'trip1');
      expect(result).toEqual(updatedTrip);
      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith('trip1', { $set: {} }, { new: true });
    });    
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
      const trip = { id: 'trip1', status: 'active', save: jest.fn().mockResolvedValue({ status: 'canceled' }) };
      tripModel.findById.mockResolvedValue(trip);

      const result = await adminService.cancelTrip('trip1');
      expect(trip.status).toBe('canceled');
      expect(result.status).toBe('canceled');
    });

    it('should throw error if trip not found', async () => {
      tripModel.findById.mockResolvedValue(null);
      await expect(adminService.cancelTrip('bad')).rejects.toThrow('Trip is not found');
    });

    it('should throw error if trip already cancelled', async () => {
      const trip = { id: 'trip2', status: 'canceled' };
      tripModel.findById.mockResolvedValue(trip);
      await expect(adminService.cancelTrip('trip2')).rejects.toThrow('Trip is already canceled');
    });
  });

  describe('deletePassengerBooking', () => {
    it('should delete booking if valid passenger', async () => {
      const booking = { id: 'b1', userId: { toString: () => 'u1' } };
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
      const booking = { id: 'b2', userId: { toString: () => 'someoneElse'} };
      bookingModel.findById.mockResolvedValue(booking);
      await expect(adminService.deletePassengerBooking('u1', 'b2')).rejects.toThrow('Unauthorized to delete this booking');
    });
  });
});
