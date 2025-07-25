# LMS Project Detailed Task List

---

## Backend Task List (Each Microservice = Separate Express App)

---

### 1. User Service

#### 1.1 User Registration

- **Title:** User Registration API
- **Description:** Implement POST `/users/register` for new user sign-up.
- **API Params:** `{ name, email, password, role }`
- **Validation:** 
  - `name`: required, string, max 255
  - `email`: required, valid email, unique
  - `password`: required, min 8 chars, strong
  - `role`: enum (student, teacher, admin, super_admin)
- **Acceptance Criteria:** 
  - User is created with hashed password.
  - Duplicate email returns error.
  - Returns JWT on success.
- **Test Cases:** 
  - Register with valid/invalid data.
  - Duplicate email.
  - Password strength.
  - JWT returned.

#### 1.2 User Login

- **Title:** User Login API
- **Description:** Implement POST `/users/login` for authentication.
- **API Params:** `{ email, password }`
- **Validation:** 
  - `email`: required, valid
  - `password`: required
- **Acceptance Criteria:** 
  - Valid credentials return JWT.
  - Invalid credentials return error.
- **Test Cases:** 
  - Valid/invalid login.
  - JWT structure.

#### 1.3 Get User Profile

- **Title:** Get User Profile API
- **Description:** Implement GET `/users/:id` to fetch user profile.
- **API Params:** `id` (path)
- **Validation:** 
  - `id`: must exist, numeric
- **Acceptance Criteria:** 
  - Returns user profile if authorized.
  - 403 if unauthorized.
- **Test Cases:** 
  - Valid/invalid id.
  - Unauthorized access.

#### 1.4 Update User Profile

- **Title:** Update User Profile API
- **Description:** Implement PUT `/users/:id` for profile update.
- **API Params:** `{ name, bio, avatar_url }`
- **Validation:** 
  - `name`: optional, string
  - `bio`: optional, string
  - `avatar_url`: optional, valid URL
- **Acceptance Criteria:** 
  - Only owner or admin can update.
  - Data is persisted.
- **Test Cases:** 
  - Valid/invalid update.
  - Unauthorized update.

#### 1.5 Password Reset

- **Title:** Password Reset API
- **Description:** Implement POST `/users/reset-password` for password reset flow.
- **API Params:** `{ email }` (request), `{ token, new_password }` (reset)
- **Validation:** 
  - `email`: required, valid
  - `new_password`: required, strong
- **Acceptance Criteria:** 
  - Email sent with token.
  - Token resets password.
- **Test Cases:** 
  - Valid/invalid email.
  - Token expiry.
  - Password update.

#### 1.6 Role Assignment

- **Title:** Assign/Change User Role API
- **Description:** Implement PATCH `/users/:id/role` for admin role assignment.
- **API Params:** `{ role }`
- **Validation:** 
  - `role`: enum, required
- **Acceptance Criteria:** 
  - Only admin/super_admin can assign.
  - Role updated.
- **Test Cases:** 
  - Unauthorized role change.
  - Valid/invalid role.

---

### 2. Course Service

#### 2.1 Create Course

- **Title:** Create Course API
- **Description:** POST `/courses` for teachers to create a course.
- **API Params:** `{ title, description }`
- **Validation:** 
  - `title`: required, string
  - `description`: optional
- **Acceptance Criteria:** 
  - Course created in draft state.
- **Test Cases:** 
  - Valid/invalid data.
  - Unauthorized user.

#### 2.2 Edit Course

- **Title:** Edit Course API
- **Description:** PUT `/courses/:id` for teachers to edit.
- **API Params:** `{ title, description }`
- **Validation:** 
  - Only owner can edit.
- **Acceptance Criteria:** 
  - Changes persisted.
- **Test Cases:** 
  - Valid/invalid edit.
  - Unauthorized edit.

#### 2.3 Delete Course

- **Title:** Delete Course API
- **Description:** DELETE `/courses/:id` for teachers.
- **API Params:** `id`
- **Validation:** 
  - Only owner can delete.
- **Acceptance Criteria:** 
  - Course removed.
- **Test Cases:** 
  - Valid/invalid delete.
  - Unauthorized delete.

#### 2.4 List Courses

- **Title:** List Courses API
- **Description:** GET `/courses` for all users.
- **API Params:** Query: `{ status, teacher_id, search }`
- **Acceptance Criteria:** 
  - Returns filtered list.
- **Test Cases:** 
  - Filtering, pagination.

#### 2.5 Submit Course for Approval

- **Title:** Submit Course for Approval API
- **Description:** POST `/courses/:id/submit-for-approval`
- **Validation:** 
  - Only owner can submit.
- **Acceptance Criteria:** 
  - Status set to pending.
- **Test Cases:** 
  - Valid/invalid submit.

#### 2.6 Approve/Reject Course

