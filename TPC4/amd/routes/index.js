var express = require("express");
var router = express.Router();
var axios = require("axios");

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX : <http://prc.di.uminho.pt/2020/amd#>
`;

var getLink = "http://localhost:7200/repositories/amd" + "?query=";

/* GET home page. */
router.get("/", function(req, res, next) {
  var query = `select ?tit (count(?part) as ?numPartituras) ?id where {
    ?id rdf:type :Obra .
    ?id :temPartitura ?part .
    ?id :título ?tit
} 

group by ?tit ?id
order by ?tit`;
  var encoded = encodeURIComponent(prefixes + query);
  axios
    .get(getLink + encoded)
    .then(dados => {
      var mydata = [];
      mydata = dados.data.results.bindings.map(obra => {
        return {
          id: obra.id.value.split("#")[1],
          tit: obra.tit.value,
          nparts: obra.numPartituras.value
        };
      });
      res.render("index", { obras: mydata });
    })
    .catch(erro => {
      res.render("error", { error: erro });
    });
});

router.get("/:idObra", function(req, res, next) {
  var query = `select distinct ?tit ?nome ?inst ?voz ?path where{
    :${req.params.idObra} :título ?tit.
    :${req.params.idObra} :tipo ?tipo.
    :${req.params.idObra} :temPartitura ?p.
    :${req.params.idObra} :éCompostaPor/:nome ?nome.
    ?p :éTocadaPor/:designação ?inst.
    ?p :path ?path.
    OPTIONAL{?p :voz ?voz}
}`;

  var encoded = encodeURIComponent(prefixes + query);
  axios
    .get(getLink + encoded)
    .then(dados => {
      var mydata = {};
      // mydata = dados.data.results.bindings.map(obra =>{ return {id: obra.id.value.split('#')[1],
      //                                                   tit: obra.tit.value,
      //                                                   nparts: obra.numPartituras.value}})
      // res.render("index", { obras: mydata });
      mydata["titulo"] = dados.data.results.bindings[0].tit.value;
      mydata["compositor"] = dados.data.results.bindings[0].nome.value;
      mydata["instrumentos"] = dados.data.results.bindings.map(obra => {
        return {
          nome: obra.inst.value,
          voz: obra.voz ? obra.voz.value : "",
          path: obra.path.value
        };
      });
      res.render("obra", { obra: mydata });
    })
    .catch(erro => {
      res.render("error", { error: erro });
    });
});

module.exports = router;
