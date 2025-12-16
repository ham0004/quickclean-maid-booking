# QuickClean - Simplified Maid Booking Platform

## 📋 Project Information
- **Course:** CSE470 - Software Engineering 
- **Section:** 18
- **Group:** 11
- **Student:** Sayed Ilham Azhar Harun
- **Student ID:** 22101262
- **Semester:** Fall 2025

## 📝 Project Description
QuickClean is a streamlined web-based platform designed to connect customers with domestic cleaning service providers (maids). Unlike complex marketplace solutions, QuickClean focuses on simplicity and ease of use, providing essential booking functionality without overwhelming features.

The name "QuickClean" emphasizes the platform's core value proposition: fast, straightforward access to cleaning services without complicated processes.

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI development
- **TailwindCSS** - Modern, responsive styling
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** with **Express.js** - RESTful API development
- **MongoDB** with **Mongoose** - Flexible NoSQL data storage
- **bcrypt.js** - Password hashing
- **JSON Web Tokens (JWT)** - Authentication

### Third-Party Services
- **SendGrid API** - Email verification and notifications
- **MongoDB Atlas** - Cloud database hosting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- SendGrid account for email services

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/verify/:token` | Verify email address |
| POST | `/api/auth/resend-verification` | Resend verification email |
| GET | `/api/auth/me` | Get current user (protected) |

### Request/Response Examples

#### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "Password123",
  "role": "customer"
}

Response:
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login User
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

## 📂 Project Structure
```
quickclean-maid-booking/
├── docs/                              # Project documentation
│   ├── 22101262_finalproposal_section18.pdf
│   └── diagrams/
├── frontend/                          # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   └── Navbar.js
│   │   ├── pages/                     # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── EmailVerificationPage.js
│   │   ├── services/                  # API service layer
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/                           # Express.js API
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/
│   │   └── authController.js          # Auth logic
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT protection
│   ├── models/
│   │   └── User.js                    # User schema
│   ├── routes/
│   │   └── authRoutes.js              # Auth endpoints
│   ├── services/
│   │   ├── emailService.js            # SendGrid integration
│   │   └── jwtService.js              # JWT utilities
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 📌 Features Implemented

### Sprint 2: User Registration & Login System ✅

- ✅ User registration with role selection (customer/maid)
- ✅ Email verification via SendGrid
- ✅ Secure login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Form validation (frontend & backend)
- ✅ Responsive UI with TailwindCSS
- ✅ Protected routes with auth middleware

## 🚀 Project Status
🟢 **Phase:** Sprint 2 Complete  
📅 **Last Updated:** December 16, 2024

- ✅ Project proposal completed
- ✅ MVC Class Diagram completed
- ✅ GitHub repository created
- ✅ Base project structure set up
- ✅ Backend API development complete
- ✅ Frontend development complete
- ✅ User authentication system complete
- ✅ Email verification working
- ⏳ Admin dashboard (Sprint 3)
- ⏳ Maid management (Sprint 3)
- ⏳ Booking system (Sprint 4)

## 🧪 Testing

### API Testing with Postman

1. **Test Registration:**
   - POST `http://localhost:5000/api/auth/register`
   - Body: `{ "name": "Test User", "email": "test@example.com", "phone": "1234567890", "password": "Test@123", "role": "customer" }`

2. **Test Login:**
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "test@example.com", "password": "Test@123" }`

### Frontend Testing

1. Navigate to `http://localhost:3000/register`
2. Fill out the registration form
3. Check email for verification link
4. Click verification link
5. Login at `http://localhost:3000/login`

## 👤 Author
**Sayed Ilham Azhar Harun**  
Student ID: 22101262  
Section: 18  
Course: CSE470 - Software Engineering   
Institution: Brac University

## 📄 License
This is an academic project for CSE470 course.

## 📞 Contact
**Sayed Ilham Azhar Harun**  
📧 Email: ilham.azhar.harun@g.bracu.ac.bd  
🎓 Student ID: 22101262  
📚 Course: CSE470 - Software Engineering

For academic queries, please contact through the course instructor.

**Note:** This is a solo academic project. All code and documentation are original work created for educational purposes.