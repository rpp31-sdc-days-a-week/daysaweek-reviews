-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER,
  summary VARCHAR(60),
  recommend BOOLEAN,
  response VARCHAR,
  body VARCHAR,
  date TIMESTAMP,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (id),
  url VARCHAR
);

-- Create characteristics table
CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR
);

-- Create review_characteristics table
CREATE TABLE IF NOT EXISTS review_characteristics (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (id),
  characteristics_id INTEGER REFERENCES characteristics (id),
  value INTEGER
);