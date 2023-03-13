const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
var bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var app = express();

// default options

const cors = require("cors");

const port = 5000; //backend routing port

app.use(
  cors({
    origin: "*",
  })
);
app.use("/public/images", express.static(__dirname + "/public/images"));

app.use(fileUpload());
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

app.get("/publicaciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const getItem = {
      text: "select * from publicaciones where publicacionid =$1",
      values: [id],
    };
    const result = await client.query(getItem);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
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
      acciones: "acciones",
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

app.post("/new-item", async (req, res) => {
  const {
    vendedorid,
    producto,
    descripcion,
    stockinicial,
    stockdisponible,
    precio,
  } = req.body;

  const file = req.files.foto;

  const img_name = file.name;
  file.mv("public/images/" + file.name, function (err) {
    if (err) return res.status(500).send(err);
  });
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT into publicaciones (vendedorid, producto, foto,descripcion,stockinicial,stockdisponible,precio) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING publicacionid",
      [
        vendedorid,
        producto,
        img_name,
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

app.post("/new-reserve", async (req, res) => {
  const {
    compradorid,
    vendedorid,
    publicacionid,
    cantidad,
    valorTotal,
    fechaReserva,
  } = req.body;

  const file = req.files.foto;

  const img_name = file.name;
  file.mv("public/images/" + file.name, function (err) {
    if (err) return res.status(500).send(err);
  });
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT into publicaciones (vendedorid, producto, foto,descripcion,stockinicial,stockdisponible,precio) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING publicacionid",
      [
        vendedorid,
        producto,
        img_name,
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

app.post("/new-user", async (req, res) => {
  const { email, nombre, password } = req.body;
  console.log(email, nombre, password);
  try {
    const checkMSG = await checkEmail(email);
    if (checkMSG === "ok") {
      const client = await pool.connect();
      const result = await client.query(
        "INSERT into usuarios (email, nombre, password) VALUES($1, $2, $3)",
        [email, nombre, password]
      );
      res.send(result.rows);
      client.release(true);
    } else {
      res.status(401).send([]);
    }
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

app.delete("/delete-publicacion/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const client = await pool.connect();
    const deleteUser = {
      text: "delete from publicaciones where publicacionid =$1",
      values: [id],
    };
    const result = await client.query(deleteUser);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.put("/update-publicacion/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { producto, descripcion, stockinicial, precio } = req.body;
  try {
    const client = await pool.connect();
    const updateItem = {
      text: "UPDATE publicaciones SET producto = $2, descripcion = $3, stockinicial = $4, precio = $5 where publicacionid =$1",
      values: [id, producto, descripcion, stockinicial, precio],
    };
    const result = await client.query(updateItem);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

function verifyToken(req, res, next) {
  console.log("verifyToken");
  const token = req.headers["authtoken"];
  if (token == null) return res.sendStatus(403);
  console.log("token", token);
  jwt.verify(token, "my_token", (err, user) => {
    if (err) return res.sendStatus(404);
    req.user = user;
    console.log("GOOD");
    next();
  });
}
async function checkEmail(email) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    const checkEmail = {
      text: "select 1 from usuarios where email = $1",
      values: [email],
    };
    client
      .query(checkEmail)
      .then((res) => {
        if (res.rowCount > 0) {
          resolve("email ya existe");
        } else {
          resolve("ok");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        client.release();
      });
  });
}

app.listen(port, () => {
  console.log("server start", port);
});
