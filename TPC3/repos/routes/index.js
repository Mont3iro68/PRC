var express = require("express");
var router = express.Router();
var axios = require("axios");

/* GET home page. */
router.get("/", function(req, res, next) {
  axios
    .get("http://localhost:7200/repositories")
    .then(data => res.render("index", { repos: data.data.results.bindings }))
    .catch(error => res.render("error", { error: error }));
});

module.exports = router;
