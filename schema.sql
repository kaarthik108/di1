CREATE TABLE v_yc (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId TEXT,
  path TEXT NOT NULL,
  messages TEXT NOT NULL,
  sharePath TEXT
);

CREATE INDEX IF NOT EXISTS idx_chats_id ON chats (id);

CREATE INDEX IF NOT EXISTS idx_v_yc_id ON v_yc (id);


// comands to migrate 

-- sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/6ac960e806d5e9071ffd9a504cc6e30ab00e5695fdb635c2a1b38ee55068761b.sqlite .dump > db.sql

-- wrangler d1 execute yc --remote --file=db.sql