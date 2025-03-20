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

## Logic Flow
1. **User Login/Register**
   - Users sign up and log in using JWT authentication.

2. **Searching for Buses**
   - Users enter source, destination, and date.
   - Backend fetches and filters available buses.

3. **Selecting Seats & Booking**
   - Users select available seats.
   - Seat availability is updated in real-time.

4. **Payment Processing**
   - Users proceed to payment.
   - On success, an e-ticket is generated.

5. **Trip Management (Operators & Admins)**
   - Operators manage trips, pricing, and availability.
   - Admins oversee cancellations and disputes.

---

## API Routes
### **Authentication (User & Admin)**
- `POST /api/auth/register` → Register a new user
- `POST /api/auth/login` → User login
- `POST /api/auth/admin-login` → Admin login

### **Bus & Trip Management**
- `POST /api/bus/add` → Add a new bus (Operator only)
- `GET /api/bus/list` → Get available buses
- `POST /api/trip/add` → Create a new trip
- `GET /api/trip/search` → Search trips

### **Booking & Payments**
- `POST /api/booking/book` → Book a seat
- `GET /api/booking/history` → View booking history
- `POST /api/payment/process` → Process payment

### **Admin Controls**
- `GET /api/admin/users` → View all users
- `POST /api/admin/block-user` → Block a user
- `DELETE /api/admin/delete-trip` → Remove a trip

---


## File Structure
```
Project/
│── db.js  # Database Connection
│── index.js  # Main Server File
│── models/
│   ├── bookingSchema.js
│   ├── busSchema.js
│   ├── cancellationSchema.js
│   ├── feedbackSchema.js
│   ├── operatorSchema.js
│   ├── paymentSchema.js
│   ├── tripSchema.js
│   ├── userSchema.js
│── .env
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