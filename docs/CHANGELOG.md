# 📜 Changelog

All notable changes to this project will be documented in this file.

The format is based on **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---

## [1.0.0] — 2025-02-13

### 🎉 Initial Production Release

#### Added

- Complete API v1:
  - **Authentication** (register, login, logout, refresh token)
  - **User Management** (CRUD, current user endpoints, admin routes)
  - **Blog Management** (create, update, delete, get all, by user, by slug)
  - **Like System** (like & unlike blog, likes counter)
  - **Comment System** (add comment, get comments, delete comment)
- **JWT authentication stack**:
  - Access tokens (short-lived)
  - Refresh tokens (HttpOnly cookies)
  - Refresh token storage in database
- **Role-based authorization** for admin & user routes
- **MongoDB Models**:
  - User
  - Blog
  - Comment
  - Like
  - Token (refresh tokens)
- **Express middlewares**:
  - authenticate
  - authorize
  - validationError
  - uploadBlogBanner (Cloudinary)
- **Global security features**:
  - express-rate-limit
  - helmet
  - compression
  - CORS whitelist
  - Cookie-parser
- **Cloudinary image uploads** for blog banners
- **Winston logging** (access, app, error logs)
- **Cron jobs** for token cleanup
- **Utility modules** (slug generation, DOMPurify sanitization)
- **Docker support**:
  - Dockerfile
  - docker-compose.yml
  - Nginx reverse proxy config
  - PM2 ecosystem config
- **Testing structure**:
  - Unit tests
  - Integration tests
  - E2E tests

---

## [Unreleased]

### 🚧 Upcoming Improvements

#### Planned

- Refresh token rotation for higher security
- Session device & IP tracking
- Admin activity audit logs
- Rate limiting per route group
- Email verification system
- User avatar support
- Blog categories/tags
- Nested comment threads (replies)
- Soft-delete mechanism for blogs & comments
