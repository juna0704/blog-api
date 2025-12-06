# 🏗 Architecture Overview — Blog API (Node.js + Express + TypeScript)

This document describes the internal architecture of the Blog API backend, including folder structure, request flow, middleware stack, module responsibilities, and deployment overview.

The goal is to help developers understand how the system works end-to-end and how to safely extend or modify the codebase.

---

====================================================

---

====================================================

# 📁 Project Structure

src
├── app.ts
├── server.ts
├── config/
├── controllers/
├── cron/
├── jobs/
├── lib/
├── middlewares/
├── models/
├── routes/
├── services/
├── subscribers/
├── types/
├── utils/
└── validators/

====================================================

---

====================================================

### 🔍 Folder Responsibilities

| Folder           | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **server.ts**    | Entry point, bootstraps Express, DB connection, graceful shutdown                           |
| **app.ts**       | (Currently empty) — reserved for future reusable app-level logic                            |
| **config/**      | Environment variables, constants, app config                                                |
| **controllers/** | Process incoming HTTP requests (validation → business service → response)                   |
| **cron/**        | (Currently empty) — Scheduled background tasks (e.g., cleanup jobs)                         |
| **jobs/**        | (Currently empty) — Background tasks like notifications or queue workers                    |
| **lib/**         | Utility libraries (Cloudinary, JWT, logger, DB connection, rate limiter)                    |
| **middlewares/** | Authentication, authorization, validation, file upload, rate limiting                       |
| **models/**      | Mongoose schemas (User, Blog, Comment, Like, Token)                                         |
| **routes/**      | Route entrypoints grouped by feature and API version                                        |
| **services/**    | (Currently empty) — Business logic used by controllers (DB operations, token issuing, etc.) |
| **subscribers/** | (Currently empty) — Event listeners triggered by Mongoose hooks or domain events            |
| **types/**       | TypeScript definitions and Express request augmentation                                     |
| **utils/**       | Reusable helper functions                                                                   |
| **validators/**  | express-validator schemas used for request validation                                       |

This modular layout follows clean backend architecture principles:

> _Routes → Controllers → Services → Models_

---

====================================================

---

====================================================

# 🚦 System Request Flow

Every incoming request flows through a controlled sequence of layers:

Client
↓
Express Server
↓
Global Middlewares
↓
Route Handlers
↓
Route-Specific Middlewares
↓
Controller
↓
Service
↓
Mongoose Model
↓
Database (MongoDB)

### 1️⃣ Incoming Request → Global Middleware

These run for all requests:

- **CORS whitelist**
- **JSON parser**
- **URL parser**
- **Cookie parser**
- **Helmet security headers**
- **Compression (gzip)**
- **Rate limiting**
- **Request logging (Winston)**

### 2️⃣ Routing Layer → `/api/v1`

All routes are versioned:

/api/v1/auth
/api/v1/users
/api/v1/blogs
/api/v1/comments
/api/v1/likes

### 3️⃣ Route-Level Middlewares

Examples:

- `authenticate` (verifies JWT access token)
- `authorize(['admin'])` (role-based permissions)
- `validationError` (sends validation errors)
- `uploadBlogBanner` (Cloudinary upload)
- `multer.single('banner_image')` (multipart parsing)

### 4️⃣ Controller Layer

- Validates inputs
- Calls service functions
- Handles HTTP responses
- Logs important events/errors

### 5️⃣ Service Layer

- Encapsulates all business logic
- Performs Mongoose operations
- Updates counters (like views, likes)
- Handles token generation
- No Express or HTTP logic here

### 6️⃣ Data Layer (Models)

- Mongoose schemas define:
  - validation
  - indexes
  - references
  - lifecycle hooks
- Directly interacts with **MongoDB**

---

====================================================

---

====================================================

# 🧱 API Module Overview

### **Authentication Module**

Handles:

- register
- login
- logout
- refresh token
- token persistence
- blacklist/cleanup via cron

### **User Module**

Handles:

- get current user
- update profile
- admin-level user management
- delete users

### **Blog Module**

Handles:

- create blog
- update blog
- delete blog
- get by slug
- get all blogs (paginated)
- fetch blogs by user
- Cloudinary banner upload

### **Comment Module**

Handles:

- create comment
- delete comment
- fetch comments for a blog

### **Like Module**

Handles:

- like blog
- unlike blog
- maintains likes count atomically

---

====================================================

---

====================================================

# 🏗 Core Middlewares

### 🔐 `authenticate`

- Reads JWT from `Authorization: Bearer <token>`
- Verifies using `JWT_ACCESS_SECRET`
- Injects `req.userId` or `req.user`
- Rejects unauthorized access (401)

### 🔑 `authorize(roles)`

- Ensures user role matches allowed roles
- Rejects forbidden access (403)

### 🛡 `validationError`

- Converts express-validator errors → HTTP 422 JSON

### 🖼 `uploadBlogBanner`

- Uses Multer to parse binary upload
- Uploads to Cloudinary
- Replaces `req.body.banner` with Cloudinary metadata

---

====================================================

---

====================================================

# 🔒 Security Architecture

The system includes several layers of security:

### ✔ CORS whitelist

Only allowed origins can access the API.

### ✔ Helmet Security Headers

Protects against common web vulnerabilities.

### ✔ Rate Limiting

Prevents brute force & abuse.

### ✔ JWT Token Rotation

Short-lived access tokens + refresh tokens.

### ✔ Sanitization

HTML sanitization in blog content using DOMPurify + JSDOM.

### ✔ Password Hashing

bcrypt hashes with salts.

### ✔ Role-Restricted Endpoints

Admins-only routes for sensitive operations.

---

====================================================

---

====================================================

# ⚙️ Configuration System

Environment variables are loaded via:

src/config/index.ts

Configuration includes:

- PORT
- NODE_ENV
- WHITELIST_ORIGINS
- DB_URI
- JWT secrets + expiry
- Cloudinary keys
- Admin email whitelist

If required keys are missing, the server refuses to start.

---

====================================================

---

====================================================

# 🗄 Database Architecture

The database uses **MongoDB** with Mongoose.

### Key Models:

| Model       | Description                           |
| ----------- | ------------------------------------- |
| **User**    | Auth, role, profile                   |
| **Blog**    | Title, content, banner, slug, status  |
| **Comment** | Blog comment                          |
| **Like**    | Blog likes with unique constraints    |
| **Token**   | Refresh tokens for session management |

Indexes ensure:

- unique emails / usernames
- unique likes per blog per user
- fast slug lookup

---

====================================================

---

====================================================

# 📊 Logging Architecture (Winston)

Logs are stored under:

logs/app.log
logs/error.log
logs/access.log

Logged events include:

- server start
- DB connection
- auth events
- blog creation / deletion
- errors & stack traces
- unauthorized access attempts

---

====================================================

---

====================================================

# 💾 Deployment Workflow

Via `/docker` directory:

- `Dockerfile` — build application container
- `docker-compose.yml` — orchestrates:
  - MongoDB
  - App
  - Nginx reverse proxy
- `nginx.conf` — SSL, caching, request forwarding
- `ecosystem.config.js` — PM2 process manager

Production starts with:

```bash
docker-compose up --build -d
```
