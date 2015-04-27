var authorRow = dc.rowChart("#authorRow");
var genrePie = dc.pieChart("#genrePie");
var typePie = dc.pieChart("#typePie");
var storePie = dc.pieChart("#storePie");
var dataTable = dc.dataTable("#listDatatable");


d3.csv("data/Books.csv", function(error, data) {
    if (error) {  //If error is not null, something went wrong.
      console.log(error);  //Log the error.
    } else {      //If no error, the file loaded correctly. Yay!
      //Include other code to execute after successful file load here
      dataset = data;
    };

    var ndx           = crossfilter(dataset);
    
    author(ndx);
    type(ndx);
    genre(ndx);
    store(ndx);
    listDatatable(ndx);
});

function author(ndx){
  hostDimension  = ndx.dimension(function(d) {return d.Author;});
  hostSumGroup = hostDimension.group();

  authorRow
    .width(496)
    .height(496)
    .dimension(hostDimension)
    .group(hostSumGroup)
    .elasticX(true)    
    .gap(0)
    .labelOffsetX(5)
    .label(function(d) {
      return d.key;
    });

  authorRow.render();
}

function genre(ndx){

  genreDimension  = ndx.dimension(function(d) {return d.Genre;});
  genreSumGroup = genreDimension.group();

  genrePie
    .width(496)
    .height(496)    
    .dimension(genreDimension)
    .group(genreSumGroup)    
    .colors(d3.scale.category10())
    .minAngleForLabel(.15)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value/genreDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  genrePie.render();
}

function type(ndx){

  typeDimension  = ndx.dimension(function(d) {return d.Type;});
  typeSumGroup = typeDimension.group();

  typePie
    .width(496)
    .height(496)    
    .dimension(typeDimension)
    .group(typeSumGroup)    
    .colors(d3.scale.category10())
    .minAngleForLabel(.15)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value/typeDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  typePie.render();
}

function store(ndx){

  storeDimension  = ndx.dimension(function(d) {return d.Source;});
  storeSumGroup = storeDimension.group();

  storePie
    .width(496)
    .height(496)    
    .dimension(storeDimension)
    .group(storeSumGroup)    
    .colors(d3.scale.category10())
    .minAngleForLabel(.15)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value/storeDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  storePie.render();
}

function listDatatable(ndx){

  var timeDimension = ndx.dimension(function (d) {
    return d.Name;
  });
  dataTable.width(960)
    .size(200)
    .dimension(timeDimension)
    .group(function(d) { return ""
     })
    .columns([
      'Title', 'Pages', 'Author', 'Genre'
    ])
    .sortBy(function(d){ return d.Title; })
    .order(d3.ascending);
    dataTable.render();

}