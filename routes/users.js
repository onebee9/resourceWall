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
  return router;
};
