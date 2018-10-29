var url = '/annual_visitors';

d3.json(url).then(function(data){

    var years = [];
    var visitornumber = [];
    var rollingPeriod = 50;
    var rollingAvgClosing = rollingAverage(visitornumber, rollingPeriod);

    for (var i=0; i<data.length ; i++) {
        years.push(data[i].Year) 
        visitornumber.push(data[i].RecreationVisitors)
  }

    console.log(years);
    
    console.log(visitornumber);

    function rollingAverage(arr, windowPeriod = 10) {
      // rolling averages array to return
      var averages = [];

      // Loop through all of the data
      for (var i = 0; i < arr.length - windowPeriod; i++) {
        // calculate the average for a window of data
        var sum = 0;
        for (var j = 0; j < windowPeriod; j++) {
          sum += arr[i + j];
        }
        // calculate the average and push it to the averages array
        averages.push(sum / windowPeriod);
      }
      return averages;
    }


var selectorOptions = {
        buttons: [{
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1m'
        }, {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6m'
        }, {
            step: 'year',
            stepmode: 'todate',
            count: 1,
            label: 'YTD'
        }, {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1y'
        }, {
            step: 'all',
        }],
    };

        var trace1 = {
          type: "scatter",
          mode: "lines",
          name: "Number of Visitors",
          x: years,
          y: visitornumber,
        };

        var data = [trace1];

        var layout = {
          title: "# of Recreation Visitors in the past 110 years ",
          xaxis: {
                rangeselector: selectorOptions,
                rangeslider: {}
            },
            yaxis: {
                fixedrange: true
            }
        };

    Plotly.newPlot("visitors_plot", data, layout);

});  

