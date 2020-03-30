var Filmes = module.exports;
const axios = require("axios");

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX c: <http://www.di.uminho.pt/prc2020/2020/2/cinema#>
`;

var getLink = "http://www.localhost:7200/repositories/cinema" + "?query=";

Filmes.getLista = async function(req) {
  var query = `select ?f ?titulo ?duracao ?data ?lingua ?pais ?realizador ?rnome where {
      ?f a c:Filme .
      ?f c:título ?titulo .
      ?f c:duração ?duracao .
      ?f c:dataLançamento ?data .
      ?f c:temLíngua ?l .
      bind(strafter(str(?l),"cinema#") as ?lingua) .
      filter(?lingua = 'English') .
      ?f c:temPaísOrigem ?p . 
      bind(replace(strafter(str(?p),"cinema#"),"_"," ") as ?pais) .
      ?f c:temRealizador ?realizador .
      ?realizador c:nome ?rnome .
  } `;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return response.data;
  } catch (e) {
    throw e;
  }
};
