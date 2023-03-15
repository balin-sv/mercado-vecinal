CREATE DATABASE mercado;

CREATE TABLE usuarios (
  userID SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(35) NOT NULL,
  password VARCHAR(35) NOT NULL
);

INSERT INTO usuarios (
  nombre,
  email,
  password
  )
VALUES
  ('svet','svet@gmail.com','123'),
  ('testuser','test@gmail.com','123')
;


CREATE TABLE publicaciones (
publicacionID SERIAL PRIMARY KEY, 
vendedorID INT NOT NULL REFERENCES usuarios (userID),
producto VARCHAR(35) NOT NULL,
foto TEXT,
descripcion VARCHAR(280),
stockInicial INT,
stockDisponible INT,
precio INT NOT NULL
);


CREATE TABLE reservas (
  reservaID SERIAL PRIMARY KEY,
  compradorID INT NOT NULL REFERENCES usuarios (userID),
  vendedorID INT NOT NULL REFERENCES usuarios (userID),
  publicacionID INT REFERENCES publicaciones (publicacionID),
  precio INT NOT NULL,
  cantidad INT NOT NULL,
  valorTotal INT NOT NULL,
  fechaReserva DATE NOT NULL
);

