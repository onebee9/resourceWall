const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {

    const queryString = `INSERT INTO resources(
      user_id,
      title,
      description,
      category,
      resource_link) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    
    const values = [
    req.session.user_id, //need to replace this with cookie variable name
    req.body.title,
    req.body.description,
    req.body.category,
    req.body.link,
    ]

    db.query(queryString,values)
      .then(data => {
        const resources = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT resources.*, users.name FROM resources JOIN Users ON users.id = resources.user_id;`)
      .then(data => {
        const resources = data.rows;
        console.log(resources);
        res.render('resources',{resources});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  
  return router;
};