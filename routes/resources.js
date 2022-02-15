const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/new", (req, res) => {
    console.log(req.body);

    const queryString = `INSERT INTO resources(
      user_id,
      title,
      description,
      category,
      resource_link) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    
    const values = [
    1, //need to replace this with user id from the cookie
    req.body.title,
    req.body.description,
    req.body.category,
    req.body.link,
    ]

    db.query(queryString,values)
      .then(data => {
        const newResource = data.rows;
        // res.send({ newResource });
        res.redirect('/api/resources');
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

        res.render('resources',{resources});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  router.get("/new", (req, res) => {
    // const id = req.session.user_id;
    // if (id) {
    //   const templateVars = {
    //     user: users[id]
    //   };
    //   res.render("urls_new", templateVars);
    // } else {
    //   res.redirect("/login");
    // }
    res.render("create_resource");
  });

  return router;
};