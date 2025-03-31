# Bus Ticketing System

## Overview
The **Bus Ticketing System** is a web application built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). This platform allows users to search, book, and manage bus tickets, while enabling bus operators to manage their trips. Admins oversee the entire system to ensure smooth operation.

---

## Frontend Modules
The frontend is built using **React.js** and includes the following modules:

1. **User Authentication**
   - Register/Login with email/phone
   - Profile management
   
2. **Bus Search & Filtering**
   - Search buses based on source, destination, date, and type
   - Apply filters (price range, ratings, time, etc.)

3. **Ticket Booking System**
   - View available seats in real-time
   - Select and book seats
   - Apply discount codes
   
4. **Payments & Booking Management**
   - Secure online payment gateway integration
   - View booking history & cancellations
   
5. **Operator Dashboard**
   - Create & manage bus trips
   - View seat occupancy and bookings
   
6. **Admin Panel**
   - Monitor users and operators
   - Enforce platform policies
   
---

## Backend Modules and Architecture
The backend is built using **Node.js and Express.js** and consists of:

### **1. Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (Passenger, Operator, Admin)

### **2. Bus Management**
   - Operators can add, update, and remove bus details
   - Manage bus types and amenities

### **3. Trip Scheduling**
   - Operators can schedule trips with departure & arrival times
   - Modify trip details dynamically

### **4. Ticket Booking & Payments**
   - Real-time seat selection and booking
   - Payment integration (Credit/Debit, UPI, Wallets)

### **5. Admin Dashboard**
   - Monitor user and operator activities
   - Manage trip cancellations and disputes

### **6. Notifications**
   - Email & SMS alerts for bookings and cancellations

---

## **Logic Flow**
1. **User Authentication**
   - Users and operators can register and log in using JWT authentication.
   - Users can reset passwords if needed.

2. **Bus Search & Booking**
   - Passengers search for buses using source, destination, and date.
   - They check seat availability and book tickets.

3. **Payment Processing**
   - Users complete payment for their bookings.
   - Upon successful payment, an e-ticket is generated.

4. **Operator & Admin Controls**
   - Operators manage trips, pricing, and availability.
   - Admins oversee user management, cancellations, and disputes.

---

## **API Routes**

### **1. Authentication APIs**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user/operator |
| POST | `/api/auth/login` | Authenticate user/operator and receive a JWT token |
| POST | `/api/auth/logout` | Logout the authenticated user |
| POST | `/api/auth/forgot-password` | Initiate password reset process |

---

### **2. Passenger APIs**
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/passengers/search` | Search available buses by source, destination, and date |
| GET | `/api/passengers/seats/:busId` | Check seat availability for a specific bus |
| POST | `/api/passengers/bookings` | Book a ticket for a trip |
| GET | `/api/passengers/bookings` | View user's booking history |
| DELETE | `/api/passengers/bookings/:id` | Cancel a booking |
| PUT | `/api/passengers/profile` | Update passenger profile details |

---

### **3. Operator APIs**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/operators/register` | Register a new operator |
| POST | `/api/trips` | Create a new trip |
| PUT | `/api/trips/:id` | Modify trip details |
| DELETE | `/api/trips/:id` | Cancel a trip |
| GET | `/api/trips/:id/bookings` | View bookings for a specific trip |

---

### **4. Bus APIs**
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/buses` | Create a new bus entry |
| GET | `/api/buses` | Retrieve a list of all available buses |
| GET | `/api/buses/:id` | Get details of a specific bus by ID |
| PUT | `/api/buses/:id` | Update details of a specific bus |
| DELETE | `/api/buses/:id` | Delete a specific bus entry |

---

### **5. Admin APIs**
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/admin/users` | Retrieve a list of all users/operators |
| PUT | `/api/admin/users/:id/block` | Block a specific user |
| PUT | `/api/admin/users/:id/unblock` | Unblock a specific user |
| GET | `/api/admin/trips/:id` | Get details of a specific trip |
| DELETE | `/api/admin/trips/:id` | Cancel a specific trip |
| GET | `/api/admin/users/:id/bookings` | View all bookings of a specific user |
| DELETE | `/api/admin/users/:id/bookings/:bookingId` | Delete a specific booking of a user |

---

## **File Structure**

## File Structure
```
Bus-Ticketing/
│── src/
│   ├── logs/
│   │   ├── app.log
│   │   ├── errors.log
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── operatorController.js
│   │   ├── passengerController.js
│   │   ├── adminController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── bookingModel.js
│   │   ├── busModel.js
│   │   ├── tripModel.js
│   │   ├── userModel.js
│   │   ├── operatorModel.js
│   │   ├── adminModel.js
│   │   ├── cancellationModel.js
│   │   ├── feedbackModel.js
│   │   ├── paymentModel.js
│   │
│   ├── repositories/
│   │   ├── authRepository.js
│   │   ├── adminRepository.js
│   │   ├── busRepository.js
│   │   ├── operatorRepository.js
│   │   ├── passengerRepository.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── busRoutes.js
│   │   ├── operatorRoutes.js
│   │   ├── passengerRoutes.js
│   │   ├── adminRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── busService.js
│   │   ├── operatorService.js
│   │   ├── passengerService.js
│   │   ├── adminService.js
│   │
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   ├── logger.js
│   │   ├── passwordUtils.js
│   │
│── .env
│── db.js
│── index.js
│── package.json

```

---

## 🚀 Next Steps
- Implement **frontend UI** with React.js
- Integrate **API endpoints** with React components
- Deploy on **Cloud (AWS, Vercel, or Heroku)**

---

### 🛠️ **Built With**
- **MongoDB** (Database)
- **Express.js** (Backend Framework)
- **React.js** (Frontend Framework)
- **Node.js** (Runtime Environment)
- **JWT** (Authentication)
- **Stripe/Razorpay** (Payments)