- **Title:** Approve/Reject Course API
- **Description:** POST `/courses/:id/approve` or `/reject`
- **Validation:** 
  - Only admin can approve/reject.
- **Acceptance Criteria:** 
  - Status updated.
- **Test Cases:** 
  - Valid/invalid action.

#### 2.7 Module/Section Management

- **Title:** Module/Section CRUD APIs
- **Description:** CRUD for modules/sections under courses.
- **API Params:** `{ title, order }`
- **Acceptance Criteria:** 
  - Modules/sections can be created, edited, deleted.
- **Test Cases:** 
  - CRUD operations.

---

### 3. Content Service

#### 3.1 Upload Content

- **Title:** Upload Content API
- **Description:** POST `/content/upload` for videos, PDFs, interactive.
- **API Params:** `multipart/form-data` `{ file, type, course_id, module_id, section_id }`
- **Validation:** 
  - File type/size, ownership.
- **Acceptance Criteria:** 
  - File uploaded to S3, metadata in DB.
- **Test Cases:** 
  - Valid/invalid upload.
  - Unauthorized upload.

#### 3.2 Get Content

- **Title:** Get Content API
- **Description:** GET `/content/:id`
- **Acceptance Criteria:** 
  - Returns content metadata and signed URL.
- **Test Cases:** 
  - Valid/invalid id.

#### 3.3 Delete Content

- **Title:** Delete Content API
- **Description:** DELETE `/content/:id`
- **Validation:** 
  - Only owner/admin.
- **Acceptance Criteria:** 
  - File deleted from S3 and DB.
- **Test Cases:** 
  - Valid/invalid delete.

---

### 4. Quiz Service

#### 4.1 Create Quiz

- **Title:** Create Quiz API
- **Description:** POST `/quizzes`
- **API Params:** `{ course_id, module_id, title, type }`
- **Validation:** 
  - Only teacher/owner.
- **Acceptance Criteria:** 
  - Quiz created.
- **Test Cases:** 
  - Valid/invalid create.

#### 4.2 Add Question

- **Title:** Add Quiz Question API
- **Description:** POST `/quizzes/:id/questions`
- **API Params:** `{ question_text, type, options, answer }`
- **Validation:** 
  - Valid question format.
- **Acceptance Criteria:** 
  - Question added.
- **Test Cases:** 
  - Valid/invalid question.

#### 4.3 Attempt Quiz

- **Title:** Attempt Quiz API
- **Description:** POST `/quizzes/:id/attempt`
- **API Params:** `{ answers: [{ question_id, answer }] }`
- **Validation:** 
  - Enrollment required.
- **Acceptance Criteria:** 
  - Attempt stored, graded.
- **Test Cases:** 
  - Valid/invalid attempt.

#### 4.4 Get Quiz Results

- **Title:** Get Quiz Results API
- **Description:** GET `/quizzes/:id/results`
- **Acceptance Criteria:** 
  - Returns results for user.
- **Test Cases:** 
  - Valid/invalid id.

---

### 5. Enrollment Service

#### 5.1 Enroll in Course

- **Title:** Enroll in Course API
- **Description:** POST `/enrollments`
- **API Params:** `{ course_id }`
- **Validation:** 
  - Course must be published.
- **Acceptance Criteria:** 
  - Enrollment created.
- **Test Cases:** 
  - Valid/invalid enrollment.

#### 5.2 Get Enrollments

- **Title:** Get User Enrollments API
- **Description:** GET `/enrollments/:user_id`
- **Acceptance Criteria:** 
  - Returns all enrollments for user.
- **Test Cases:** 
  - Valid/invalid user.

#### 5.3 Update Progress

- **Title:** Update Progress API
- **Description:** PATCH `/enrollments/:id/progress`
- **API Params:** `{ module_id, section_id, status }`
- **Acceptance Criteria:** 
  - Progress updated.
- **Test Cases:** 
  - Valid/invalid update.

---

### 6. Certificate Service

#### 6.1 Generate Certificate

- **Title:** Generate Certificate API
- **Description:** POST `/certificates/generate`
- **API Params:** `{ user_id, course_id }`
- **Validation:** 
  - Completion required.
- **Acceptance Criteria:** 
  - PDF generated, stored, URL returned.
- **Test Cases:** 
  - Valid/invalid generation.

#### 6.2 Get Certificate

- **Title:** Get Certificate API
- **Description:** GET `/certificates/:user_id/:course_id`
- **Acceptance Criteria:** 
  - Returns certificate URL.
- **Test Cases:** 
  - Valid/invalid request.

---

### 7. Live Session Service

#### 7.1 Schedule Live Session

- **Title:** Schedule Live Session API
- **Description:** POST `/live-sessions/schedule`
- **API Params:** `{ course_id, scheduled_at, duration }`
- **Validation:** 
  - Only teacher/owner.
