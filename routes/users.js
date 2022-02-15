/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
   return db.query(`SELECT * FROM users;`)
        .then(result => {
          console.log(result.rows)
          return result.rows;
        })
      .catch(err => {
        res
        .status(500)
        .json({ error: err.message });
      });
  });

  router.get("/login", (req, res) => {
    res.render("login");
  })

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const queryString = `SELECT * FROM users
                          WHERE email = $1 AND password = $2;`;

    if(email && password){
      db.query(queryString, [email, password])
      .then(data => {
        if (data.rows[0]) {
           req.session.user_id = data.rows[0].id;
           res.redirect("/");
        }
        else{
          res.redirect("/api/users/login");
        }
      })
    } else {
      res.send('You must enter a username and password!');
      res.redirect("/api/users/login");
    }

  })
  return router;
};

router.get('/logout', (req, res) => {
  req.session = null;
  res.clearCookie('user_id');
  res.redirect('/api/users/login');
});
