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

    const ownerResourcesQueryString = `SELECT resources.*, users.name
    FROM resources
    LEFT JOIN users ON resources.user_id = users.id
    WHERE resources.user_id = $1`;

    const likedResourcesQueryString = `SELECT resources.*, users.name
    FROM resources
    LEFT JOIN likes ON resources.id = likes.resource_id
    LEFT JOIN users ON resources.user_id = users.id
    WHERE likes.user_id = $1 AND likes.resource_like = true`;

    let results = {};
    db.query(ownerResourcesQueryString, [userId])
      .then((myPostdata) => {
        results['myPosts'] = myPostdata.rows;
      })
      .then(() => {
        db.query(likedResourcesQueryString, [userId])
          .then((likeData) => {
            results['myLikedPosts'] = likeData.rows;
            console.log(results);
            console.log(userId);
            res.render("profile", { results });
          })
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
