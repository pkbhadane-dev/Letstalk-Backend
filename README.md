# Let's Talk - Chat Application Backend

A real-time chat application backend built with **Node.js**, **Express**, and **Socket.io**. This backend provides RESTful APIs and WebSocket support for user authentication, messaging, and real-time communication features.

## 📋 Features

- **User Authentication**: Sign up, login, and logout with JWT tokens
- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Management**: Profile management with profile pictures and user descriptions
- **Online Status**: Real-time online/offline user status
- **Typing Indicator**: Live typing status notifications
- **Message Status**: Track read/unread messages
- **Cloud Storage**: Profile pictures stored on Cloudinary
- **Input Validation**: Express-validator for data validation
- **Error Handling**: Centralized error handling middleware
- **Security**: Password hashing with bcryptjs, CORS enabled

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io v4.8.1
- **Authentication**: JWT (jsonwebtoken)
- **Security**: 
  - bcryptjs for password hashing
  - CORS for cross-origin requests
  - Cookie parser for token management
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Development**: Nodemon

## 📁 Project Structure

```
Backend/
├── Controllers/
│   ├── userController.js      # User operations (auth, profile, etc.)
│   └── messageController.js   # Message operations
├── Models/
│   ├── userModel.js           # User schema
│   ├── messageModel.js        # Message schema
│   └── conversationModel.js   # Conversation schema
├── Routers/
│   ├── userRouter.js          # User routes
│   └── messageRouter.js       # Message routes
├── Middlewares/
│   ├── isAuthenticated.js     # JWT verification
│   ├── errorHandler.js        # Error handling
│   ├── multer.js              # File upload configuration
│   └── validateResult.js      # Validation error handling
├── Socket/
│   └── socket.js              # Socket.io configuration
├── DB/
│   └── db.js                  # MongoDB connection
├── Utilities/
│   ├── handleCloudinary.js    # Cloudinary operations
│   ├── handleCustomError.js   # Custom error class
│   ├── handleJsonWebToken.js  # JWT utilities
│   └── handleValidationError.js # Validation error utilities
├── app.js                     # Express app setup
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory. 

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000` with automatic restart on file changes.

## 📡 API Endpoints

### User Routes (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/login` | No | Login page |
| POST | `/login` | No | User login |
| POST | `/signup` | No | User registration |
| POST | `/logout` | Yes | User logout |
| GET | `/getprofile` | Yes | Get current user profile |
| GET | `/otherUsers` | Yes | Get list of all other users |
| POST | `/uploadProfilePic` | Yes | Upload profile picture |
| POST | `/setAbout` | Yes | Update user bio/about |

### Message Routes (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send/:receiverId` | Yes | Send message to user |
| GET | `/getMessage/:participantId` | Yes | Get messages with participant |
| PUT | `/markRead/:participantId` | Yes | Mark messages as read |
| GET | `/getMessageCount` | Yes | Get unread message count |
| DELETE | `/deleteMessage/:messageId` | Yes | Delete a message |

## 🔌 Socket.io Events

### Server Emits

- **`onlineUser`**: Broadcasts list of all online users
  ```javascript
  Array of online user IDs
  ```

- **`typing`**: Notify user is typing
  ```javascript
  userId of the typing user
  ```

- **`stopTyping`**: Notify typing stopped
  ```javascript
  userId who stopped typing
  ```

### Client Emits

- **`typing`**: Emit when user starts typing
  ```javascript
  { receiver: receiverId, sender: senderId }
  ```

- **`stopTyping`**: Emit when user stops typing
  ```javascript
  { receiver: receiverId, sender: senderId }
  ```

## 📊 Database Models

### User Model


### Message Model


### Conversation Model


## 🔐 Authentication

- **JWT-based Authentication**: Tokens stored in HTTP-only cookies
- **Password Security**: Passwords hashed using bcryptjs
- **Token Verification**: All protected routes require valid JWT token
- **Socket Authentication**: WebSocket connections verified via JWT token

## 🛡 Security Features

- CORS configured for localhost:5173
- HTTP-only cookies for token storage
- Password encryption
- Input validation on all endpoints
- Centralized error handling
- JWT secret key protection


## 🔧 Development

### Available Scripts

- `npm start` - Start the server with Nodemon (auto-reload on changes)
- `npm test` - Run tests (not configured yet)

### Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **socket.io**: Real-time communication
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **multer**: File upload handling
- **cloudinary**: Cloud storage
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🐛 Error Handling

The application includes a centralized error handler middleware that:
- Catches validation errors
- Handles custom application errors
- Returns consistent error responses
- Logs error details

## 🚦 CORS Configuration

Currently configured to allow requests from:
- `http://localhost:5173` (Frontend)

Adjust the `CLIENT_URL` in app.js if frontend URL changes.

## 📌 Notes

- All routes except `/login`, `/signup`, and `/getLogin` require authentication
- Profile pictures are stored on Cloudinary, not in database
- Messages are stored with timestamps for chronological ordering
- Conversations store references to messages for efficient retrieval

## 👤 Author

**Prashant Bhadane**

## 📄 License

ISC

---

**Status**: Active Development
