# MICROSERVICE

## User Management

The User Management microservice is a core component of the clearSKY SaaS platform. It handles all user-related functionality, including registration, authentication (login), profile retrieval, and listing of student users. It uses JSON Web Tokens (JWT) for secure, stateless authentication.

### Features

- **User registration** (developer/admin only)
- **User login** with username and password
- **JWT token issuance** for secure API access
- **Authenticated user profile** retrieval
- **List of all student users** for instructor access

### Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt.js for password hashing
- JSON Web Tokens (JWT)
- Docker-ready
