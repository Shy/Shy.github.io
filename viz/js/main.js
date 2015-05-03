var authorRow = dc.rowChart("#authorRow");
var genrePie = dc.pieChart("#genrePie");
var typePie = dc.pieChart("#typePie");
var storePie = dc.pieChart("#storePie");
var dataTable = dc.dataTable("#listDatatable");
var pageMonth = dc.barChart("#pageMonth");

function render(data){

  var dataframe = mapEntries(data,null,2);

  var root =  {};
    root.name = "Interactions";
    root.children = new Array();
    for (i=0;i<dataframe.length;i++){
      var item = {};
                
      item.Title = dataframe[i][0];
      item.Author = dataframe[i][1];
      item.Started = dataframe[i][2];
      item.Finished = dataframe[i][3];
      item.Time = dataframe[i][4];
      item.Pages = dataframe[i][5];
      item.Format = dataframe[i][6];
      item.Source = dataframe[i][7];
      item.Type = dataframe[i][8];
      item.Genre = dataframe[i][9];
      item.PubYear = dataframe[i][10];

      root.children.push(item);
    }
    var ndx           = crossfilter(root.children);
    author(ndx);
    type(ndx);
    genre(ndx);
    store(ndx);
    listDatatable(ndx);  
}

function mapEntries(json, realrowlength, skip){
  if (!skip) skip = 0;
  var dataframe = new Array();
  
  var row = new Array();
  for (var i=0; i < json.feed.entry.length; i++) {

    var entry = json.feed.entry[i];
    if (entry.gs$cell.col == '1') {
      if (row != null) {
        if ((!realrowlength || row.length === realrowlength) && (skip  === 0)){
           dataframe.push(row);
        } else {
           if (skip > 0) skip--;
        }
      }

      var row = new Array();
    }
    row.push(entry.content.$t);
  } 
  dataframe.push(row);
  return dataframe;
}

function author(ndx){
  hostDimension  = ndx.dimension(function(d) {return d.Author;});
  hostSumGroup = hostDimension.group();

  authorRow
    .width(420)
    .height(420)
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
    .width(420)
    .height(420)    
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
    .width(420)
    .height(420)    
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
    .width(420)
    .height(420)    
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
      function(d) { return d.Title; },
      function(d) { return d.Pages; },
      function(d) { return d.Author; },
      function(d) { return d.Genre; },
    ])
    .sortBy(function(d){ return d.Title; })
    .order(d3.ascending);
    dataTable.render();

}