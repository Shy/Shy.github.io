var authorRow = dc.rowChart("#authorRow");
var genrePie = dc.pieChart("#genrePie");
var typePie = dc.pieChart("#typePie");
var storePie = dc.pieChart("#storePie");
var dataTable = dc.dataTable("#listDatatable");
var pageMonth = dc.barChart("#pageMonth");

var graphHolder = .95 * document.getElementById("graphHolder").offsetWidth;
var listHolder = .95 * document.getElementById("listHolder").offsetWidth;

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
    var ndx           = crossfilter(root.children);
    author(ndx);
    type(ndx);
    genre(ndx);
    store(ndx);
    listDatatable(ndx);
    pageGraph(ndx);
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
    .width(graphHolder)
    .height(graphHolder)
    .dimension(hostDimension)
    .ordinalColors(['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5','#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107','#ff9800', '#ff5722'])
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
    .width(graphHolder)
    .height(graphHolder)
    .dimension(genreDimension)
    .group(genreSumGroup)
    .minAngleForLabel(.15)
    .innerRadius(60)
    .ordinalColors([ '#e91e63', '#9c27b0', '#673ab7', '#3f51b5','#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107','#ff9800', '#ff5722','#f44336'])
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
    .width(graphHolder)
    .height(graphHolder)
    .dimension(typeDimension)
    .group(typeSumGroup)
    .innerRadius(60)
    .ordinalColors([  '#ffc107','#ff9800', '#ff5722','#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5','#2196f3','#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39','#ffeb3b'])
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
    .width(graphHolder)
    .height(graphHolder)
    .dimension(storeDimension)
    .group(storeSumGroup)
    .innerRadius(60)
    .ordinalColors(['#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107','#ff9800', '#ff5722','#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5','#2196f3'])
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

function pageGraph(ndx){
  var volumeByDay = ndx.dimension(function (d) {
        var format = d3.time.format("%m/%d/%Y");
        return ( d3.time.day(format.parse(d.Finished)));
    });

  var volumeByPageCount = volumeByDay.group()
    .reduceSum(function(d) {
      return d.Pages;
    });

    pageMonth
    .width(listHolder)
    .height(graphHolder)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(volumeByDay)
    .group(volumeByPageCount)
    .xUnits(d3.time.days)
    .brushOn(false)
    .ordinalColors(['#2196f3','#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39','#ffeb3b','#ffc107','#ff9800', '#ff5722','#f44336', '#e91e63', '#9c27b0', '#673ab7','#3f51b5'])
    .elasticY(true)
    .x(d3.time.scale().domain([new Date(2015, 1, 1), new Date()]))
    .xAxis();

    pageMonth.render();
}







