# Blog API - REST Backend (Node.js + Express + TypeScript)

A production-ready blog platform backend with comprehensive features and robust architecture.

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose (v9)
- **Authentication:** JWT (Access + Refresh Tokens)
- **Security:** Helmet, Rate Limiting
- **Architecture:** Modular Controllers, Services, Middlewares
- **File Uploads:** Cloudinary Integration
- **Logging:** Winston
- **Deployment:** Docker, PM2, Nginx

## 📋 Overview

This backend powers a complete blog system with full CRUD operations, user management, and interactive features. The API follows REST principles and implements comprehensive validation and security measures.

## 🌟 Core Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with secure password hashing using bcrypt
- **JWT Token System** with access and refresh tokens
- **Secure HttpOnly Cookies** for refresh tokens
- **Role-Based Access Control** with `admin` and `user` roles
- **Route-level permission middleware** for granular access control

### 📝 Blog Management

- **Full CRUD Operations** for blog posts
- **Blog Banner Uploads** with Cloudinary integration
- **Paginated Queries** for efficient data retrieval
- **Blogs by User** filtering capability
- **Granular Access Control** per blog post

### 💬 Interactive Features

- **Comment System** with add, delete, and retrieval operations
- **Like/Unlike Functionality** with duplicate prevention
- **Comment retrieval by blog** for efficient display

### 🛡️ Security

- **Helmet HTTP Headers** for enhanced security
- **Global Rate Limiting** to prevent abuse
- **Input Sanitization** using DOMPurify
- **Centralized Error Handling** for consistent error responses
- **Comprehensive Validation** with express-validator

### 🏗️ Infrastructure

- **Docker Configuration** for containerized deployment
- **Nginx Reverse Proxy** setup
- **PM2 Process Manager** for production process management
- **Automated Database Scripts** for backup and restore operations

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- npm or yarn package manager

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/YOUR-REPO/blog-api.git

# Navigate to project directory
cd blog-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Build the TypeScript project
npm run build

# Start the development server
npm run dev

# For production
npm run build
npm start
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "docker:build": "docker build -t blog-api .",
    "docker:run": "docker run -p 3000:3000 blog-api"
  }
}
```

### Docker Deployment

```bash
# Build Docker image
docker build -t blog-api .

# Run container
docker run -p 3000:3000 --env-file .env blog-api

# Docker Compose (if using)
docker-compose up -d
```

## 📁 Project Structure

```
blog-api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Mongoose schemas
│   ├── middlewares/     # Custom middleware
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── app.ts          # Express application setup
├── tests/              # Test files
├── docker/             # Docker configuration
├── nginx/              # Nginx configuration
├── scripts/            # Utility scripts
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/blog-api
MONGODB_URI_TEST=mongodb://localhost:27017/blog-api-test

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run integration tests
npm run test:integration
```

## 📊 Logging

The application uses Winston for structured logging with different transports based on the environment:

- **Development:** Console logging with colors
- **Production:** File logging with rotation

## 🔐 Security Features

1. **Input Validation:** All user inputs are validated using express-validator
2. **SQL/NoSQL Injection Prevention:** Mongoose provides built-in protection
3. **XSS Protection:** DOMPurify sanitizes HTML content
4. **CSRF Protection:** Implemented via secure tokens
5. **CORS:** Configured to allow specific origins only
6. **Rate Limiting:** Prevents brute force attacks
7. **Helmet.js:** Sets secure HTTP headers

## 📈 Monitoring

- **Health Check Endpoint:** `/health` for service monitoring
- **Metrics Endpoint:** `/metrics` for performance monitoring
- **PM2 Monitoring:** Process management and monitoring in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
