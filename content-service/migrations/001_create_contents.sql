CREATE TABLE IF NOT EXISTS contents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  module_id BIGINT,
  section_id BIGINT,
  type ENUM('video','pdf','interactive') NOT NULL,
  url VARCHAR(512) NOT NULL,
  metadata JSON,
  `order` INT DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_metadata (
  content_id BIGINT NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  value TEXT,
  PRIMARY KEY (content_id, `key`),
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);