- **Acceptance Criteria:** 
  - Session scheduled, Zoom link generated.
- **Test Cases:** 
  - Valid/invalid schedule.

#### 7.2 Join Live Session

- **Title:** Join Live Session API
- **Description:** GET `/live-sessions/:id/join`
- **Acceptance Criteria:** 
  - Returns Zoom link if enrolled.
- **Test Cases:** 
  - Valid/invalid join.

#### 7.3 Track Attendance

- **Title:** Track Attendance API
- **Description:** POST `/live-sessions/:id/attendance`
- **API Params:** `{ user_id }`
- **Acceptance Criteria:** 
  - Attendance recorded.
- **Test Cases:** 
  - Valid/invalid attendance.

---

### 8. Notification Service

#### 8.1 Send Notification

- **Title:** Send Notification API
- **Description:** POST `/notifications/send`
- **API Params:** `{ user_id, type, message }`
- **Validation:** 
  - Valid user/type.
- **Acceptance Criteria:** 
  - Notification sent (email/in-app).
- **Test Cases:** 
  - Valid/invalid send.

#### 8.2 Get Notifications

- **Title:** Get Notifications API
- **Description:** GET `/notifications/:user_id`
- **Acceptance Criteria:** 
  - Returns notifications for user.
- **Test Cases:** 
  - Valid/invalid user.

---

### 9. Analytics & Reporting Service

#### 9.1 Get Dashboard Data

- **Title:** Get Analytics Dashboard API
- **Description:** GET `/analytics/dashboard`
- **Acceptance Criteria:** 
  - Returns metrics for user role.
- **Test Cases:** 
  - Valid/invalid role.

#### 9.2 Export Report

- **Title:** Export Analytics Report API
- **Description:** GET `/analytics/report?type=...`
- **Acceptance Criteria:** 
  - Returns downloadable report.
- **Test Cases:** 
  - Valid/invalid export.

---

### 10. Admin/Moderation Service

#### 10.1 Approve/Reject Course/Content

- **Title:** Approve/Reject API
- **Description:** POST `/moderation/courses/:id/approve` or `/reject`
- **Acceptance Criteria:** 
  - Status updated, log created.
- **Test Cases:** 
  - Valid/invalid moderation.

#### 10.2 View Moderation Logs

- **Title:** Get Moderation Logs API
- **Description:** GET `/moderation/logs`
- **Acceptance Criteria:** 
  - Returns logs for admin.
- **Test Cases:** 
  - Valid/invalid access.

---

### 11. Discussion/Q&A Service

#### 11.1 Post Question

- **Title:** Post Discussion Question API
- **Description:** POST `/discussions`
- **API Params:** `{ course_id, question }`
- **Acceptance Criteria:** 
  - Question posted.
- **Test Cases:** 
  - Valid/invalid post.

#### 11.2 Reply to Question

- **Title:** Post Discussion Reply API
- **Description:** POST `/discussions/:id/reply`
- **API Params:** `{ reply }`
- **Acceptance Criteria:** 
  - Reply posted.
- **Test Cases:** 
  - Valid/invalid reply.

#### 11.3 Post Feedback

- **Title:** Post Feedback API
- **Description:** POST `/feedback`
- **API Params:** `{ course_id, rating, comment }`
- **Acceptance Criteria:** 
  - Feedback stored.
- **Test Cases:** 
  - Valid/invalid feedback.

---

### 12. Database Migration Scripts

- **Title:** Write Migration Scripts
- **Description:** Write and test migration scripts for all tables and relations.
- **Acceptance Criteria:** 
  - All schemas created, idempotent, versioned.
- **Test Cases:** 
  - Migration up/down, data integrity.

---

### 13. Dockerization

- **Title:** Dockerize All Services
- **Description:** Dockerfile for each service, persistent MySQL, Docker Compose.
- **Acceptance Criteria:** 
  - All services run in Docker, data persists.
- **Test Cases:** 
  - Restart containers, data persists.

---

### 14. AWS Lambda Compatibility

- **Title:** Refactor for Lambda
- **Description:** Refactor Express apps for serverless deployment.
- **Acceptance Criteria:** 
  - Each app deploys as Lambda, config via env vars.
- **Test Cases:** 
  - Deploy/test in AWS Lambda.

---

### 15. Backend Testing

- **Title:** Write Unit/Integration Tests
- **Description:** Write tests for all endpoints and logic.
- **Acceptance Criteria:** 
  - >90% coverage, CI pipeline.
- **Test Cases:** 
  - All endpoints, edge cases.

---

## Frontend Task List (Single Vue App)

---

### 1. Authentication

- **Title:** Login/Register Page
- **Description:** UI for user login/registration.
- **Acceptance Criteria:** 
  - Users can register/login.
