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

#### certificates
| Field      | Type         | Constraints           |
|------------|--------------|-----------------------|
| id         | BIGINT       | PK, AUTO_INCREMENT    |
| user_id    | BIGINT       | FK users(id)          |
| course_id  | BIGINT       | FK courses(id)        |
| url        | VARCHAR(512) | NOT NULL              |
| issued_at  | DATETIME     |                       |

The above service has below user journey

- the user can view certificate
- the teacher can add edit certificate templates for a course


The certficate template data structure is not mentioned above but it can have logo, text, background image, signature and dates.

Based on above mentioned informations design list of needed screens for certificate