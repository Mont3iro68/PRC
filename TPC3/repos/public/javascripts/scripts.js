var prefixes = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
`;

function getResult() {
  var repo = document.getElementById("rep").value;
  var getLink = `http://localhost:7200/repositories/${repo}?query=`;
  var query = document.getElementById("sparql").value;

  axios
    .get(`http://localhost:7200/repositories/${repo}/namespaces/.`)
    .then(prefix => {
      var p = prefixes.concat(`PREFIX : <${prefix.data}>`);
      var encoded = encodeURIComponent(p + query);

      axios
        .get(getLink + encoded)
        .then(result => {
          console.log(result.data);
          $("#result").remove();
          $("#response").append(
            `<div id="result" class="w3-responsive">\n<table class="w3-table-all w3-striped w3-border">\n<tr id="rheader" class="w3-blue">`
          );
          for (var i in result.data.head.vars) {
            $("#rheader").append(
              `<th>${JSON.stringify(result.data.head.vars[i]).replace(
                /"/g,
                ""
              )}</th>`
            );
          }
          var c = 0;
          for (var j in result.data.results.bindings) {
            $("#rheader").after(`<tr id="rbrow${c}">`);
            Object.entries(
              result.data.results.bindings[j]
            ).map(([key, value]) =>
              $(`tr#rbrow${c}`).append(`<td>${value.value}</td>`)
            );

            $(`tr#rbrow${c}`).after(`</tr>`);
            c++;
          }
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}
