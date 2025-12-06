====================================================
📄 docs/SECURITY.md — Security Architecture & Best Practices
====================================================

# 🔒 Security Documentation — Blog API

This document covers all security mechanisms implemented in the Blog API backend, including:

- Authentication & token security
- Authorization & role enforcement
- Input validation & sanitization
- Session and refresh token handling
- Rate limiting
- Transport & cookie security
- Password hashing
- Database safety
- Common attack vectors & mitigations

The system follows modern security standards suitable for production environments.

---

====================================================

# 📘 1. Authentication Security

====================================================

The Blog API uses a **dual JWT token system**:

- **Access Token**

  - Short-lived
  - Sent via `Authorization: Bearer <token>`
  - Contains: `{ userId }`

- **Refresh Token**
  - Long-lived
  - **Stored in HttpOnly, SameSite=Strict cookie**
  - Stored _also_ in MongoDB for session validation
  - Used only at: `/auth/refresh-token`

## Why this design is secure?

### ✔ HttpOnly cookie

Prevents JavaScript from stealing refresh tokens via XSS.

### ✔ SameSite=Strict

Prevents CSRF attacks from external sites.

### ✔ Token stored in DB

A stolen refresh token is useless if not present in the DB.

### ✔ Access token short-lived

Limits impact if an access token is leaked.

---

====================================================

# 📘 2. Authorization Security

====================================================

Authorization is enforced by:

### **1. authenticate.ts**

- Verifies access token signature
- Detects:
  - Expired tokens → `401`
  - Invalid tokens → `401`
  - Missing tokens → `401`

### **2. authorize.ts**

Checks if user role matches required roles:

```ts
authorize(['admin'])
authorize(['admin', 'user'])

If role mismatch → 403 Forbidden.
✔ Only admins can:
    Create, update, or delete blogs
    View all users
    Delete any user
✔ Users cannot escalate to admin
Admin role is restricted by: WHITELIST_ADMINS_MAIL
If user is not in the whitelist → cannot register as admin.

====================================================
# 📘 3. Password Security
====================================================
Passwords are secured via:
✔ bcrypt hashing

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
✔ Enforced minimum length (6 characters)
✔ Password never returned in API
✔ Password comparison uses secure hashing

====================================================
# 📘 4. Input Validation & Sanitization
====================================================
The API uses:

✔ express-validator
Every route validates:
    Email format
    Password strength
    Slug format
    MongoId validity
    Pagination parameters

✔ Sanitization using DOMPurify + JSDOM
Blog content is sanitized before storage to prevent:
    XSS
    Script injection
    Malicious HTML payloads

✔ Multer File Validation
Banner uploads are validated through:
    Size limits
    MIME type filtering
    Cloudinary sanitization

====================================================
# 📘 5. Rate Limiting
====================================================
Global rate limiting ensures bots and attackers cannot flood the server.

Implementation (express-rate-limit)
app.use(limiter);

Configured to:
    Limit requests per IP
    Block abusive clients
    Protect endpoints from DDoS & brute force attacks


====================================================
# 📘 6. Transport Security
====================================================
✔ HTTPS enforced in production
Secure cookies require HTTPS:
secure: config.NODE_ENV === 'production'

✔ Nginx reverse proxy recommended
In /docker/nginx.conf.
✔ Helmet middleware enabled
app.use(helmet());
This includes protections against:
    XSS
    MIME sniffing
    Clickjacking
    DNS prefetch attacks
    Frame injection
```

====================================================

# 📘 7. Token Security

====================================================
Access Token Security
Signed using HS256
Contains minimal data (userId)
Short-lived (ACCESS_TOKEN_EXPIRY)
Verified on every protected request

Refresh Token Security
Stored only in HttpOnly cookies
Stored in DB
Unique per session
Deleted on logout
Checked before issuing new access token

🔒 Refresh Token Theft Protection
If an attacker steals the token:
It will not exist in database → request denied
It cannot be accessed from JS (HttpOnly)
CSRF is prevented (SameSite=Strict)
Token rotation can be implemented easily (future enhancement)

====================================================

# 📘 8. Common Attack Vectors & Mitigation

====================================================
🛡 XSS (Cross-Site Scripting)
Mitigated by:
DOMPurify sanitization
HTML escaping
HttpOnly cookies
Helmet’s XSS filter

🛡 CSRF (Cross-Site Request Forgery)
Mitigated by:
SameSite=Strict refresh token cookie
No sensitive operations allowed without Authorization header
Access token cannot be sent automatically by browser

🛡 SQL/Mongo Injection
Mitigated by:
Mongoose query sanitization
express-validator checks
No string interpolation into queries

🛡 Brute Force Attacks
Mitigated by:
express-rate-limit
bcrypt password hashing
No overly verbose authentication errors

🛡 DDoS & Traffic Flood
Mitigated by:
Rate limiting
Compression
Lightweight controllers
Nginx as reverse proxy

🛡 Insecure Direct Object Access (IDOR)
Mitigated by:
authenticate + authorize mandatory
Validation using .isMongoId()
Role enforcement
User cannot access other user's data unless admin

====================================================

# 📘 9. Logging & Monitoring Security

====================================================

Using Winston:

error.log for error stack traces

access.log for incoming requests

app.log for application events

Sensitive data (passwords, tokens) is never logged.

====================================================

# 📘 10. Deployment Security

====================================================

Recommended production setup:

Reverse proxy via Nginx

HTTPS enabled

API rate limits at both Nginx & Express

PM2 running in cluster mode

Environment variables stored in .env (never committed)

Docker container isolation

Database authentication enabled

====================================================

# 📘 11. Security Recommendations for Future Versions

====================================================
🔧 Token Rotation (Highly Recommended)
Rotate refresh tokens on every use.

🔧 IP & Device Tracking for Sessions

Store user-agent + IP with Token model.

🔧 2FA / MFA Support

OTP or authenticator app.

🔧 Account Lockout after repeated login failures

Prevent brute force attempts.

🔧 Email verification flow

Prevent spam registrations.

🔧 Audit logging

Log admin operations for compliance.

📘 12. Summary

This backend implements a robust security stack:

✔ JWT access + refresh tokens
✔ HttpOnly / SameSite cookies
✔ Role-based access control
✔ Password hashing
✔ Strict validation
✔ Sanitized input
✔ Helmet protection
✔ Rate limiting
✔ DB-backed sessions
✔ Strong logging
