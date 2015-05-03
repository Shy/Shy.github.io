var authorRow = dc.rowChart("#authorRow");
var genrePie = dc.pieChart("#genrePie");
var typePie = dc.pieChart("#typePie");
var storePie = dc.pieChart("#storePie");
var dataTable = dc.dataTable("#listDatatable");
// var pageMonth = dc.barChart("#pageMonth");

var graphHolder = .95 * document.getElementById("graphHolder").offsetWidth;
var listHolder = .95 * document.getElementById("listHolder").offsetWidth;

var materialColours = ['#ff5722', '#e91e63',  '#673ab7', '#2196f3',  '#00bcd4',  '#4caf50',  '#cddc39',  '#ffc107','#ff9800'];

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
      item.Pages = dataframe[i][4];
      item.Format = dataframe[i][5];
      item.Source = dataframe[i][6];
      item.Type = dataframe[i][7];
      item.Genre = dataframe[i][8];
      item.PubYear = dataframe[i][9];

      root.children.push(item);
    }

    var ndx = crossfilter(root.children);

    author(ndx);
    genre(ndx);
    type(ndx);
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
  authorDimension  = ndx.dimension(function(d) {return d.Author;});
  rowChart(ndx, authorDimension, authorRow);
}

function genre(ndx){
  genreDimension  = ndx.dimension(function(d) {return d.Genre;});
  pieChart(ndx, genreDimension, genrePie);
}

function type(ndx){
  typeDimension  = ndx.dimension(function(d) {return d.Type;});
  pieChart(ndx, typeDimension,typePie);
}

function store(ndx){
  storeDimension  = ndx.dimension(function(d) {return d.Source;});
  pieChart(ndx, storeDimension, storePie);
}

function rowChart(ndx, dimension, rowChart){
    SumGroup = dimension.group();

    rowChart
      .width(graphHolder)
      .height(graphHolder)
      .dimension(dimension)
      .ordinalColors(materialColours)
      .group(SumGroup)
      .elasticX(true)
      .gap(0)
      .labelOffsetX(5)
      .label(function(d) {
        return d.key;
      });

  rowChart.render();

}

function pieChart(ndx,dimension,pieChart){
  SumGroup = dimension.group();

  pieChart
    .width(graphHolder)
    .height(graphHolder)
    .dimension(dimension)
    .group(SumGroup)
    .minAngleForLabel(.15)
    .innerRadius(60)
    .ordinalColors(materialColours)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value/dimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  pieChart.render();
}

function listDatatable(ndx){

  var timeDimension = ndx.dimension(function (d) {
    return d.Name;
  });
  dataTable.width(listHolder)
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
