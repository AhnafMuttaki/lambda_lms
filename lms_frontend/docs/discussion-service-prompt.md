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


Based on above mentioned backend service details list the needed UI screens first the create the ui screens.