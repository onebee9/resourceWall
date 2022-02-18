const { response } = require("express");
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  /*All post routes*/

  router.get("/", (req, res) => {
    db.query(
      `SELECT resources.*, users.name FROM resources JOIN Users ON resources.user_id = users.id;`
    )
      .then((data) => {
        const resources = data.rows;
        res.render("resources", { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

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

  router.post("/likes", (req, res) => {
    const userID = req.session.user_id;

    const queryString = `INSERT INTO likes(
    user_id,
    resource_id,
    resource_like) VALUES ($1, $2, $3) RETURNING *`;

    const values = [userID, req.body.postID, true];

    db.query(queryString, values)
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/likes/delete", (req, res) => {

    const userID = req.session.user_id;
    const queryString = `DELETE FROM likes 
    WHERE user_id = $1 AND resource_id = $2;`;

    const values = [userID, req.body.postID];
    db.query(queryString, values)
      .then((data) => {
        if (data.rows.length > 0) {
          res.status(200).json('success');
        } else {
          res.status(202).json('failed');
        }
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

    db.query(queryString, values)
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/ratings/delete", (req, res) => {

    const userID = req.session.user_id;
    const queryString = `DELETE FROM ratings 
      WHERE user_id = $1 AND resource_id = $2;`;
  
    const values = [userID, req.body.postID];
    db.query(queryString, values)
      .then((data) => {
        if (data.rows.length > 0) {
          res.status(200).json('success');
        } else {
          res.status(202).json('failed');
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  /*Post routes end*/

  /*Get routes start*/
  
  router.get("/new", (req, res) => {
    // makes a request to localhost:3000/resources/new
    const id = req.session.user_id;
    if (id) {
      res.render("create_resource");
    } else {
      res.redirect("/users/login");
    }
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

  router.get("/likes/:postID", (req, res) => {

    const userID = req.session.user_id;
    const postID = req.params.postID;
    const queryString = `SELECT likes.*, users.name 
  FROM likes 
  JOIN users ON users.id = likes.user_id 
  WHERE likes.resource_id = $1 AND users.id = $2;`;
    const values = [postID, userID];

    db.query(queryString, values)
      .then((data) => {
        let responseobject = {};

        if (data.rows.length > 0) {
          responseobject["status"] = "found";
          res.status(200).json(responseobject);
        } else {
          responseobject["status"] = "not found";
          res.status(202).json(responseobject);
        }

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

  router.get("/ratings/:postID", (req, res) => {

    const userID = req.session.user_id;
    const values = [req.params.postID, userID];

    const queryString = `SELECT ratings.*, users.name 
    FROM ratings 
    JOIN users ON users.id = ratings.user_id 
    WHERE ratings.resource_id = $1 AND users.id = $2;`;

    db.query(queryString, values)
      .then((data) => {

        if (data.rows.length > 0) {
          res.status(200).json(data.rows[0].rating);
        } else {
          res.status(202).json(0);
        }
      })
      .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

return router;
};

/*Get routes start*/