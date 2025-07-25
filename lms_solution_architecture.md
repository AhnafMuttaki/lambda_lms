# Solution Architecture Document: Learning Management System (LMS)

## 1. Overview

This document describes the solution architecture for the LMS as outlined in the BRD. The system will be built using a microservices architecture, with each service responsible for a specific domain. The backend will use Node.js/Express, the frontend will use Vue.js, and MySQL will be the primary database.

---

## 2. Microservices Overview

Each microservice will have its own codebase, API endpoints, and database schema (shared or isolated MySQL instance, see scalability below). Services communicate via REST APIs and asynchronous messaging (e.g., RabbitMQ) for events.

- **User Service**
- **Course Service**
- **Content Service**
- **Quiz Service**
- **Enrollment Service**
- **Certificate Service**
- **Live Session Service**
- **Notification Service**
- **Analytics & Reporting Service**
- **Admin/Moderation Service**
- **Discussion/Q&A Service**

---

## 3. Database Architecture (MySQL)

### 3.1 Database Scalability

- **Single Database (Monolithic):** Suitable for MVP/small scale. All tables in one schema, easier joins, but limited scalability.
- **Schema-per-Service:** Each microservice has its own schema in the same MySQL instance. Reduces coupling, easier scaling.
- **Database-per-Service:** Each microservice has its own MySQL instance or cluster. Best for large scale, enables sharding and independent scaling.
- **Sharding:** For very large datasets, tables (e.g., users, enrollments) can be sharded by user/org.
- **Read Replicas:** Use MySQL read replicas for scaling read-heavy workloads.
- **Multi-Region:** Deploy replicas in multiple regions for global access.

**Recommendation:** Start with schema-per-service, migrate to database-per-service as scale grows. Use read replicas and sharding for high-traffic tables.

### 3.2 Example Table Schemas (with Types & Relations)

#### users
| Field         | Type           | Constraints                     |
|---------------|----------------|---------------------------------|
| id            | BIGINT         | PK, AUTO_INCREMENT              |
| name          | VARCHAR(255)   | NOT NULL                        |
| email         | VARCHAR(255)   | UNIQUE, NOT NULL                |
| password_hash | VARCHAR(255)   | NOT NULL                        |
| role          | ENUM           | ('super_admin','admin','teacher','student') |
| status        | ENUM           | ('active','inactive','banned')  |
| created_at    | DATETIME       | NOT NULL                        |
| updated_at    | DATETIME       | NOT NULL                        |

#### user_profiles
| Field      | Type         | Constraints         |
|------------|--------------|---------------------|
| user_id    | BIGINT       | PK, FK users(id)    |
| bio        | TEXT         |                     |
| avatar_url | VARCHAR(512) |                     |

#### courses
| Field       | Type         | Constraints                  |
|-------------|--------------|------------------------------|
| id          | BIGINT       | PK, AUTO_INCREMENT           |
| title       | VARCHAR(255) | NOT NULL                     |
| description | TEXT         |                              |
| status      | ENUM         | ('draft','pending','published','rejected') |
| teacher_id  | BIGINT       | FK users(id)                 |
| created_at  | DATETIME     | NOT NULL                     |
| updated_at  | DATETIME     | NOT NULL                     |

#### course_modules
| Field     | Type         | Constraints           |
|-----------|--------------|-----------------------|
| id        | BIGINT       | PK, AUTO_INCREMENT    |
| course_id | BIGINT       | FK courses(id)        |
| title     | VARCHAR(255) | NOT NULL              |
| `order`   | INT          |                       |

#### course_sections
| Field     | Type         | Constraints           |
|-----------|--------------|-----------------------|
| id        | BIGINT       | PK, AUTO_INCREMENT    |
| module_id | BIGINT       | FK course_modules(id) |
| title     | VARCHAR(255) | NOT NULL              |
| `order`   | INT          |                       |

#### contents
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| course_id  | BIGINT       | FK courses(id)        |
| module_id  | BIGINT       | FK course_modules(id) |
| section_id | BIGINT       | FK course_sections(id)|
| type       | ENUM         | ('video','pdf','interactive') |
| url        | VARCHAR(512) | NOT NULL              |
| metadata   | JSON         |                       |
| `order`    | INT          |                       |
| created_at | DATETIME     | NOT NULL              |

