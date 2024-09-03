const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const db = new sqlite3.Database("usersdb");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome !");
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users");
    } else {
      res.json(rows);
    }
  });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving user");
    } else {
      res.json(rows);
    }
  });
});

app.post("/users", (req, res) => {
  const { name, email, address, age, country } = req.body;

  if (name == null) {
    return res.status(400).send("Name is required!");
  }

  const sql = `INSERT INTO users (name, email, address, age, country) VALUES (?, ?, ?, ?, ?);`;
  db.run(sql, [name, email, address, age, country], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting data");
    } else {
      res.json({ message: "User inserted successfully", data: req.body });
    }
  });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, address, age, country } = req.body;
  const sql = `UPDATE users SET name = ?, email = ?, address = ?, age = ?, country = ? WHERE id = ?`;

  db.run(sql, [name, email, address, age, country, userId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting data");
    } else {
      res.json({ message: "New infos inserted successfully", data: req.body });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sqlDelete = `DELETE FROM users WHERE id = ?`;

  db.run(sqlDelete, [userId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting data");
    } else {
      res.json({ message: "User deleted successfully", data: req.body });
    }
  });
});

app.listen(3000);
