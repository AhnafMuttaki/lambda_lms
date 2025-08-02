# User Service API Documentation

This document describes the API endpoints for the User Service (`user-service`).

## Base URL

- Local: `http://localhost:3001`

## Endpoints

### Health Check
- **GET** `/health`
  - Returns: `{ status: 'ok', service: 'user-service' }`

### Register
- **POST** `/users/register`
  - Request body: `{ name, email, password, role }`
    - `role`: one of `student`, `teacher`, `admin`, `super_admin`
  - Response: `{ token }` (JWT)
  - Errors: 400 (validation), 500 (server)

### Login
- **POST** `/users/login`
  - Request body: `{ email, password }`
  - Response: `{ token }` (JWT)
  - Errors: 401 (invalid credentials), 500 (server)

### Get User Profile
- **GET** `/users/:id`
  - Response: `{ id, name, email, role, status, bio, avatar_url }`
  - Errors: 404 (not found), 500 (server)

### Update User Profile
- **PUT** `/users/:id`
  - Request body: `{ name?, bio?, avatar_url? }`
  - Response: `{ message: 'Updated' }`
  - Errors: 404 (not found), 500 (server)

### Reset Password
- **POST** `/users/reset-password`
  - Request body: `{ email, new_password }`
  - Response: `{ message: 'Password reset' }`
  - Errors: 404 (not found), 500 (server)

### Change User Role
- **PATCH** `/users/:id/role`
  - Request body: `{ role }` (one of `student`, `teacher`, `admin`, `super_admin`)
  - Response: `{ message: 'Role updated' }`
  - Errors: 400 (invalid input), 404 (not found), 500 (server)

## Swagger/OpenAPI

- API docs available at: `/api-docs` (e.g., http://localhost:3001/api-docs)

## CORS

- CORS is enabled for all origins by default.

---

For more details, see the code in `user-service/index.ts` or the Swagger UI.
