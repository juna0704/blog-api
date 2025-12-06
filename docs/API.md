# 📘 API Reference — Blog API

/api/v1

Authentication:

- **Access Token** required via `Authorization: Bearer <token>`
- Some require `admin` role

---

====================================================

---

====================================================

# 🔐 AUTH ROUTES (`/auth`)

## POST `/auth/register`

    Register a new user.

## POST `/auth/login`

    Login using email & password.

## POST `/auth/refresh-token`

    Uses refresh token (HttpOnly cookie) to issue new access token.

## POST `/auth/logout`

    Logout user and invalidate refresh token.
    Requires authentication.

---

====================================================

---

====================================================

# 👤 USER ROUTES (`/users`)

### GET `/users/current`

    Get authenticated user's data.
    Requires: `admin` or `user`

### PUT `/users/current`

    Update authenticated user profile.
    Requires: `admin` or `user`

### DELETE `/users/current`

    Delete the logged-in user.
    Requires: `admin` or `user`

---

### GET `/users`

    Get all users (paginated).
    Requires: `admin`

### GET `/users/:userId`

    Get user by ID.
    Requires: `admin`

### DELETE `/users/:userId`

    Delete user by ID.
    Requires: `admin`

---

====================================================

---

====================================================

# 📝 BLOG ROUTES (`/blogs`)

### POST `/blogs`

    Create a blog.
    Requires: `admin`

### GET `/blogs`

    Retrieve all blogs (paginated).
    Requires: `admin` or `user`

### GET `/blogs/user/:userId`

    Get all blogs created by a specific user.
    Requires: `admin` or `user`

### GET `/blogs/:slug`

    Get a blog by slug.
    Requires: `admin` or `user`

### PUT `/blogs/:blogId`

    Update blog.
    Requires: `admin`

### DELETE `/blogs/:blogId`

    Delete blog.
    Requires: `admin`

---

====================================================

---

====================================================

# 💬 COMMENT ROUTES (`/comments`)

### POST `/comments/blog/:blogId`

    Create comment on a blog.
    Requires: `admin` or `user`

### GET `/comments/blog/:blogId`

    Get comments for a blog.
    Requires: `admin` or `user`

### DELETE `/comments/:commentId`

    Delete comment.
    Requires: `admin` or `user`

---

====================================================

---

====================================================

# 👍 LIKE ROUTES (`/likes`)

### POST `/likes/blog/:blogId`

    Like a blog.
    Requires: `admin` or `user`
    Body: `{ "userId": "<MongoId>" }`

### DELETE `/likes/blog/:blogId`

    Unlike a blog.
    Requires: `admin` or `user`
    Body: `{ "userId": "<MongoId>" }`

---
