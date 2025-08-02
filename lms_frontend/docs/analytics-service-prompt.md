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

Analytics Dashboard
- Overview of platform metrics: total users, courses, completion rates, recent activity.
- Visualizations: charts for trends, activity, completions.

Course Analytics
- Detailed analytics for a specific course.
- Metrics: enrollments, completion rate, user activity, module/section performance.
- Visualizations: progress charts, activity graphs.

User Analytics
- Analytics for a specific user.
- Metrics: courses enrolled, progress, completion history, activity timeline.
- Visualizations: user progress chart, event log.

Reports List
- List of generated reports.
- Download links, report type, parameters, generated date.

Design the abobe mentioned screens