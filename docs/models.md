📄 docs/models.md — Data Models & Schema Documentation

# 🗄 Data Models — Blog API

This document describes all MongoDB models used in the Blog API.  
Each model includes:

- Fields and types
- Validation rules
- Indices
- Relationships
- Lifecycle hooks
- Example documents
- Entity relationship diagram (ERD)

---

# 📘 1. User Model

### File: `src/models/user.ts`

The `User` model represents an authenticated user of the system.  
It includes basic profile details, credentials, and role-based access control.

## Schema

| Field         | Type              | Required | Notes                                    |
| ------------- | ----------------- | -------- | ---------------------------------------- |
| `username`    | String            | ✔ Yes   | Unique, auto-generated, max 20 chars     |
| `email`       | String            | ✔ Yes   | Unique, validated, lowercased            |
| `password`    | String            | ✔ Yes   | Hashed with bcrypt, min length 6         |
| `role`        | "user" \| "admin" | Optional | Defaults to `user`                       |
| `firstName`   | String            | Optional | Max 20 chars                             |
| `lastName`    | String            | Optional | Max 20 chars                             |
| `socialLinks` | Object            | Optional | website, facebook, instagram, x, youtube |
| `createdAt`   | Date              | Auto     | Timestamp                                |
| `updatedAt`   | Date              | Auto     | Timestamp                                |

## Password Hashing Hook

```ts
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, salt);
});

Example Document
{
  "_id": "66f89a123abc990011abcd01",
  "username": "user-xj91kf",
  "email": "john@example.com",
  "role": "user",
  "socialLinks": {
    "facebook": "https://facebook.com/john"
  },
  "createdAt": "2025-02-14T10:15:00.000Z"
}

====================================================
****************************************************
====================================================
📘 2. Blog Model
File: src/models/blog.ts

A blog article written by a user.
Includes title, content, banner, slug, author, counters, and publication status.

Schema
| Field             | Type                  | Required        | Notes                             |
| ----------------- | --------------------- | --------------- | --------------------------------- |
| `title`           | String                | ✔ Yes           | Max 180 chars                     |
| `slug`            | String                | ✔ Yes           | Unique, auto-generated from title |
| `content`         | String                | ✔ Yes           | Sanitized HTML                    |
| `banner.publicId` | String                | ✔ Yes           | Cloudinary public ID              |
| `banner.url`      | String                | ✔ Yes           | Cloudinary URL                    |
| `banner.width`    | Number                | ✔ Yes           | Image width                       |
| `banner.height`   | Number                | ✔ Yes           | Image height                      |
| `author`          | ObjectId              | ✔ Yes           | Ref: User                         |
| `viewsCount`      | Number                | Default 0       | View counter                      |
| `likesCount`      | Number                | Default 0       | Incremented on like               |
| `commentsCount`   | Number                | Default 0       | Incremented on comment            |
| `status`          | "draft" | "published" | Default "draft" | Controls visibility               |
| `publishedAt`     | Date                  | Auto            | CreatedAt field renamed           |


Slug Generation
blogSchema.pre("validate", function() {
  if (this.title && !this.slug) {
    this.slug = genSlug(this.title);
  }
});

EXAMPLE DOCUMENT
{
  "_id": "66faa0a237bc9922113bcda2",
  "title": "Understanding Async/Await",
  "slug": "understanding-async-await",
  "banner": {
    "publicId": "blog/abc123",
    "url": "https://res.cloudinary.com/...",
    "width": 1200,
    "height": 720
  },
  "author": "66f89a123abc990011abcd01",
  "likesCount": 5,
  "commentsCount": 2,
  "status": "published",
  "publishedAt": "2025-02-13T18:21:00.000Z"
}

====================================================
****************************************************
====================================================
📘 3. Comment Model
File: src/models/comment.ts

Represents a user comment on a blog post.
Schema
| Field       | Type     | Required | Notes        |
| ----------- | -------- | -------- | ------------ |
| `blogId`    | ObjectId | ✔ Yes    | Ref: Blog    |
| `userId`    | ObjectId | ✔ Yes    | Ref: User    |
| `content`   | String   | ✔ Yes    | Comment text |
| `createdAt` | Date     | Auto     | Timestamp    |
| `updatedAt` | Date     | Auto     | Timestamp    |

Example Document
{
  "_id": "993fam1283abbb9900ccdb21",
  "blogId": "66faa0a237bc9922113bcda2",
  "userId": "66f89a123abc990011abcd01",
  "content": "Great explanation! Helped a lot.",
  "createdAt": "2025-02-17T09:15:00.000Z"
}

====================================================
****************************************************
====================================================
📘 4. Like Model
File: src/models/like.ts

Tracks likes on blog posts.
Schema
| Field       | Type     | Required | Notes                         |
| ----------- | -------- | -------- | ----------------------------- |
| `blogId`    | ObjectId | Optional | Ref: Blog                     |
| `commentId` | ObjectId | Optional | Ref: Comment (future support) |
| `userId`    | ObjectId | ✔ Yes    | Ref: User                     |

Important Logic
    A like represents a user’s reaction to a blog.
    Duplicate likes are prevented at controller level.
    Blog’s likesCount is updated atomically in controller using $inc.

Example Document
{
  "_id": "ff12ab90bc129912aa8931ab",
  "blogId": "66faa0a237bc9922113bcda2",
  "userId": "66f89a123abc990011abcd01"
}

====================================================
****************************************************
====================================================
📘 5. Token Model
File: src/models/token.ts

Represents a refresh token session.
Stored per login session.
Schema
| Field    | Type     | Required | Notes                 |
| -------- | -------- | -------- | --------------------- |
| `token`  | String   | ✔ Yes    | Raw JWT refresh token |
| `userId` | ObjectId | ✔ Yes    | Ref: User             |

Behavior
    Created on login
    Removed on logout
    Checked during refresh token flow
    Allows multi-device login sessions

Example Document
{
  "_id": "8812bad1238ab9944a113aec",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "userId": "66f89a123abc990011abcd01"
}

====================================================
****************************************************
====================================================
🧩 6. Entity Relationship Diagram (ERD)
Using Mermaid (GitHub supports this):
erDiagram

    USER ||--o{ BLOG : "writes"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ LIKE : "likes blogs"

    BLOG ||--o{ COMMENT : "has comments"
    BLOG ||--o{ LIKE : "has likes"

    USER ||--o{ TOKEN : "login sessions"

====================================================
****************************************************
====================================================
📘 7. Model Interactions Summary
🔹 User
    can create blogs
    can comment on blogs
    can like blogs
    has login sessions stored in Token
    role controls access (admin, user)

🔹 Blog
    belongs to a user
    has comments
    has likes
    has banner image on Cloudinary
    uses slug for URL

🔹 Like
    ensures a user can like a blog only once
    increments/decrements likesCount

🔹 Comment
    linked to user and blog
    increments commentsCount on blog

🔹 Token
    validates refresh token
    used for session-based authentication

====================================================
****************************************************
====================================================
```
