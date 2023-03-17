CREATE DATABASE mercado;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(35) NOT NULL,
  password VARCHAR(35) NOT NULL
);

INSERT INTO users (
  name,
  email,
  password
  )
VALUES
  ('svet','svet@gmail.com','123'),
  ('testuser','test@gmail.com','123')
;


CREATE TABLE publications (
 publication_id SERIAL PRIMARY KEY, 
 seller_id INT NOT NULL REFERENCES users (user_id),
 publication_name VARCHAR(35) NOT NULL,
 photo TEXT,
 description VARCHAR(280),
 stock_initial INT,
 stock_available INT,
 price INT NOT NULL
);


CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  buyer_id INT NOT NULL REFERENCES users (user_id),
  seller_id INT NOT NULL REFERENCES users (user_id),
  publication_id INT REFERENCES publications (publication_id),
  price INT NOT NULL,
  amount INT NOT NULL,
  total_price INT NOT NULL,
  reserve_date DATE NOT NULL
);

