var express = require("express");
var router = express.Router();
var Filmes = require("../controllers/filmes");
var Atores = require("../controllers/atores");
var Personagens = require("../controllers/personagens");

/* GET home page. */
router.get("/filmes", function(req, res, next) {
  Filmes.getLista()
    .then(dados => res.jsonp(dados))
    .catch(error => res.jsonp(error));
});

/* GET home page. */
router.get("/atores", function(req, res, next) {
  Atores.getLista()
    .then(dados => res.jsonp(dados))
    .catch(error => res.jsonp(error));
});
module.exports = router;

/* GET home page. */
router.get("/personagens", function(req, res, next) {
  Personagens.getLista()
    .then(dados => res.jsonp(dados))
    .catch(error => res.jsonp(error));
});
module.exports = router;