- **Test Cases:** 
  - Playwright: valid/invalid login/register.

---

### 2. Profile

- **Title:** Profile Page
- **Description:** UI for viewing/editing profile.
- **Acceptance Criteria:** 
  - Users can update profile.
- **Test Cases:** 
  - Playwright: edit/save profile.

---

### 3. Course Catalog

- **Title:** Course Catalog Page
- **Description:** Browse/search courses.
- **Acceptance Criteria:** 
  - Courses listed, filter/search works.
- **Test Cases:** 
  - Playwright: search/filter.

---

### 4. Course Details

- **Title:** Course Details Page
- **Description:** View course info, enroll, see modules/content.
- **Acceptance Criteria:** 
  - Course info, enroll button, content list.
- **Test Cases:** 
  - Playwright: enroll, view content.

---

### 5. Course Creation/Edit

- **Title:** Course Creation/Edit Page
- **Description:** UI for teachers to create/edit courses.
- **Acceptance Criteria:** 
  - Teachers can create/edit.
- **Test Cases:** 
  - Playwright: create/edit course.

---

### 6. Module/Section Management

- **Title:** Module/Section Management Page
- **Description:** Add/edit/delete modules/sections.
- **Acceptance Criteria:** 
  - CRUD works.
- **Test Cases:** 
  - Playwright: add/edit/delete.

---

### 7. Content Upload/Management

- **Title:** Content Upload/Management Page
- **Description:** Upload/manage videos, PDFs, interactive.
- **Acceptance Criteria:** 
  - Upload, preview, delete.
- **Test Cases:** 
  - Playwright: upload/delete.

---

### 8. Quiz Management

- **Title:** Quiz Creation/Management Page
- **Description:** Create quizzes, add questions.
- **Acceptance Criteria:** 
  - Teachers can create quizzes/questions.
- **Test Cases:** 
  - Playwright: create quiz.

---

### 9. Quiz Attempt

- **Title:** Quiz Attempt Page
- **Description:** Students attempt quizzes.
- **Acceptance Criteria:** 
  - Attempt, submit, see results.
- **Test Cases:** 
  - Playwright: attempt quiz.

---

### 10. Enrollment/Progress

- **Title:** Enrollment/Progress Page
- **Description:** Track course progress.
- **Acceptance Criteria:** 
  - Progress bars, completion status.
- **Test Cases:** 
  - Playwright: progress update.

---

### 11. Certificate

- **Title:** Certificate Page
- **Description:** View/download certificates.
- **Acceptance Criteria:** 
  - Downloadable PDF.
- **Test Cases:** 
  - Playwright: download.

---

### 12. Live Session

- **Title:** Live Session Scheduling/Join Page
- **Description:** Schedule/join live sessions.
- **Acceptance Criteria:** 
  - Schedule, join, attendance.
- **Test Cases:** 
  - Playwright: join session.

---

### 13. Notifications

- **Title:** Notifications Page
- **Description:** View announcements, reminders.
- **Acceptance Criteria:** 
  - List, mark as read.
- **Test Cases:** 
  - Playwright: mark as read.

---

### 14. Analytics/Dashboard

- **Title:** Analytics/Dashboard Page
- **Description:** View analytics, export reports.
- **Acceptance Criteria:** 
  - Dashboards, export.
- **Test Cases:** 
  - Playwright: export.

---

### 15. Admin/Moderation

- **Title:** Admin Approval/Moderation Page
- **Description:** Approve/reject, view logs.
- **Acceptance Criteria:** 
  - Approve/reject, logs.
- **Test Cases:** 
  - Playwright: approve/reject.

---

### 16. Discussion/Q&A

- **Title:** Discussion/Q&A Page
- **Description:** Post/reply to questions.
- **Acceptance Criteria:** 
  - Post/reply, feedback.
- **Test Cases:** 
  - Playwright: post/reply.

---

### 17. Error/404

- **Title:** Error/404 Page
- **Description:** Show error for invalid routes.
- **Acceptance Criteria:** 
  - User-friendly error.
- **Test Cases:** 
  - Playwright: invalid route.

---

### 18. Frontend Testing

- **Title:** Playwright E2E Tests
- **Description:** Write Playwright tests for all flows/pages.
- **Acceptance Criteria:** 
  - All flows tested, CI pipeline.
- **Test Cases:** 
  - All user journeys.

---

### 19. Dockerization

- **Title:** Dockerize Vue App
- **Description:** Dockerfile for Vue app, persistent config.
- **Acceptance Criteria:** 
  - Runs in Docker, persistent config.
- **Test Cases:** 
  - Restart, config persists.

---

**Note:**  
- All tasks must be completed, tested, dockerized, and ready for AWS Lambda/serverless deployment.
- Database migration scripts and persistent storage are mandatory.
- All test cases must be automated and run in CI/CD.
