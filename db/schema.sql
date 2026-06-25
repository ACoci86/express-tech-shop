-- Express Tech Shop: database schema
-- Run against your Neon Postgres database:
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  image_url   TEXT,
  category    VARCHAR(255),
  stock       INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total      NUMERIC(10, 2) NOT NULL,
  status     VARCHAR(50) DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL,
  price      NUMERIC(10, 2) NOT NULL
);
