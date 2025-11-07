-- infra/db.sql
-- Create a table to store users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
