### 5.10 Admin/Moderation Service

**Responsibilities:**
- Approve/reject courses and content
- Moderate user-generated content

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

In the above backend service handles admim moderation backend.

- Super Admin user can see list of courses/content
- Super Admin user can approve reject courses/content

Based on that generate UI screens 