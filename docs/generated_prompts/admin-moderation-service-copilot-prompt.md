# Prompt for Copilot: Admin/Moderation Service for LMS

## Context
You are to generate a production-ready admin-moderation-service for a Learning Management System (LMS) similar to Udemy.
The service must be implemented in TypeScript using Node.js, Express, and MySQL.
It must be dockerized and runnable with Docker Compose, which also runs a MySQL server.
The service is part of a microservices architecture as described in the BRD, feature list, solution architecture, and tasklist.

## Requirements

### Functional
- Approve/reject courses and content
- Moderate user-generated content
- View moderation logs
- Store moderation actions and logs
- All input validation as per tasklist
- API documentation via Swagger (OpenAPI 3)
- Unit tests for all endpoints (Jest + Supertest)
- Database migration scripts for MySQL (moderation_logs table)

### Non-Functional
- TypeScript throughout
- Dockerfile for service
- docker-compose.yml to run service + MySQL (with persistent volume)
- All ports and credentials configurable via .env
- MySQL connection pooling
- Service must export Express app for testing
- Ready for AWS Lambda adaptation (stateless, env-based config)

## Deliverables

- `index.ts` (Express app with all endpoints, Swagger docs, MySQL integration)
- `package.json` (dependencies, scripts for build, start, test)
- `tsconfig.json` (TypeScript config)
- `Dockerfile` (builds and runs the service)
- `migrations/001_create_moderation_logs.sql` (migration script)
- `.env` and `example.env` (all config variables)
- `__tests__/admin-moderation-api.test.ts` (unit tests for all endpoints)
- Swagger UI available at `/api-docs`

## Example .env

```
MYSQL_HOST=mysql
MYSQL_DATABASE=lms
MYSQL_USER=lmsuser
MYSQL_PASSWORD=lmspassword
MYSQL_PORT=3306
ADMIN_SERVICE_PORT=3010
```

## Coding Standards

- Use async/await and modern TypeScript best practices
- Use parameterized queries to prevent SQL injection
- Use proper error handling and HTTP status codes
- Use OpenAPI 3 for Swagger docs
- All endpoints must be covered by unit tests

## Output

Generate all required files and code for the admin-moderation-service as described above. 