/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/login", (req, res) => {
    const id = req.session.user_id;
    if (id) {
      res.redirect("/users/profile");
    } else {
      res.render("login");
    }
  });
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const queryString = `SELECT * FROM users
                          WHERE email = $1 AND password = $2;`;

    db.query(queryString, [email, password])
      .then((data) => {
        if (data.rows[0]) {
          console.log(data.rows);
          req.session.user_id = data.rows[0].id;
          req.session.name = data.rows[0].name;
          req.session.email = data.rows[0].email;

          res.redirect("/users/profile");
        } else {
          res.send("You must enter a valid username and password!");
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/profile", (req, res) => {
    const userId = req.session.user_id;

    if (!userId) {
      res.redirect("/users/login");
      return;
    }

    const queryString = `SELECT resources.*, users.*
    FROM resources
    JOIN users ON users.id = resources.user_id

    WHERE user_id = $1`;

    db.query(queryString, [userId])
      .then((data) => {
        const resources = data.rows;
        res.render("profile", { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/logout", (req, res) => {
    req.session = null;
    res.clearCookie("user_id");
    res.redirect("/users/login");
  });

  return router;
};

// JOIN likes ON likes.id = likes.user_id likes.*
