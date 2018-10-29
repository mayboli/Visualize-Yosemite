// Store our API endpoint inside url
var url = "/traffic_counts"

// Perform a GET request to the url
d3.json(url).then(function(data){

  var x1 = [];
  var y1 = [];
  var x2 = [];
  var y2 = [];
  var x3 = [];
  var y3 = [];
  var x4 = [];
  var y4 = [];
  var x5 = [];
  var y5 = [];
  var x6 = [];
  var y6 = [];
  var x7 = [];
  var y7 = [];

  function buildTrace(x1, y1, entrance){
    for (var i=0; i<data.length ; i++) {
        if (data[i].Locations == entrance) {
          x1.push(data[i].Years);
          y1.push(data[i].Total);
        }
    };
  };  
  buildTrace(x1, y1, "ARCH ROCK")
  buildTrace(x2, y2, "BADGER PASS")
  buildTrace(x3, y3, "BIG OAK FLAT")
  buildTrace(x4, y4, "BIG TREE")
  buildTrace(x5, y5, "HETCH HETCHY")
  buildTrace(x6, y6, "SOUTH ENTRANCE")
  buildTrace(x7, y7, "TIOGA PASS")
  buildPlot(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7)
});


  function buildPlot(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7) {
      // ARCH ROCK
      var trace1 = {
          type: "scatter",
          mode: "line",
          name: "ARCH ROCK",
          x: x1,
          y: y1,
        };

      // BADGER PASS
      var trace2 = {
          type: "scatter",
          mode: "line",
          name: "BADGER PASS",
          x: x2,
          y: y2,
        };  

      // BIG OAK FLAT
      var trace3 = {
          type: "scatter",
          mode: "line",
          name: "BIG OAK FLAT",
          x: x3,
          y: y3,
        };

      // BIG TREE
      var trace4 = {
          type: "scatter",
          mode: "line",
          name: "BIG TREE",
          x: x4,
          y: y4,
        };

      // HETCH HETCHY
      var trace5 = {
          type:"scatter",
          mode: "line",
          name: "HETCH HETCHY",
          x: x5,
          y: y5,
        };

      // SOUTH ENTRANCE
      var trace6 = {
          type: "scatter",
          mode: "line",
          name: "SOUTH ENTRANCE",
          x: x6,
          y: y6,
        };

      // TIOGA PASS
      var trace7 = {
          type: "scatter",
          mode: "line",
          name: "TIOGA PASS",
          x: x7,
          y: y7,
        };  

      var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7];

      var layout = {
          title: "# of Vistors per Entrance",        
  };

    Plotly.newPlot("visitors_entrances_plot", data, layout);
};
