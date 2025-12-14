# Blog API Documentation

**Base URL:** `/api/v1`

**Authentication:** All endpoints (except public auth endpoints) require an `Authorization: Bearer <token>` header. Some endpoints require `admin` role.

---

## Authentication Routes (`/auth`)

### POST `/auth/register`

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "jwt_token_here"
}
```

---

### POST `/auth/login`

Login using email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "jwt_token_here"
}
```

_Note: Sets an HTTP-only refresh token cookie._

---

### POST `/auth/refresh-token`

Uses refresh token (from HTTP-only cookie) to issue a new access token.

**Response:**

```json
{
  "accessToken": "new_jwt_token_here"
}
```

---

### POST `/auth/logout`

Logout user and invalidate refresh token.

**Headers:**

```
Authorization: Bearer <access_token>
```

---

## User Routes (`/users`)

### GET `/users/current`

Get authenticated user's data.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Response:**

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### PUT `/users/current`

Update authenticated user profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

### DELETE `/users/current`

Delete the logged-in user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

---

### GET `/users`

Get all users (paginated).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### GET `/users/:userId`

Get user by ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin`

**Path Parameters:**

- `userId`: User's MongoDB ID

---

### DELETE `/users/:userId`

Delete user by ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin`

**Path Parameters:**

- `userId`: User's MongoDB ID

---

## Blog Routes (`/blogs`)

### POST `/blogs`

Create a blog.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Required Role:** `admin`

**Request Body:**

```json
{
  "title": "Blog Title",
  "content": "Blog content here...",
  "slug": "blog-title-url",
  "excerpt": "Short description",
  "tags": ["tag1", "tag2"],
  "published": true
}
```

**Response:**

```json
{
  "id": "blog_id",
  "title": "Blog Title",
  "slug": "blog-title-url",
  "content": "Blog content here...",
  "authorId": "user_id",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### GET `/blogs`

Retrieve all blogs (paginated).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `tag` (optional): Filter by tag
- `search` (optional): Search in title and content

---

### GET `/blogs/user/:userId`

Get all blogs created by a specific user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `userId`: User's MongoDB ID

---

### GET `/blogs/:slug`

Get a blog by slug.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `slug`: Blog's URL slug

---

### PUT `/blogs/:blogId`

Update blog.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Required Role:** `admin`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

**Request Body:** (same as POST `/blogs`)

---

### DELETE `/blogs/:blogId`

Delete blog.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

---

## Comment Routes (`/comments`)

### POST `/comments/blog/:blogId`

Create comment on a blog.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

**Request Body:**

```json
{
  "content": "This is a comment on the blog post."
}
```

**Response:**

```json
{
  "id": "comment_id",
  "content": "This is a comment on the blog post.",
  "authorId": "user_id",
  "blogId": "blog_id",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### GET `/comments/blog/:blogId`

Get comments for a blog.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

---

### DELETE `/comments/:commentId`

Delete comment.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `commentId`: Comment's MongoDB ID

---

## Like Routes (`/likes`)

### POST `/likes/blog/:blogId`

Like a blog.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

**Request Body:**

```json
{
  "userId": "user_mongo_id"
}
```

---

### DELETE `/likes/blog/:blogId`

Unlike a blog.

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Required Role:** `admin` or `user`

**Path Parameters:**

- `blogId`: Blog's MongoDB ID

**Request Body:**

```json
{
  "userId": "user_mongo_id"
}
```

---

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message here",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Common Status Codes:**

- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal server error

---

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- Other endpoints: 100 requests per minute per user