#### quizzes
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| course_id  | BIGINT       | FK courses(id)        |
| module_id  | BIGINT       | FK course_modules(id) |
| title      | VARCHAR(255) | NOT NULL              |
| type       | ENUM         | ('mcq','short','tf')  |

#### quiz_questions
| Field         | Type         | Constraints           |
|---------------|--------------|-----------------------|
| id            | BIGINT       | PK, AUTO_INCREMENT    |
| quiz_id       | BIGINT       | FK quizzes(id)        |
| question_text | TEXT         | NOT NULL              |
| type          | ENUM         | ('mcq','short','tf')  |
| options       | JSON         |                       |
| answer        | TEXT         |                       |

#### quiz_attempts
| Field        | Type     | Constraints           |
|--------------|----------|-----------------------|
| id           | BIGINT   | PK, AUTO_INCREMENT    |
| quiz_id      | BIGINT   | FK quizzes(id)        |
| user_id      | BIGINT   | FK users(id)          |
| score        | FLOAT    |                       |
| started_at   | DATETIME |                       |
| completed_at | DATETIME |                       |

#### quiz_answers
| Field       | Type     | Constraints           |
|-------------|----------|-----------------------|
| id          | BIGINT   | PK, AUTO_INCREMENT    |
| attempt_id  | BIGINT   | FK quiz_attempts(id)  |
| question_id | BIGINT   | FK quiz_questions(id) |
| answer      | TEXT     |                       |
| is_correct  | BOOLEAN  |                       |

#### enrollments
| Field        | Type     | Constraints           |
|--------------|----------|-----------------------|
| id           | BIGINT   | PK, AUTO_INCREMENT    |
| user_id      | BIGINT   | FK users(id)          |
| course_id    | BIGINT   | FK courses(id)        |
| status       | ENUM     | ('active','completed','cancelled') |
| enrolled_at  | DATETIME |                       |
| completed_at | DATETIME |                       |

#### progress
| Field        | Type     | Constraints           |
|--------------|----------|-----------------------|
| id           | BIGINT   | PK, AUTO_INCREMENT    |
| enrollment_id| BIGINT   | FK enrollments(id)    |
| module_id    | BIGINT   | FK course_modules(id) |
| section_id   | BIGINT   | FK course_sections(id)|
| status       | ENUM     | ('not_started','in_progress','completed') |
| updated_at   | DATETIME |                       |

#### certificates
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| user_id    | BIGINT       | FK users(id)          |
| course_id  | BIGINT       | FK courses(id)        |
| url        | VARCHAR(512) | NOT NULL              |
| issued_at  | DATETIME     |                       |

#### live_sessions
| Field       | Type         | Constraints           |
|-------------|--------------|-----------------------|
| id          | BIGINT       | PK, AUTO_INCREMENT    |
| course_id   | BIGINT       | FK courses(id)        |
| teacher_id  | BIGINT       | FK users(id)          |
| zoom_link   | VARCHAR(512) |                       |
| scheduled_at| DATETIME     |                       |
| duration    | INT          | (minutes)             |

#### live_session_attendance
| Field      | Type     | Constraints           |
|------------|----------|-----------------------|
| id         | BIGINT   | PK, AUTO_INCREMENT    |
| session_id | BIGINT   | FK live_sessions(id)  |
| user_id    | BIGINT   | FK users(id)          |
| attended_at| DATETIME |                       |

#### notifications
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| user_id    | BIGINT       | FK users(id)          |
| type       | ENUM         | ('email','in_app')    |
| message    | TEXT         |                       |
| status     | ENUM         | ('pending','sent','failed') |
| sent_at    | DATETIME     |                       |

#### moderation_logs
| Field        | Type         | Constraints           |
|--------------|--------------|-----------------------|
| id           | BIGINT       | PK, AUTO_INCREMENT    |
| entity_type  | VARCHAR(64)  |                       |
| entity_id    | BIGINT       |                       |
| action       | VARCHAR(64)  |                       |
| admin_id     | BIGINT       | FK users(id)          |
| timestamp    | DATETIME     |                       |
| notes        | TEXT         |                       |

#### discussions
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| course_id  | BIGINT       | FK courses(id)        |
| user_id    | BIGINT       | FK users(id)          |
| question   | TEXT         |                       |
| created_at | DATETIME     |                       |

