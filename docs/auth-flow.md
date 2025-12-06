# 🔐 Authentication & Authorization Flow — Blog API

This document fully explains how authentication, authorization, token lifecycle, refresh token rotation, and access control work in the Blog API.

Authentication consists of:

- JWT **Access Token** (short-lived)
- JWT **Refresh Token** (long-lived, HttpOnly cookie)
- Token storage in MongoDB for session validation
- Middleware-based authentication & role authorization

---

====================================================

---

====================================================

# 📘 1. Overview of the Auth System

## ✔ Access Token

- Short-lived
- Sent by client in:

- Verified on every protected request
- Contains:

```json
{
  "userId": "<mongodb-id>"
}
Expiry: Defined by ACCESS_TOKEN_EXPIRY (e.g., 15m)

✔ Refresh Token
    Long-lived
    Stored in database (Token collection)
    Stored as HttpOnly cookie:
    Set-Cookie: refreshToken=<token>; HttpOnly; SameSite=Strict
    POST /auth/refresh-token

✔ Login Sequence Diagram
sequenceDiagram
    autonumber
    Client->>Server: POST /auth/login (email, password)
    Server->>DB: Find user by email
    DB-->>Server: User (with password)
    Server->>Server: Compare bcrypt hashes
    alt Password incorrect
        Server-->>Client: 401 Unauthorized
    end

    Server->>Server: Generate Access Token
    Server->>Server: Generate Refresh Token
    Server->>DB: Store refresh token (Token.create)
    DB-->>Server: OK

    Server-->>Client: Set-Cookie refreshToken + JSON { accessToken, user }

====================================================
****************************************************
====================================================
📘 2. Registration Flow

    Registration includes:
    Email uniqueness check
    Admin whitelist validation
    Username auto-generation
    Token generation
✔ Sequence Diagram
    autonumber
    Client->>Server: POST /auth/register (email, password, role)
    Server->>Server: Validate request data
    alt role="admin" AND email not whitelisted
        Server-->>Client: 403 Forbidden
        return
    end

    Server->>DB: Check if user exists
    DB-->>Server: No
    Server->>Server: genUsername()

    Server->>DB: Create new user (hashed password)
    DB-->>Server: User created

    Server->>Server: Generate Access Token
    Server->>Server: Generate Refresh Token
    Server->>DB: Store refresh token

    Server-->>Client: Set-Cookie refreshToken + JSON { user, accessToken }

====================================================
****************************************************
====================================================
📘 3. Access Token Validation (authenticate.ts)

    This middleware checks:
    Authorization header exists
    Token starts with Bearer
    Token is valid/non-expired
    Extracts userId
    Attaches it to: req.userId

✔ Diagram
flowchart TD
    A[Incoming Request] --> B{Authorization Header?}
    B -- No --> Z1[401 Missing Token]
    B -- Yes --> C{Starts with Bearer?}
    C -- No --> Z1
    C -- Yes --> D[Extract token]
    D --> E[verifyAccessToken()]
    E -- Expired --> Z2[401 Token Expired]
    E -- Invalid --> Z3[401 Invalid Token]
    E -- Valid --> F[req.userId = payload.userId]
    F --> G[next()]

====================================================
****************************************************
====================================================
📘 4. Role-Based Authorization (authorize.ts)

    The authorization middleware:
    Looks up the user using req.userId
    Checks if user exists
    Validates role against allowed roles
    Example:
        authorize(["admin", "user"]);
✔ Role Flow Diagram
flowchart TD
    A[authenticate()] --> B[authorize()]
    B --> C[Find user by req.userId]
    C --> D{User found?}
    D -- No --> E[404 User Not Found]
    D -- Yes --> F{Role Allowed?}
    F -- No --> G[403 Forbidden]
    F -- Yes --> H[next()]

====================================================
****************************************************
====================================================
📘 5. Refresh Token Flow

Route: POST /auth/refresh-token
Steps:
    Read refreshToken from cookie
    Check token exists in DB
    Verify refresh token signature
    Generate a new access token
    Return { accessToken }

💡 Refresh token is NOT rotated in current implementation.
(Current behavior is: access token new, refresh token unchanged.)

✔ Diagram
sequenceDiagram
    autonumber
    Client->>Server: POST /auth/refresh-token (Cookie: refreshToken)
    Server->>DB: Token.exists(refreshToken)
    alt Not found
        Server-->>Client: 401 Invalid refresh token
        return
    end
    Server->>Server: verifyRefreshToken()
    alt Expired
        Server-->>Client: 401 Refresh expired
        return
    end
    Server->>Server: Generate new Access Token
    Server-->>Client: JSON { accessToken }

====================================================
****************************************************
====================================================
📘 6. Logout Flow

Logout:

Reads refreshToken from cookies
Removes token from database
Clears cookie
Returns HTTP 204
✔ Diagram
sequenceDiagram
    autonumber
    Client->>Server: POST /auth/logout (Cookie: refreshToken)
    Server->>DB: Delete token
    DB-->>Server: OK
    Server-->>Client: Clear-Cookie refreshToken + 204 No Content


====================================================
****************************************************
====================================================
📘 7. JWT Token Structure

tokens include only:
    {
  "userId": "<mongo-id>",
  "iat": 1712345678,
  "exp": 1712349876,
  "sub": "<mongo-id>"
}

Access Token
    Signed with: config.JWT_ACCESS_SECRET

Refresh Token
    Signed with: config.JWT_REFRESH_SECRET

====================================================
****************************************************
====================================================
📘 8. Token Storage in Database

The Token model:
{
  token: string,
  userId: ObjectId
}
Used to:
    Validate refresh tokens
    Track multiple sessions (mobile + web, etc.)
    Invalidate tokens on logout

====================================================
****************************************************
====================================================
📘 9. Security Design
✔ HttpOnly cookies (prevents JS access)
✔ SameSite "Strict" (prevents CSRF)
✔ Access tokens short-lived
✔ Refresh tokens validated in DB
✔ Passwords hashed using bcrypt
✔ Admin registration restricted via whitelist
✔ Role-based authorization for protected endpoints
✔ Rate limiting enabled
✔ Helmet headers applied

====================================================
****************************************************
====================================================
📘 10. End-to-End Summary Diagram
flowchart LR
    A[Register/Login] --> B[Receive Access Token + Refresh Token Cookie]

    B --> C[Access Protected Routes]
    C --> D[authenticate.ts verifies token]
    D -->|Valid| E[authorize.ts checks role]
    E --> F[Controller Executes]

    C -->|Expired Access Token| G[/auth/refresh-token]
    G --> H[verifyRefreshToken]
    H --> I[Return New Access Token]

    I --> C

    J[Logout] --> K[DB delete refresh token]
    K --> L[clearCookie]
```
