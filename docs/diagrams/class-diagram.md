classDiagram
    %% ============================================
    %% MODEL LAYER - All Requirements
    %% ============================================
    
    namespace ModelLayer {
        class User {
            <<Model>>
            -ObjectId _id
            -String name
            -String email
            -String phone
            -Enum role
            -String passwordHash
            -String verificationToken
            -Boolean isVerified
            -Profile profile
            -Document documents
            -Enum verificationStatus
            -String adminNotes
            -DateTime createdAt
            -DateTime updatedAt
            +create(userData) User
            +findByEmail(email) User
            +findById(id) User
            +findByRole(role) User[]
            +updateVerificationStatus(userId, status) User
            +updateMaidVerification(userId, status, notes) User
            +hashPassword(password) String
            +validatePassword(plainPassword, hashedPassword) Boolean
        }
        
        class Profile {
            <<ValueObject>>
            -Number experience
            -String[] skills
            -String bio
            -ObjectId[] availableServices
            -Number hourlyRate
        }
        
        class Document {
            <<ValueObject>>
            -Enum idType
            -String idNumber
            -String idDocumentUrl
            -DateTime uploadedAt
        }
        
        class ServiceCategory {
            <<Model>>
            -ObjectId _id
            -String name
            -String description
            -Number basePrice
            -Enum priceUnit
            -Boolean isActive
            -DateTime createdAt
            -DateTime updatedAt
            +create(categoryData) ServiceCategory
            +findById(id) ServiceCategory
            +findAll(page, limit, activeOnly) ServiceCategory[]
            +update(id, updates) ServiceCategory
            +softDelete(id) ServiceCategory
        }
        
        class Booking {
            <<Model>>
            -ObjectId _id
            -ObjectId customerId
            -ObjectId maidId
            -ObjectId serviceId
            -Date bookingDate
            -String bookingTime
            -Number duration
            -Address address
            -String specialInstructions
            -Enum status
            -String rejectionReason
            -Number totalPrice
            -DateTime createdAt
            -DateTime updatedAt
            +create(bookingData) Booking
            +findById(id) Booking
            +findByCustomer(customerId, status) Booking[]
            +findByMaid(maidId, status) Booking[]
            +updateStatus(id, status, reason) Booking
            +calculateTotalPrice(serviceId, duration) Number
        }
        
        class Address {
            <<ValueObject>>
            -String street
            -String city
            -String postalCode
        }
        
        class EmailLog {
            <<Model>>
            -ObjectId _id
            -ObjectId userId
            -ObjectId bookingId
            -String recipientEmail
            -Enum emailType
            -Enum status
            -Number retryCount
            -DateTime sentAt
            -String errorMessage
            -DateTime createdAt
            +create(emailData) EmailLog
            +findByUserId(userId) EmailLog[]
            +findFailedEmails() EmailLog[]
            +updateStatus(id, status, errorMessage) EmailLog
            +incrementRetryCount(id) EmailLog
        }
    }
    
    %% ============================================
    %% CONTROLLER LAYER - Requirement 1 Only
    %% ============================================
    
    namespace ControllerLayer {
        class AuthController {
            <<Controller>>
            -User userModel
            -EmailLog emailLogModel
            -EmailService emailService
            -JWTService jwtService
            +register(req, res) Response
            +verifyEmail(req, res) Response
            +login(req, res) Response
            +resendVerification(req, res) Response
        }
        
        class EmailService {
            <<Service>>
            -String apiKey
            -String senderEmail
            -Object sendGridClient
            -EmailLog emailLogModel
            +sendVerificationEmail(email, name, token) Promise~Boolean~
            +retryFailedEmails() Promise~Number~
        }
        
        class JWTService {
            <<Service>>
            -String secretKey
            -String expirationTime
            +generateToken(payload) String
            +verifyToken(token) Object
        }
        
        class AuthMiddleware {
            <<Middleware>>
            -JWTService jwtService
            +verifyToken(req, res, next) void
            +requireVerifiedUser(req, res, next) void
            +requireAdmin(req, res, next) void
        }
    }
    
    %% ============================================
    %% VIEW LAYER - Requirement 1 Only
    %% ============================================
    
    namespace ViewLayer {
        class RegisterPage {
            <<View>>
            -Object formData
            -Object errors
            -Boolean loading
            -Boolean showSuccessMessage
            +handleInputChange(field, value) void
            +validateForm() Boolean
            +handleSubmit(event) void
            +render() JSX.Element
        }
        
        class LoginPage {
            <<View>>
            -Object credentials
            -Object errors
            -Boolean loading
            +handleInputChange(field, value) void
            +handleLogin(event) void
            +render() JSX.Element
        }
        
        class EmailVerificationPage {
            <<View>>
            -Enum verificationStatus
            -String message
            -String token
            +componentDidMount() void
            +handleResendEmail() void
            +render() JSX.Element
        }
        
        class DashboardBanner {
            <<View>>
            -Boolean isVerified
            -String userEmail
            +handleResendVerification() void
            +render() JSX.Element
        }
    }
    
    %% ============================================
    %% MODEL RELATIONSHIPS
    %% ============================================
    
    %% COMPOSITION (filled diamond *--) - Part cannot exist without whole
    User *-- "0..1" Profile : contains ▼
    User *-- "0..1" Document : contains ▼
    Booking *-- "1" Address : contains ▼
    
    %% DIRECTED ASSOCIATION (solid arrow -->) - Has persistent reference as attribute
    Booking --> "1" User : customerId references
    Booking --> "1" User : maidId references
    Booking --> "1" ServiceCategory : serviceId references
    EmailLog --> "0..1" User : userId references
    EmailLog --> "0..1" Booking : bookingId references
    Profile --> "*" ServiceCategory : availableServices references
    
    %% ============================================
    %% CONTROLLER & VIEW RELATIONSHIPS
    %% ============================================
    
    %% DIRECTED ASSOCIATION (solid arrow -->) - Controller has model/service as attribute
    AuthController --> User : has userModel
    AuthController --> EmailLog : has emailLogModel
    AuthController --> EmailService : has emailService
    AuthController --> JWTService : has jwtService
    
    EmailService --> EmailLog : has emailLogModel
    
    AuthMiddleware --> JWTService : has jwtService
    
    %% DEPENDENCY (dashed arrow ..>) - View temporarily uses Controller via API calls
    RegisterPage ..> AuthController : calls register()
    LoginPage ..> AuthController : calls login()
    EmailVerificationPage ..> AuthController : calls verifyEmail()
    DashboardBanner ..> AuthController : calls resendVerification()
    
    %% ============================================
    %% NOTES FOR CLARITY
    %% ============================================
    
    note for User "Has two roles referencing Booking:\n- As Customer (customerId)\n- As Maid (maidId)\nBoth are directed associations"
    
    note for Profile "Embedded in User (Composition)\nOnly exists for Maid role\nReferences ServiceCategory via array"
    
    note for Booking "Has three directed associations:\n- customerId → User\n- maidId → User\n- serviceId → ServiceCategory"
    
    note for AuthController "Stateful controller with injected dependencies:\n- User model\n- EmailLog model\n- EmailService\n- JWTService"
    
    note for RegisterPage "View layer uses Dependency (dashed)\nbecause it calls Controller via HTTP\nNo persistent reference stored"