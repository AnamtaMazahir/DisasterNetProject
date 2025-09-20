
CREATE TABLE disaster_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  disaster_type TEXT NOT NULL,
  category TEXT NOT NULL, -- 'natural' or 'man-made'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  confidence REAL NOT NULL, -- 0.0 to 1.0
  latitude REAL,
  longitude REAL,
  location_name TEXT,
  image_url TEXT,
  recommendation TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'overridden'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disaster_reports_category ON disaster_reports(category);
CREATE INDEX idx_disaster_reports_severity ON disaster_reports(severity);
CREATE INDEX idx_disaster_reports_created_at ON disaster_reports(created_at);
