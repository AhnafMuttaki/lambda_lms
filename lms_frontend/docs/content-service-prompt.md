The content service handles below mentioned user journey's

- Teacher can create content
- Teacher can edit content
- Teach can update/delete content
- Student can view content
- Content has video url.

Below is the the data structure of underlying content service

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


Based on above mentioned information create UI screens for content service.So design the UI components based on the above user journeys and data structures. Make sure you follow the same style and conventions that the other screens have.