#### discussion_replies
| Field         | Type     | Constraints           |
|---------------|----------|-----------------------|
| id            | BIGINT   | PK, AUTO_INCREMENT    |
| discussion_id | BIGINT   | FK discussions(id)    |
| user_id       | BIGINT   | FK users(id)          |
| reply         | TEXT     |                       |
| created_at    | DATETIME |                       |

#### feedback
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| course_id  | BIGINT       | FK courses(id)        |
| user_id    | BIGINT       | FK users(id)          |
| rating     | INT          | (1-5)                 |
| comment    | TEXT         |                       |
| created_at | DATETIME     |                       |

---

## 4. Caching Strategy

- **Redis**: Used for session storage, frequently accessed data (user profiles, course metadata), and rate limiting.
- **CDN**: All static content (videos, PDFs, images, certificates) served via a CDN (e.g., CloudFront, Akamai).
- **Query Result Caching**: Frequently accessed queries (e.g., course catalog, leaderboard) cached in Redis with TTL.
- **API Gateway Caching**: Cache GET requests at the gateway for public endpoints.
- **Cache Invalidation**: On content/course update, invalidate relevant cache keys.

---

## 5. Microservice Implementation Plans

### 5.1 User Service

**Responsibilities:**
- User registration, authentication (JWT), and profile management
- Role-based access control (Super Admin, Admin, Teacher, Student)
- Password reset and account recovery

**Endpoints:**
- POST /users/register
- POST /users/login
- GET /users/:id
- PUT /users/:id
- POST /users/reset-password

**Database Tables:**
- users (id, name, email, password_hash, role, status, created_at, updated_at)
- user_profiles (user_id, bio, avatar_url, ...)

---

### 5.2 Course Service

**Responsibilities:**
- Course creation, editing, publishing, and organization into modules/sections
- Course approval workflow

**Endpoints:**
- POST /courses
- PUT /courses/:id
- GET /courses/:id
- GET /courses
- POST /courses/:id/submit-for-approval
- POST /courses/:id/approve

**Database Tables:**
- courses (id, title, description, status, teacher_id, created_at, updated_at)
- course_modules (id, course_id, title, order)
- course_sections (id, module_id, title, order)

---

### 5.3 Content Service

**Responsibilities:**
- Manage course content: videos, PDFs, interactive modules

**Endpoints:**
- POST /content/upload (video/pdf)
- GET /content/:id
- DELETE /content/:id

**Database Tables:**
- contents (id, course_id, module_id, type, url, metadata, order, created_at)
- content_metadata (content_id, key, value)

**Storage:**
- Videos/PDFs stored in cloud storage (e.g., AWS S3), URLs saved in DB

---

### 5.4 Quiz Service

**Responsibilities:**
- Create/manage quizzes (MCQ, short answer, true/false)
- Store quiz attempts and results

**Endpoints:**
- POST /quizzes
- GET /quizzes/:id
- POST /quizzes/:id/attempt
- GET /quizzes/:id/results

**Database Tables:**
- quizzes (id, course_id, module_id, title, type)
- quiz_questions (id, quiz_id, question_text, type, options, answer)
- quiz_attempts (id, quiz_id, user_id, score, started_at, completed_at)
- quiz_answers (id, attempt_id, question_id, answer, is_correct)

---

### 5.5 Enrollment Service

**Responsibilities:**
- Manage course enrollments (free/paid)
- Track student progress and completion

**Endpoints:**
- POST /enrollments
- GET /enrollments/:user_id
- PATCH /enrollments/:id/progress

**Database Tables:**
- enrollments (id, user_id, course_id, status, enrolled_at, completed_at)
- progress (id, enrollment_id, module_id, section_id, status, updated_at)

---

### 5.6 Certificate Service

**Responsibilities:**
- Generate and issue certificates upon course completion

**Endpoints:**
- POST /certificates/generate
- GET /certificates/:user_id/:course_id

**Database Tables:**
- certificates (id, user_id, course_id, url, issued_at)

**Storage:**
- Certificates generated as PDFs, stored in cloud storage

---

### 5.7 Live Session Service

**Responsibilities:**
- Schedule and manage live sessions (Zoom integration)
- Store session metadata and attendance

**Endpoints:**
- POST /live-sessions/schedule
- GET /live-sessions/:course_id
- POST /live-sessions/:id/attendance

**Database Tables:**
- live_sessions (id, course_id, teacher_id, zoom_link, scheduled_at, duration)
- live_session_attendance (id, session_id, user_id, attended_at)

