CREATE TABLE IF NOT EXISTS cars (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  kms INTEGER NOT NULL,
  color TEXT NOT NULL,
  ac INTEGER NOT NULL,
  passengers INTEGER NOT NULL,
  transmission INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
  updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
);