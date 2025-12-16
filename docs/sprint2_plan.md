# Sprint 2: User Registration & Login System Implementation

Complete MERN stack implementation for user authentication with email verification using SendGrid.

## User Review Required

> [!IMPORTANT]
> **MongoDB Atlas Setup Required**: You need to create a MongoDB Atlas cluster and get the connection string.

> [!IMPORTANT]
> **SendGrid API Key Required**: You need a SendGrid account and API key for email verification.

> [!WARNING]
> **Environment Variables**: The following `.env` variables must be configured before running:
> - `MONGODB_URI` - MongoDB Atlas connection string
> - `JWT_SECRET` - Secret key for JWT tokens
> - `SENDGRID_API_KEY` - SendGrid API key
> - `SENDGRID_FROM_EMAIL` - Verified sender email
> - `FRONTEND_URL` - Frontend URL for email links (e.g., `http://localhost:3000`)

---

## Proposed Changes

### Backend - Project Initialization

#### [NEW] [package.json](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/package.json)
Node.js project configuration with dependencies:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@sendgrid/mail` - Email service
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express-validator` - Input validation

#### [NEW] [.env.example](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/.env.example)
Template for environment variables.

#### [NEW] [server.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/server.js)
Express server entry point with:
- MongoDB connection
- CORS configuration
- Route mounting
- Error handling middleware

---

### Backend - Configuration

#### [NEW] [config/db.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/config/db.js)
MongoDB Atlas connection using mongoose.

---

### Backend - Models

#### [NEW] [models/User.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/models/User.js)
User schema with fields:
- `name`, `email`, `phone`, `password`
- `role` (enum: customer, maid, admin)
- `isVerified`, `verificationToken`
- `verificationStatus` (for maids)
- Timestamps

---

### Backend - Services

#### [NEW] [services/emailService.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/services/emailService.js)
SendGrid email service for verification emails.

#### [NEW] [services/jwtService.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/services/jwtService.js)
JWT token generation and verification.

---

### Backend - Middleware

#### [NEW] [middleware/authMiddleware.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/middleware/authMiddleware.js)
JWT verification and role-based access control.

---

### Backend - Controllers

#### [NEW] [controllers/authController.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/controllers/authController.js)
Authentication logic:
- `register()` - Create user, hash password, send verification email
- `login()` - Validate credentials, return JWT
- `verifyEmail()` - Handle email verification
- `resendVerification()` - Resend verification email

---

### Backend - Routes

#### [NEW] [routes/authRoutes.js](file:///d:/CSE_470_Project/quickclean-maid-booking/backend/routes/authRoutes.js)
API endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify/:token`
- `POST /api/auth/resend-verification`

---

### Frontend - Project Initialization

#### [NEW] React App via Create React App
Initialize with: `npx create-react-app ./`

#### [NEW] TailwindCSS Configuration
- `tailwind.config.js`
- Update `src/index.css`

---

### Frontend - Services

#### [NEW] [src/services/api.js](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/services/api.js)
Axios instance with base URL and auth interceptor.

#### [NEW] [src/services/authService.js](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/services/authService.js)
Auth API functions: `register()`, `login()`, `verifyEmail()`.

---

### Frontend - Components

#### [NEW] [src/components/Navbar.jsx](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/components/Navbar.jsx)
Navigation bar with logo, links, and auth buttons.

---

### Frontend - Pages

#### [NEW] [src/pages/HomePage.jsx](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/pages/HomePage.jsx)
Landing page with platform introduction and CTA buttons.

#### [NEW] [src/pages/RegisterPage.jsx](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/pages/RegisterPage.jsx)
Registration form with:
- Name, email, phone, password fields
- Role selection (customer/maid)
- Client-side validation
- API integration

#### [NEW] [src/pages/LoginPage.jsx](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/pages/LoginPage.jsx)
Login form with email/password and JWT storage.

#### [NEW] [src/pages/EmailVerificationPage.jsx](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/pages/EmailVerificationPage.jsx)
Email verification handling page.

---

### Frontend - App Configuration

#### [MODIFY] [App.js](file:///d:/CSE_470_Project/quickclean-maid-booking/frontend/src/App.js)
Set up React Router with routes:
- `/` - HomePage
- `/register` - RegisterPage
- `/login` - LoginPage
- `/verify/:token` - EmailVerificationPage

---

### Documentation

#### [MODIFY] [README.md](file:///d:/CSE_470_Project/quickclean-maid-booking/README.md)
Update with:
- Setup instructions for backend
- Setup instructions for frontend
- API endpoint documentation
- Environment variable requirements

---

## Verification Plan

### API Testing with Postman

1. **Test Registration API**
   ```
   POST http://localhost:5000/api/auth/register
   Body: { "name": "Test User", "email": "test@example.com", "phone": "1234567890", "password": "Test@123", "role": "customer" }
   Expected: 201 status, user created message
   ```

2. **Test Login API**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "test@example.com", "password": "Test@123" }
   Expected: 200 status, JWT token returned
   ```

3. **Verify MongoDB Data**
   - Check MongoDB Atlas dashboard for user collection
   - Verify user document has hashed password

### Manual Frontend Testing

1. **Registration Flow**
   - Navigate to `http://localhost:3000/register`
   - Fill form with valid data
   - Submit and verify success message
   - Check email inbox for verification email

2. **Login Flow**
   - Navigate to `http://localhost:3000/login`
   - Enter registered credentials
   - Verify redirect and JWT in localStorage

3. **Email Verification**
   - Click verification link in email
   - Verify success page displays
   - Confirm user's `isVerified` is true in MongoDB

---

## Step-by-Step Guide (After Implementation)

### 1. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to backend `.env`

### 2. SendGrid Setup
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Generate API key
4. Add to backend `.env`

### 3. Backend Setup
```bash
cd backend
npm install
# Create .env file with required variables
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 5. Push to GitHub
```bash
git add .
git commit -m "Sprint 2: User registration and login system"
git push origin main
```
