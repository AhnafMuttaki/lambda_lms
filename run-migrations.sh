#!/bin/bash
set -e

# Load .env variables
export $(grep -v '^#' .env | xargs)

MYSQL_CONTAINER="lms-mysql"
MIGRATIONS=(
  "user-service/migrations/001_create_users_and_profiles.sql"
  "course-service/migrations/001_create_courses_and_modules.sql"
  "content-service/migrations/001_create_contents.sql"
  "quiz-service/migrations/001_create_quizzes.sql"
  "enrollment-service/migrations/001_create_enrollments.sql"
  "certificate-service/migrations/001_create_certificates.sql"
  "live-session-service/migrations/001_create_live_sessions.sql"
  "notification-service/migrations/001_create_notifications.sql"
  "analytics-service/migrations/001_create_analytics.sql"
  "admin-service/migrations/001_create_moderation_logs.sql"
  "discussion-service/migrations/001_create_discussions.sql"
)

echo "Waiting for MySQL to be ready..."
until docker exec $MYSQL_CONTAINER mysqladmin ping -h"localhost" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; do
  sleep 2
done

for migration in "${MIGRATIONS[@]}"; do
  echo "Running migration: $migration"
  docker exec -i $MYSQL_CONTAINER mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$migration"
done

echo "All migrations executed successfully."
