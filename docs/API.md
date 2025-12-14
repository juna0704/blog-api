```markdown
# 📘 Blog API Documentation

**Base URL:** `/api/v1`

---

## 🔐 Authentication

- **Access Token** required via header: `Authorization: Bearer <token>`
- Some endpoints require the `admin` role
- Refresh token is managed via HTTP-only cookie

---

## 🔐 Authentication Endpoints (`/auth`)

| Method | Endpoint              | Description                                       | Auth Required |
| ------ | --------------------- | ------------------------------------------------- | ------------- |
| `POST` | `/auth/register`      | Register a new user                               | No            |
| `POST` | `/auth/login`         | Login using email & password                      | No            |
| `POST` | `/auth/refresh-token` | Issue new access token using refresh token cookie | No            |
| `POST` | `/auth/logout`        | Logout user and invalidate refresh token          | Yes           |

---

## 👤 User Management (`/users`)

### Current User Operations

| Method   | Endpoint         | Description                       | Role Required     |
| -------- | ---------------- | --------------------------------- | ----------------- |
| `GET`    | `/users/current` | Get authenticated user's data     | `admin` or `user` |
| `PUT`    | `/users/current` | Update authenticated user profile | `admin` or `user` |
| `DELETE` | `/users/current` | Delete the logged-in user         | `admin` or `user` |

### Admin User Management

| Method   | Endpoint         | Description               | Role Required |
| -------- | ---------------- | ------------------------- | ------------- |
| `GET`    | `/users`         | Get all users (paginated) | `admin`       |
| `GET`    | `/users/:userId` | Get user by ID            | `admin`       |
| `DELETE` | `/users/:userId` | Delete user by ID         | `admin`       |

---

## 📝 Blog Management (`/blogs`)

| Method   | Endpoint              | Description                              | Role Required     |
| -------- | --------------------- | ---------------------------------------- | ----------------- |
| `POST`   | `/blogs`              | Create a new blog                        | `admin`           |
| `GET`    | `/blogs`              | Retrieve all blogs (paginated)           | `admin` or `user` |
| `GET`    | `/blogs/user/:userId` | Get all blogs created by a specific user | `admin` or `user` |
| `GET`    | `/blogs/:slug`        | Get a blog by its slug                   | `admin` or `user` |
| `PUT`    | `/blogs/:blogId`      | Update a blog                            | `admin`           |
| `DELETE` | `/blogs/:blogId`      | Delete a blog                            | `admin`           |

---

## 💬 Comment Management (`/comments`)

| Method   | Endpoint                 | Description                 | Role Required     |
| -------- | ------------------------ | --------------------------- | ----------------- |
| `POST`   | `/comments/blog/:blogId` | Create a comment on a blog  | `admin` or `user` |
| `GET`    | `/comments/blog/:blogId` | Get all comments for a blog | `admin` or `user` |
| `DELETE` | `/comments/:commentId`   | Delete a comment            | `admin` or `user` |

---

## 👍 Like Management (`/likes`)

### Endpoints

| Method   | Endpoint              | Description   | Role Required     | Request Body                |
| -------- | --------------------- | ------------- | ----------------- | --------------------------- |
| `POST`   | `/likes/blog/:blogId` | Like a blog   | `admin` or `user` | `{ "userId": "<MongoId>" }` |
| `DELETE` | `/likes/blog/:blogId` | Unlike a blog | `admin` or `user` | `{ "userId": "<MongoId>" }` |

---

## 📋 Summary

- **Authentication:** JWT tokens with role-based access control
- **Roles:** `admin` (full access), `user` (limited access)
- **Pagination:** Used for listing endpoints (`/users`, `/blogs`)
- **Identifiers:** Can use `userId`, `blogId`, `slug`, or `commentId` depending on endpoint

---

_Note: Replace `<token>` with your actual JWT token and `<MongoId>` with valid MongoDB ObjectId strings._
```
