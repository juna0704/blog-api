# 🤝 Contributing to Blog API

Thank you for your interest in contributing to the Blog API!  
This document outlines the rules, standards, and guidelines to ensure consistent, clean, and secure contributions.

---

# 📘 1. Getting Started

## 1.1 Fork the repository

Create your own copy of the repo.

## 1.2 Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/blog-api.git
cd blog-api

## 1.3 Install dependencies
npm install

## 1.4 Start development server
npm run dev

## 1.5 Environment setup
Create .env using .env.example as a reference:
PORT=3000
DB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WHITELIST_ORIGINS=http://localhost:5173

📘 2. Codebase Structure
All project folders follow a clean layered architecture:
routes → controllers → services → models → database
Key directories:
src/controllers — API logic
src/services — business logic
src/models — Mongoose schemas
src/middlewares — auth, validation, upload, etc.
src/lib — JWT, logger, DB connection
src/utils — helper utilities
tests — unit, integration, e2e tests
Please follow the existing structure when adding new modules.


📘 3. Branching Guidelines
We use the GitHub Flow branching model:
✔ Main branch:
Always stable
Production-ready
✔ Feature branches:
feature/<feature-name>
✔ Bug fix branches:
php-template
Copy code
fix/<issue-description>
✔ Releases:
arduino
Copy code
release/x.y.z
✔ No direct commits to main
Always open a Pull Request.

📘 4. Commit Message Rules
Follow Conventional Commits:

arduino
Copy code
<type>(scope): short description
Allowed <type> values:
feat — new feature

fix — bug fix

docs — documentation

refactor — no behavior change

test — adding tests

chore — maintenance

perf — performance improvement

Examples:
pgsql
Copy code
feat(auth): add refresh token rotation
fix(blog): correct slug validation middleware
docs: update API authentication section
refactor(user): simplify role validation logic
📘 5. Coding Standards
✔ TypeScript everywhere
No JS files in src/.

✔ Use @/* path aliases
Do not use relative paths like ../../../.

✔ Follow existing naming conventions
Controllers: action_name.controller.ts

Services: module.service.ts

Routes: module.routes.ts

Models: module.ts

✔ Linting & Formatting
This project uses Prettier.

Before committing:

bash
Copy code
npm run format
📘 6. Writing Controllers
Controllers must:

Validate input via express-validator

Handle errors with validationError middleware

Contain no business logic

Use services for DB interactions

Log meaningful actions using logger

Example template:

ts
Copy code
const controller = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await service.operation(req.userId!, req.body);
    res.status(200).json(result);
  } catch (err) {
    logger.error("Controller Error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
📘 7. Writing Services
Services must:

Contain all business logic

Never return HTTP responses

Throw meaningful errors

Perform DB operations via models

Avoid direct Express dependency

📘 8. Tests
The project includes:

bash
Copy code
tests/unit
tests/integration
tests/e2e
Use jest or similar test frameworks.

Running tests:
bash
Copy code
npm test
All new features must include:

Unit tests (service-level)

Controller tests

Integration tests if endpoint changes

📘 9. Creating Pull Requests
✔ PR Requirements:
PR title follows Conventional Commits

Description includes:

What was changed

Why it was changed

Screenshots (if applicable)

Tests updated/added

No console logs or commented-out code

CI pipeline passing

✔ Small PRs are strongly encouraged
Avoid large, multi-purpose pull requests.

📘 10. Security Guidelines
🔒 NEVER:
Log passwords or tokens

Expose secrets in .env

Commit database dumps

Disable authentication in production

Accept admin role without whitelist validation

If you find a security vulnerability:
Email the maintainer directly:
junaidalikhan0704@gmail.com

📘 11. Style Guide Summary
Category	Standard
Language	TypeScript
Architecture	MVC + Services
Env	.env (never committed)
Logging	Winston
Error Handling	centralized via JSON responses
Imports	@/* aliases
Code Formatter	Prettier
Comments	JSDoc-style

📘 12. Contribution Checklist
Before submitting a PR:

 Code compiles (npm run build)

 Project runs locally (npm run dev)

 No TypeScript errors

 No unused variables

 Prettier formatted

 Tests passed

 PR description completed

🙏 Thank You for Contributing!
Your contributions help improve the API for everyone.
Feel free to open issues, start discussions, or submit PRs.
```