---

### 5.8 Notification Service

**Responsibilities:**
- Send announcements, reminders, and notifications (email, in-app)
- Automated reminders for deadlines, live sessions, etc.

**Endpoints:**
- POST /notifications/send
- GET /notifications/:user_id

**Database Tables:**
- notifications (id, user_id, type, message, status, sent_at)

---

### 5.9 Analytics & Reporting Service

**Responsibilities:**
- Aggregate and report on course performance, user activity, completion rates

**Endpoints:**
- GET /analytics/dashboard
- GET /analytics/course/:id
- GET /analytics/user/:id

**Database Tables:**
- analytics_events (id, user_id, event_type, entity_id, timestamp)
- reports (id, type, params, generated_at, url)

---

### 5.10 Admin/Moderation Service

**Responsibilities:**
- Approve/reject courses and content
- Moderate user-generated content

**Endpoints:**
- POST /moderation/courses/:id/approve
- POST /moderation/courses/:id/reject
- POST /moderation/content/:id/approve

**Database Tables:**
- moderation_logs (id, entity_type, entity_id, action, admin_id, timestamp, notes)

---

### 5.11 Discussion/Q&A Service

**Responsibilities:**
- Manage course Q&A, discussion forums, and feedback

**Endpoints:**
- POST /discussions
- GET /discussions/:course_id
- POST /discussions/:id/reply
- POST /feedback

**Database Tables:**
- discussions (id, course_id, user_id, question, created_at)
- discussion_replies (id, discussion_id, user_id, reply, created_at)
- feedback (id, course_id, user_id, rating, comment, created_at)

---

## 6. Testing Strategy

- **Unit Testing**: Each microservice has >90% unit test coverage (Jest, Mocha, etc.).
- **Integration Testing**: Test service-to-service interactions and DB integration (Supertest, Postman/Newman).
- **End-to-End (E2E) Testing**: Automated UI tests (Cypress, Selenium) for critical user flows.
- **Load/Performance Testing**: Simulate high concurrency (k6, JMeter) to ensure scalability.
- **Security Testing**: Automated vulnerability scanning (OWASP ZAP, Snyk), penetration testing.
- **Continuous Integration (CI)**: All tests run on every PR/merge (GitHub Actions, GitLab CI).
- **Continuous Deployment (CD)**: Deploy to staging on merge, production on approval.

---

## 7. Security & Compliance

- JWT-based authentication and role-based authorization.
- HTTPS for all endpoints.
- Input validation and sanitization.
- Audit logging for sensitive actions.
- GDPR-compliant data handling.
- Encryption at rest (MySQL TDE) and in transit (TLS).
- Secrets managed via vault (e.g., HashiCorp Vault).

---

## 8. Scalability & Deployment

- **Microservices**: Each service is stateless, horizontally scalable (Docker, Kubernetes).
- **API Gateway**: Centralized routing, authentication, rate limiting, and caching.
- **Load Balancers**: Distribute traffic across service instances.
- **Service Discovery**: Dynamic registration and discovery (Consul, etcd).
- **Centralized Logging/Monitoring**: ELK stack, Prometheus, Grafana.
- **Auto-scaling**: Based on CPU/memory/queue depth.
- **Blue/Green Deployments**: Zero-downtime releases.

---

## 9. Observability

- **Logging**: Structured logs, correlation IDs for tracing requests across services.
- **Monitoring**: Metrics for latency, error rates, throughput.
- **Alerting**: Automated alerts for anomalies, downtime, or threshold breaches.
- **Tracing**: Distributed tracing (Jaeger, Zipkin) for debugging and performance analysis.

---

## 10. Third-Party Integrations

- Zoom API for live sessions.
- Email/SMS providers for notifications.
- Cloud storage for media and certificates.
- Payment gateway (Stripe, PayPal) for paid enrollments.

---

## 11. Disaster Recovery & Backups

- Automated daily backups of MySQL databases.
- Point-in-time recovery enabled.
- Multi-region replication for critical data.
- Regular restore drills.

---

## 12. Summary

This architecture ensures modularity, scalability, and maintainability. Each feature is mapped to a dedicated microservice, with clear, normalized database design, robust caching, comprehensive testing, and best practices for security, observability, and disaster recovery. The platform is designed to scale horizontally and support high availability for global users.
