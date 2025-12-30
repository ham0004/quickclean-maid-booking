# QuickClean Project Requirements

## Requirement 1: User Registration & Email Verification (COMPLETED)

### Feature 1-3: Email Verification & Account Restrictions
- User registration with email verification via SendGrid
- Verification token with 24-hour expiration
- Unverified users get 403 response with "Please verify your email address" message
- Dashboard displays prominent banner for unverified users

### Feature 4: Secure Login with JWT Token Generation
- POST /api/auth/login - accepts email and password
- Query User collection, validate with bcrypt
- Generate JWT with userId, email, role, isVerified (7 days expiry)
- Frontend stores token in localStorage
- verifyToken middleware for protected routes

---

## Requirement 2: Admin Service Category & Maid Verification

### Feature 1: Complete CRUD Operations for Service Categories
**ServiceCategory Model:**
- _id, name (string, required, unique)
- description (string, required)
- basePrice (number, required, minimum 0)
- priceUnit (enum: ["per hour", "per visit", "per square foot"])
- isActive (boolean, default: true)
- createdAt, updatedAt

**API Endpoints (Admin-only):**
- POST /api/admin/categories - create with validation
- GET /api/admin/categories - list with filtering & pagination (20/page)
- PUT /api/admin/categories/:id - update with validation
- DELETE /api/admin/categories/:id - soft-delete (set isActive: false)

**Admin middleware:** requireAdmin verifies role is "Admin"

**Frontend:** Admin panel with table, inline editing, search, delete confirmation

### Feature 2: Maid Profile Submission with Document Upload
**Extended User Model (for Maids):**
- profile: { experience (years), skills (array), bio (max 500), availableServices (ServiceCategory IDs), hourlyRate }
- documents: { idType (enum: NID/Passport/Driving License), idNumber, idDocumentUrl, uploadedAt }
- verificationStatus (enum: Pending/Approved/Rejected, default: Pending)
- adminNotes (for rejection reasons)

**Registration:**
- Show additional fields for Maids
- File upload for ID documents (PDF, JPG, PNG, max 5MB)
- Store in /uploads/documents/ with UUID filename
- Maids with "Pending" status have limited access

### Feature 3: Admin Dashboard for Maid Verification Workflow
**API Endpoints:**
- GET /api/admin/maids/pending - get pending maids sorted by createdAt
- PUT /api/admin/maids/:id/approve - set verificationStatus=Approved, isVerified=true
- PUT /api/admin/maids/:id/reject - set verificationStatus=Rejected, store reason in adminNotes

**Frontend Admin Dashboard:**
- Card-based layout showing: profile picture, name, experience, skills, services, ID document preview
- "Approve" and "Reject" buttons (reject requires reason modal)
- Summary statistics: total pending, approved, rejected maids

### Feature 4: Automated Email Notifications for Maid Approval Status
**Approval Email:** Congratulatory message, confirmation, CTA to dashboard
**Rejection Email:** Polite explanation, admin notes, re-submit instructions

**EmailLog Collection:**
- userId, emailType (Verification/Approval/Rejection/Booking)
- status (Sent/Failed), sentAt, errorMessage
- Background job retries failed emails every 30 minutes (max 3 attempts)

---

## Requirement 3: Customer Booking System (Future)

### Feature 1: Maid Listing with Detailed Profile Display
- GET /api/maids - list approved maids with pagination
- GET /api/maids/:id - detailed maid profile
- Populate availableServices with full category objects

### Feature 2: Booking Request Submission
**Booking Model:**
- customerId, maidId, serviceId (references)
- bookingDate, bookingTime, duration
- address: { street, city, postalCode }
- specialInstructions, status, totalPrice, rejectionReason

**API:** POST /api/bookings (protected, authenticated users only)

### Feature 3: Real-time Email Notifications for Booking Events
- Confirmation email to customer
- New booking alert to maid
- Retry failed emails every 15 minutes (max 5 attempts)

### Feature 4: Maid Dashboard for Booking Request Management
- GET /api/maids/bookings - list maid's bookings with filters
- PUT /api/bookings/:id/accept - accept booking
- PUT /api/bookings/:id/reject - reject with reason
- Tabbed interface: Pending, Accepted, Completed, Rejected
