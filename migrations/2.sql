
CREATE TABLE sos_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  location_description TEXT,
  people_count INTEGER NOT NULL DEFAULT 1,
  medical_conditions TEXT,
  situation_description TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  image_url TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  estimated_response_time TEXT,
  assigned_responder TEXT,
  ai_assessment TEXT,
  recommended_action TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sos_requests_priority ON sos_requests(priority);
CREATE INDEX idx_sos_requests_status ON sos_requests(status);
CREATE INDEX idx_sos_requests_created_at ON sos_requests(created_at);
