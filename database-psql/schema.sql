-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  date VARCHAR,
  summary VARCHAR,
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness INTEGER DEFAULT 0
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  url VARCHAR
);

-- Create characteristics table
CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR
);

-- Create characteristic_reviews table
CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER
);

