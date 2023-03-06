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

INSERT INTO publicaciones (
vendedorID, 
producto,
foto,
descripcion,
stockInicial,
stockDisponible,
precio)
VALUES
  (1,'jabon',NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 100, 90, 2000), 
  (1,'lavaloza',NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 50, 50, 5000), 
  (1,'detergente',NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 100, 90, 6000);
  


CREATE TABLE reservas (
  reservaID SERIAL PRIMARY KEY,
  compradorID INT NOT NULL REFERENCES usuarios (userID),
  vendedorID INT NOT NULL REFERENCES usuarios (userID),
  publicacionID INT REFERENCES publicaciones (publicacionID),
  cantidad INT NOT NULL,
  valorTotal INT NOT NULL,
  fechaReserva DATE NOT NULL
);

INSERT INTO reservas (
  compradorID,
  vendedorID,
  publicacionID,
  cantidad,
  valorTotal,
  fechaReserva
  )
VALUES
  (2, 1, 1, 3, 18000, '2023-05-01');