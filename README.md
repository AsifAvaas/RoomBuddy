# 🏠 RoomBuddy

A modern paying-guest (PG) management web application for seamless room bookings, rent management, and administrative control.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

RoomBuddy is a comprehensive PG management solution that streamlines the entire rental process. Users can easily browse available rooms, book accommodations, and manage payments online. The platform features automated monthly rent reminders, multiple payment options including Stripe integration, and a powerful admin dashboard for property management.

---

## ✨ Features

### For Tenants

- 🔐 **Authentication** - Sign up/login with email or Google OAuth
- 👤 **Profile Management** - Edit profile details and upload profile pictures
- 🏘️ **Room Browsing** - View available rooms with detailed information
- 📅 **Easy Booking** - Reserve rooms for monthly rent
- 💳 **Flexible Payments** - Pay via cash or Stripe integration
- 📧 **Rent Reminders** - Automated monthly email notifications
- 📊 **History Tracking** - View complete rent and payment history
- ❌ **Booking Control** - Cancel bookings when needed

### For Administrators

- 📈 **Dashboard** - Comprehensive overview of all rents and tenants
- 🏢 **Room Management** - Add, edit, and delete room listings
- 👥 **Tenant Management** - View tenant details and manage occupancy
- 🚪 **Eviction Control** - Remove tenants when necessary

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Payment Processing**: Stripe API
- **Email Service**: SMTP / Transactional Email Provider

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

---

## 📁 Project Structure

```
RoomBuddy/
├── BackEnd/
│   ├── index.js                 # Server entry point
│   ├── database.js              # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   │   ├── UserModel.js
│   │   ├── RoomModel.js
│   │   ├── TenantModel.js
│   │   └── ...
│   ├── routes/                  # API routes
│   │   ├── UserRoute.js
│   │   ├── RoomRoute.js
│   │   ├── RentRoute.js
│   │   ├── TenantRentRoute.js
│   │   ├── DashboardRouter.js
│   │   └── ProfileRoute.js
│   └── middleware/              # Auth & role middleware
│
├── FrontEnd/
│   ├── src/                     # React components
│   ├── public/                  # Static assets
│   └── tailwind.config.js       # Tailwind configuration
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account (for payment processing)
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AsifAvaas/RoomBuddy.git
   cd RoomBuddy
   ```

2. **Backend Setup**

   ```bash
   cd BackEnd
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd FrontEnd
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `BackEnd` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=5000

# Authentication
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)

Create a `.env` file in the `FrontEnd` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Running the Application

1. **Start Backend**

   ```bash
   cd BackEnd
   npm run dev
   ```

2. **Start Frontend** (in a new terminal)

   ```bash
   cd FrontEnd
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 🔌 API Endpoints

### Authentication & Users

| Method | Endpoint               | Description        | Auth Required |
| ------ | ---------------------- | ------------------ | ------------- |
| POST   | `/api/register`        | Register new user  | No            |
| POST   | `/api/login`           | User login         | No            |
| POST   | `/api/forgot-password` | Password recovery  | No            |
| GET    | `/api/google`          | Google OAuth login | No            |

### Rooms

| Method | Endpoint         | Description      | Auth Required |
| ------ | ---------------- | ---------------- | ------------- |
| GET    | `/api/rooms`     | Get all rooms    | No            |
| GET    | `/api/rooms/:id` | Get room details | No            |
| POST   | `/api/rooms`     | Create new room  | Admin         |
| PUT    | `/api/rooms/:id` | Update room      | Admin         |
| DELETE | `/api/rooms/:id` | Delete room      | Admin         |

### Rents & Bookings

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/rents/book`    | Book a room             | Yes           |
| GET    | `/api/rents/:userId` | Get user's rent history | Yes           |
| POST   | `/api/rents/pay`     | Process payment         | Yes           |
| DELETE | `/api/rents/:id`     | Cancel booking          | Yes           |

### Admin Dashboard

| Method | Endpoint               | Description        | Auth Required |
| ------ | ---------------------- | ------------------ | ------------- |
| GET    | `/api/admin/dashboard` | Dashboard overview | Admin         |
| GET    | `/api/admin/tenants`   | Get all tenants    | Admin         |
| POST   | `/api/admin/evict`     | Evict tenant       | Admin         |

### Profile

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| GET    | `/api/profile` | Get user profile    | Yes           |
| PUT    | `/api/profile` | Update user profile | Yes           |

> **Note**: For detailed request/response schemas, refer to the route files in `BackEnd/routes/`

---

## 💡 Usage

### For Tenants

1. Sign up or log in to your account
2. Browse available rooms
3. Select and book a room
4. Receive monthly rent reminders via email
5. Pay rent through cash or Stripe
6. Manage your bookings and view history

### For Administrators

1. Log in with admin credentials
2. Access the admin dashboard
3. Add or manage room listings
4. Monitor tenant payments
5. Handle tenant evictions if needed

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 👨‍💻 Author

**Asif A Khuda**

- GitHub: [AsifAvaas](https://github.com/AsifAvaas)
- Email: asif13.aak@gmail.com

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape RoomBuddy
- Built with modern web technologies and best practices

---

<div align="center">
  Made with ❤️ by the RoomBuddy Team
</div>
