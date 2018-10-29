
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

// Calculate a rolling average for an array
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


// function buildPlot(years) {

  var url = '/annual_visitors';

  d3.json(url).then(function(data) {

  	var years = data.Year;
  	console.log(years);
  	var visitornumber = data.RecreationVisitors;

// var years = [1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
// 	  	2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
// var visitornumber = [3216681, 3308159, 3124939, 3423101, 3819518, 3839645, 3962117, 3958406, 4046207, 
// 	  	3669970, 3657132, 3493607, 3400903, 3368731, 3361867, 3378664, 3280911, 3304144, 3242644, 
// 	  	3503428, 3431514, 3737472, 3901408, 3951393, 3853404, 3691191, 3882642, 4150217, 5028868];
	var rollingPeriod = 10;
	var rollingAvgClosing = rollingAverage(visitornumber, rollingPeriod);

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

	// Part 1
	// function buildPlot(Visitors) {
		var trace1 = {
		  type: "scatter",
		  mode: "lines",
		  name: "Number of Visitors",
		  x: years,
		  y: visitornumber,
		};

		// Rolling Averages Trace
		var trace2 = {
		   type: "scatter",
	       mode: "lines",
	       name: "Rolling",
	       x: years,
	       y: rollingAvgClosing
		};

		var data = [trace1, trace2];

		var layout = {
		  title: "Recreation Visitors Overtime",
		  xaxis: {
	            rangeselector: selectorOptions,
	            rangeslider: {}
	        },
	        yaxis: {
	            fixedrange: true
	        }
		};

	Plotly.newPlot("plot", data, layout);


  });
// }


// };





    // var layout = {
    //   title: `${stock} closing prices`,
    //   xaxis: {
    //     range: [startDate, endDate],
    //     type: "date"
    //   },
    //   yaxis: {
    //     autorange: true,
    //     type: "linear"
    //   }
    // };

    // Plotly.newPlot("plot", data, layout);
