const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { Pool } = require("pg");
var bodyParser = require("body-parser");

const cors = require("cors");

const port = 5000; //backend routing port

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const config = {
  user: "postgres",
  host: "localhost",
  database: "mercado",
  password: "180483",
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  sslmode: require,
};
const pool = new Pool(config);

app.get("/publicaciones", async (req, res) => {
  const client = await pool.connect();
  const getUsers = {
    text: "select * from publicaciones",
    values: [],
  };
  const result = await client.query(getUsers);

  let ojb = {
    data: result.rows,
    table_headers: {
      photo: "Foto",
      name: "Nombre",
      experience: "Anos de experiencia",
      specialty: "Especialidad",
      is_confirmed: "Estado",
    },
  };

  res.send(ojb);

  client.release(true);
});

app.post("/user-publicaciones", verifyToken, async (req, res) => {
  const { id } = req.body;
  const client = await pool.connect();
  const getUsers = {
    text: "select * from publicaciones where vendedorid =$1",
    values: [id],
  };
  const result = await client.query(getUsers);

  let ojb = {
    data: result.rows,
    table_headers: {
      vendedorID: "vendedorID",
      producto: "producto",
      foto: "foto",
      stockInicial: "stockInicial",
      stockDisponible: "stockDisponible",
      precio: "precio",
      editar: "editar",
    },
  };

  res.send(ojb);

  client.release(true);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const checkUser = {
      text: "select * from usuarios where email =$1 and password =$2",
      values: [email, password],
    };
    const result = await client.query(checkUser);
    if (result.rows.length == 0) {
      res.status(401).send("el usuario no autorizado");
    } else {
      const token = jwt.sign({ user: result.id }, "my_token", {
        expiresIn: 1200,
      });
      res.status(200).send({ token, user: result.rows[0] });
    }
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.post("/new-item", verifyToken, async (req, res) => {
  const {
    vendedorid,
    producto,
    foto,
    descripcion,
    stockinicial,
    stockdisponible,
    precio,
  } = req.body;

  console.log(
    vendedorid,
    producto,
    foto,
    descripcion,
    stockinicial,
    stockdisponible,
    precio
  );
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT into publicaciones (vendedorid, producto, foto,descripcion,stockinicial,stockdisponible,precio) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING publicacionid",
      [
        vendedorid,
        producto,
        foto,
        descripcion,
        stockinicial,
        stockdisponible,
        precio,
      ]
    );
    res.send(result.rows);
    client.release(true);
  } catch (error) {
    console.log(error);
  }
});

app.put("/logout", verifyToken, function (req, res) {
  const token = req.headers["authtoken"];
  jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "Has sido desconectado" });
    } else {
      res.send({ msg: "Error" });
    }
  });
});

function verifyToken(req, res, next) {
  console.log("verifyToken");
  const token = req.headers["authtoken"];
  if (token == null) return res.sendStatus(403);
  console.log("token", token);
  jwt.verify(token, "my_token", (err, user) => {
    if (err) return res.sendStatus(404);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log("server start", port);
});
