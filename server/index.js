const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
var bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var app = express();

const cors = require("cors");
const port = process.env.port || 5000; //backend routing port

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
  user: "svet",
  host: " postgres://svet:0hOcKU2DBcOccJnN5xl75aNMHgW6fKac@dpg-cgc7dnm4dad7acc07dog-a/mercado_74rj",
  database: "mercado_74rj",
  password: "0hOcKU2DBcOccJnN5xl75aNMHgW6fKac",
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  sslmode: require,
};
const pool = new Pool(config);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const client = await pool.connect();
  const getUsers = {
    text: "select * from users",
    values: [],
  };
  const result = await client.query(getUsers);
  res.send(result.rows);
  client.release(true);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const checkUser = {
      text: "select * from users where email =$1 and password =$2",
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

app.get("/publications", async (req, res) => {
  const client = await pool.connect();
  const getPublications = {
    text: "select publications.*, users.name from publications inner join users on publications.seller_id = users.user_id",
    values: [],
  };
  const result = await client.query(getPublications);
  res.send(result.rows);
  client.release(true);
});

app.get("/publication/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const getItem = {
      text: "select * from publications where publication_id =$1",
      values: [id],
    };
    const result = await client.query(getItem);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.post("/user-publications", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const client = await pool.connect();
    const getPublications = {
      text: "select * from publications where seller_id =$1",
      values: [id],
    };
    const result = await client.query(getPublications);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.post("/user-buy-orders", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const client = await pool.connect();
    const getOrders = {
      text: "SELECT users.name, publications.publication_name, publications.photo, reservations.price, reservations.amount, reservations.total_price, reservations.reserve_date FROM reservations JOIN users ON users.user_id = reservations.seller_id JOIN publications ON publications.publication_id = reservations.publication_id WHERE reservations.buyer_id = $1",
      values: [id],
    };
    const result = await client.query(getOrders);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.post("/user-sell-orders", verifyToken, async (req, res) => {
  const { id } = req.body;
  const client = await pool.connect();
  const getOrders = {
    text: "SELECT users.name, publications.publication_name, publications.photo, reservations.price, reservations.amount, reservations.total_price, reservations.reserve_date FROM reservations JOIN users ON users.user_id = reservations.buyer_id JOIN publications ON publications.publication_id = reservations.publication_id WHERE reservations.seller_id = $1",
    values: [id],
  };
  const result = await client.query(getOrders);
  res.send(result.rows);
  client.release(true);
});

app.post("/new-item", async (req, res) => {
  const {
    seller_id,
    publication_name,
    description,
    stock_initial,
    stock_available,
    price,
  } = req.body;

  const file = req.files.foto;

  const img_name = file.name;
  file.mv("public/images/" + file.name, function (err) {
    if (err) return res.status(500).send(err);
  });
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT into publications (seller_id, publication_name, photo, description, stock_initial, stock_available, price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING publication_id",
      [
        seller_id,
        publication_name,
        img_name,
        description,
        stock_initial,
        stock_available,
        price,
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
    buyer_id,
    seller_id,
    publication_id,
    price,
    amount,
    total_price,
    reserve_date,
  } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT into reservations (buyer_id, seller_id, publication_id, price, amount, total_price, reserve_date) VALUES($1, $2, $3, $4, $5, $6 ,$7) RETURNING reservation_id",
      [
        buyer_id,
        seller_id,
        publication_id,
        price,
        amount,
        total_price,
        reserve_date,
      ]
    );
    res.send(result.rows);
    client.release(true);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/new-user", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const checkMSG = await checkEmail(email);
    if (checkMSG === "ok") {
      const client = await pool.connect();
      const result = await client.query(
        "INSERT into users (email, name, password) VALUES($1, $2, $3)",
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

app.delete("/delete-publication/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const deleteUser = {
      text: "delete from publications where publication_id =$1",
      values: [id],
    };
    const result = await client.query(deleteUser);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.put("/update-publication/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const {
    publication_name,
    description,
    stock_initial,
    price,
    stock_available,
  } = req.body;
  try {
    const client = await pool.connect();
    const updateItem = {
      text: "UPDATE publications SET publication_name = $2, description = $3, stock_initial = $4, price = $5, stock_available = $6 where publication_id =$1",
      values: [
        id,
        publication_name,
        description,
        stock_initial,
        price,
        stock_available,
      ],
    };
    const result = await client.query(updateItem);
    res.send(result.rows);
    client.release(true);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

function verifyToken(req, res, next) {
  const token = req.headers["authtoken"];
  if (token == null) return res.sendStatus(403);
  jwt.verify(token, "my_token", (err, user) => {
    if (err) return res.sendStatus(404);
    req.user = user;
    next();
  });
}
async function checkEmail(email) {
  return new Promise(async (resolve, reject) => {
    const client = await pool.connect();
    const checkEmail = {
      text: "select 1 from users where email = $1",
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
