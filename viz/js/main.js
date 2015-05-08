var authorRow = dc.rowChart("#authorRow");
var genrePie = dc.pieChart("#genrePie");
var typePie = dc.pieChart("#typePie");
var storePie = dc.pieChart("#storePie");
var dataTable = dc.dataTable("#listDatatable");
var pageMonth = dc.barChart("#pageMonth");
var quarterChart = dc.rowChart('#quarterPie');
var dayOfWeekChart = dc.rowChart('#dayChart');
var formatPie = dc.pieChart('#formatPie');

var graphHolder = .95 * document.getElementById("graphHolder").offsetWidth;
var listHolder = .95 * document.getElementById("listHolder").offsetWidth;
var quarterHolder = .95 * document.getElementById("quarterHolder").offsetWidth;

function render(data) {

  var dataframe = mapEntries(data, null, 2);

  var dateformat = d3.time.format("%m/%d/%Y");

  var root = {};
  root.name = "Interactions";
  root.children = new Array();
  for (i = 0; i < dataframe.length; i++) {
    var item = {};

    item.Title = dataframe[i][0];
    item.Author = dataframe[i][1];
    item.Started = dateformat.parse(dataframe[i][2]);
    item.Finished = dateformat.parse(dataframe[i][3]);
    item.Pages = dataframe[i][4];
    item.Format = dataframe[i][5];
    item.Source = dataframe[i][6];
    item.Type = dataframe[i][7];
    item.Genre = dataframe[i][8];
    item.PubYear = dataframe[i][9];
    item.ReadTime = Math.round((item.Finished.getTime() - item.Started.getTime()) / (1000 * 60 * 60 * 24));


    root.children.push(item);
  }
  var ndx = crossfilter(root.children);

  author(ndx);
  type(ndx);
  genre(ndx);
  store(ndx);
  listDatatable(ndx);
  dayofweek(ndx);
  quarter(ndx);
  pageGraph(ndx);
  format(ndx);

}

function mapEntries(json, realrowlength, skip) {
  if (!skip) skip = 0;
  var dataframe = new Array();

  var row = new Array();
  for (var i = 0; i < json.feed.entry.length; i++) {

    var entry = json.feed.entry[i];
    if (entry.gs$cell.col == '1') {
      if (row != null) {
        if ((!realrowlength || row.length === realrowlength) && (skip === 0)) {
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

function author(ndx) {
  hostDimension = ndx.dimension(function(d) {
    return d.Author;
  });
  hostSumGroup = hostDimension.group();

  authorRow
    .width(graphHolder)
    .height(graphHolder)
    .dimension(hostDimension)
    .ordinalColors(['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'])
    .group(hostSumGroup)
    .elasticX(true)
    .gap(0)
    .labelOffsetX(5)
    .label(function(d) {
      return d.key;
    });

  authorRow.render();
}

function genre(ndx) {

  genreDimension = ndx.dimension(function(d) {
    return d.Genre;
  });
  genreSumGroup = genreDimension.group();

  genrePie
    .width(graphHolder)
    .height(graphHolder)
    .dimension(genreDimension)
    .group(genreSumGroup)
    .minAngleForLabel(.15)
    .innerRadius(60)
    .ordinalColors(['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336'])
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value / genreDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  genrePie.render();
}

function type(ndx) {

  typeDimension = ndx.dimension(function(d) {
    return d.Type;
  });
  typeSumGroup = typeDimension.group();

  typePie
    .width(graphHolder)
    .height(graphHolder)
    .dimension(typeDimension)
    .group(typeSumGroup)
    .innerRadius(60)
    .ordinalColors(['#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b'])
    .minAngleForLabel(.15)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value / typeDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  typePie.render();
}

function store(ndx) {

  storeDimension = ndx.dimension(function(d) {
    return d.Source;
  });
  storeSumGroup = storeDimension.group();

  storePie
    .width(graphHolder)
    .height(graphHolder)
    .dimension(storeDimension)
    .group(storeSumGroup)
    .innerRadius(60)
    .ordinalColors(['#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'])
    .minAngleForLabel(.15)
    .legend(dc.legend())
    .label(function(d) {
      percent = (Math.floor(d.value / storeDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  storePie.render();
}

function listDatatable(ndx) {

  var timeDimension = ndx.dimension(function(d) {
    return d.Name;
  });
  dataTable.width(listHolder)
    .size(200)
    .dimension(timeDimension)
    .group(function(d) {
      return ""
    })
    .columns([
      function(d) {
        return d.Title;
      },
      function(d) {
        return d.Pages;
      },
      function(d) {
        return d.Author;
      },
      function(d) {
        return d.Genre;
      },
    ])
    .sortBy(function(d) {
      return d.Title;
    })
    .order(d3.ascending);

  dataTable.render();
}

function pageGraph(ndx) {
  var volumeByDay = ndx.dimension(function(d) {
    return (d3.time.day(d.Finished));
  });

  var volumeByPageCount = volumeByDay.group()
    .reduceSum(function(d) {
      return d.Pages;
    });

  pageMonth
    .width(listHolder)
    .height(graphHolder)
    .margins({
      top: 10,
      right: 10,
      bottom: 20,
      left: 40
    })
    .dimension(volumeByDay)
    .group(volumeByPageCount)
    .xUnits(d3.time.days)
    .brushOn(false)
    .ordinalColors(['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'])
    .elasticY(true)
    .x(d3.time.scale().domain([new Date(2015, 0, 0), new Date()]))
    .xAxis();

  pageMonth.render();
}

function quarter(ndx) {

  var quarter = ndx.dimension(function(d) {
    var month = d.Finished.getMonth();
    return month;
  });

  // var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var mS = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  var quarterGroup = quarter.group() // By Titles not page count.
    // .reduceSum(function (d) {
    //     return d.Pages;
    // })
  ;

  quarterChart.width(quarterHolder)
    .height(quarterHolder)
    .dimension(quarter)
    .elasticX(true)
    .ordinalColors(['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'])
    .group(quarterGroup)
    .label(function(d){ return mS[d.key];});
  quarterChart.render();
}

function dayofweek(ndx) {
  var dayOfWeek = ndx.dimension(function(d) {
    var day = (d.Finished.getDay() + 6) % 7; //Set monday as start of week.
    var name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return day + '.' + name[day];
  });
  var dayOfWeekGroup = dayOfWeek.group();

  dayOfWeekChart.width(quarterHolder)
    .height(quarterHolder)
    .dimension(dayOfWeek)
    .group(dayOfWeekGroup)
    .ordinalColors(['#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'])
    .label(function(d) {
      return d.key.split('.')[1];
    })
    .title(function(d) {
      return d.value;
    })
    .elasticX(true)
    .xAxis().ticks(4);
  dayOfWeekChart.render();
}

function format(ndx) {
  formatDimension = ndx.dimension(function(d) {
    return d.Format;
  });
  formatSumGroup = formatDimension.group();
  formatPie
    .width(quarterHolder)
    .height(quarterHolder)
    .dimension(formatDimension)
    .group(formatSumGroup)
    .minAngleForLabel(.15)
    .innerRadius(30)
    .ordinalColors([ '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336','#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'])
    .label(function(d) {
      percent = (Math.floor(d.value / formatDimension.groupAll().value() * 100));
      return d.key + ": " + percent + "%";
    });

  formatPie.render();
}
