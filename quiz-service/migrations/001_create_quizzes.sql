CREATE TABLE IF NOT EXISTS quizzes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  module_id BIGINT,
  title VARCHAR(255) NOT NULL,
  type ENUM('mcq','short','tf') NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (module_id) REFERENCES course_modules(id)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  quiz_id BIGINT NOT NULL,
  question_text TEXT NOT NULL,
  type ENUM('mcq','short','tf') NOT NULL,
  options JSON,
  answer TEXT,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  quiz_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  score FLOAT,
  started_at DATETIME,
  completed_at DATETIME,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  attempt_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer TEXT,
  is_correct BOOLEAN,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id),
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
); 