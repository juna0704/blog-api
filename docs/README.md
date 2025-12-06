====================================================

---

====================================================

# 📘 Blog API — REST Backend (Node.js + Express + TypeScript)

A production-ready blog platform backend built with:

- **Node.js + Express (v5)**
- **TypeScript**
- **MongoDB + Mongoose (v9)**
- **JWT Authentication (Access + Refresh Tokens)**
- **Rate Limiting, Helmet Security**
- **Modular Controllers, Services, Middlewares**
- **Cloudinary Uploads**
- **Winston Logging**
- **Docker + PM2 + Nginx**

This backend powers a complete blog system including:

- User registration + login
- Token refresh + logout
- Role-based access (admin, user)
- Blog creation, update, deletion
- Comments system
- Likes system
- Pagination + filtering
- Highly validated API using express-validator

---

====================================================

---

====================================================

## 🚀 Features

### **Authentication**

- Register, Login, Logout
- Refresh Access Tokens securely
- Secure HttpOnly cookies
- Password hashing with bcrypt

### **Authorization**

- Role-based access (`admin`, `user`)
- Route-level permission middleware

### **Blogs**

- Create / Get / Update / Delete
- Upload blog banners
- Paginated queries
- Blogs by user
- Blog access control

### **Comments**

- Add / Delete / Retrieve comments by blog

### **Likes**

- Like / Unlike a blog
- Prevent duplicate likes

### **Security**

- Helmet HTTP headers
- Global rate limiting
- Sanitization with DOMPurify
- Centralized error handling

### **Infrastructure**

- Docker configuration
- Nginx reverse proxy
- PM2 process manager
- Automated scripts for DB backup/restore

---

====================================================

---

====================================================

## 📦 Installation

```bash
git clone https://github.com/YOUR-REPO/blog-api.git
cd blog-api
npm install
```
