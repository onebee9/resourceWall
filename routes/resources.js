const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/new", (req, res) => {
    const userID = req.session.user_id;
    const queryString = `INSERT INTO resources(
      user_id,
      title,
      description,
      category,
      resource_link) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;

    const values = [
      userID, //need to replace this with user id from the cookie
      req.body.title,
      req.body.description,
      req.body.category,
      req.body.link,
    ];

    db.query(queryString, values)
      .then((data) => {
        const newResource = data.rows;
        // res.send({ newResource });
        res.redirect("/resources");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/likes", (req, res) => {
    const userID = req.session.user_id;
    //console.log(req.body.id);
    const queryString = `INSERT INTO likes(
    user_id,
    resource_id,
    resource_like) VALUES ($1, $2, $3) RETURNING *`;

    const values = [userID, req.body.postID, true];

    db.query(queryString, values)
      .then((data) => {
        data.rows;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/likes", (req, res) => {
    db.query(
      `SELECT likes.*, users.name FROM likes JOIN users ON users.id = likes.user_id`
    )
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/ratings", (req, res) => {
    const userID = req.session.user_id;
    const queryString = `INSERT INTO ratings(
      user_id,
      resource_id,
      rating
    ) VALUES ($1, $2, $3) RETURNING *`;

    const values = [userID, req.body.postID, req.body.rating];

    console.log(values);

    db.query(queryString, values)
      .then((data) => {
        data.rows;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/ratings", (req, res) => {
    db.query(
      `SELECT ratings.*, users.name FROM ratings JOIN users ON users.id = ratings.user_id`
    )
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/comments", (req, res) => {
    const userID = req.session.user_id;
    const queryString = `INSERT INTO comments(
      user_id,
      resource_id,
      comment) VALUES ($1,$2,$3) RETURNING *;`;

    const values = [userID, req.body.postID, req.body.comment];

    db.query(queryString, values)
      .then((data) => {
        const newResource = data.rows;
        // res.send({ newResource });
        res.redirect("/resources");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/comments", (req, res) => {
    db.query(
      `SELECT comments.*, users.name FROM comments JOIN Users ON users.id = comments.user_id;`
    )
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/comments/:postID", (req, res) => {
    const value = req.params.postID;
    const queryString = `SELECT comments.*, users.name FROM comments JOIN Users ON users.id = comments.user_id WHERE comments.resource_id = $1 ;`;
    db.query(queryString, [value])
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/searchResults", (req, res) => {
    const queryParams = [];
    let queryString = `SELECT resources.*, users.name FROM resources JOIN Users ON users.id =
    resources.user_id WHERE resources.id IS NOT NULL `;

    //validate that search queries exist and then add on to the query
    if (!req.body.title == "") {
      queryParams.push(`%${req.body.title}%`);
      queryString += ` AND resources.title LIKE $${queryParams.length} `;
    }

    if (!req.body.category == "") {
      queryParams.push(req.body.category);
      queryString += `AND resources.category = $${queryParams.length} `;
    }
    queryString += `GROUP BY resources.id, users.name ;`;

    db.query(queryString, queryParams)
      .then((data) => {
        if (data) {
          const resources = data.rows;
          res.render("resources", { resources });
          return;
        }
        res.send("No matching search results");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/", (req, res) => {
    db.query(
      `SELECT resources.*, users.name FROM resources JOIN Users ON users.id = resources.user_id;`
    )
      .then((data) => {
        const resources = data.rows;
        res.render("resources", { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/new", (req, res) => {
    // makes a request to localhost:3000/resources/new
    const id = req.session.user_id;
    if (id) {
      res.render("create_resource");
    } else {
      res.redirect("/users/login");
    }
  });

  return router;
};
