function economicBenefitsBubble() {
    var url = '/economic_benefits';

    d3.json(url).then(function(data) {
        console.log('Economic Benefit Data');
        console.log(data);
        console.log('-----------------------------------');
        
        // Define variables and convert string to # for plotting
        var years = data[0].years;

        var amounts_string = data[0].amounts;
        var amounts = amounts_string.map(Number)

        var jobCounts_string = data[0].job_counts;
        var jobCounts = jobCounts_string.map(Number)

        var visitorCounts_string = data[0].visitor_counts;
        var visitorCounts = visitorCounts_string.map(Number).map(function(x) {
            return parseFloat((x/1000000).toFixed(2));
        });

        // hovering text variables
        var amountTexts = amounts.map(function(amount) {
            return 'Economic Benefit: $' + amount + 'M';
        });
        var visitorCountTexts = visitorCounts.map(function(visitorCount) {
            return '# Visitors: ' + visitorCount + 'M';
        });
        var jobCountTexts = jobCounts.map(function(jobCount) {
            return '# Jobs: ' + jobCount;
        });

        var visitorAmountText = visitorCountTexts.map(function(visitorCountText, i) {
            return visitorCountText + ', ' + amountTexts[i];
        });
        var visitorJobText = visitorCountTexts.map(function(visitorCountText, i) {
            return visitorCountText + ', ' + jobCountTexts[i];
        });

        console.log('testing text');
        console.log(visitorJobText);

        console.log('Years');
        console.log(years);
        console.log('Economic Benefit $ Amount (in millions)');
        console.log(amounts);
        console.log('Job Counts');
        console.log(jobCounts);
        console.log('Visitor Counts');
        console.log(visitorCounts);

        // Build bubble and line chart

        var trace1 = {
            name: '# Visitors w/ Circle Size Representing Economic Benefits ($, mil)',
            x: years,
            y: visitorCounts,
            text: visitorAmountText,
            hoverinfo: 'text',
            mode: 'markers',
            marker: {
                size: amounts,
                sizemode: 'area',
                sizeref: .5,
                opacity: 5,
                color: 'teal'
            }
        };

        var trace2 = {
            name: '# Local Jobs',
            x: years,
            y: jobCounts,
            yaxis: 'y2',
            text: jobCountTexts,
            hoverinfo: 'text',
            type: 'scatter'
        };

        console.log('trace1 data for bubble chart');
        console.log(trace1);

        var data = [trace1, trace2];

        var layout = {
            title: '# of Visitors and # of Impacted Local Jobs in Yosemite Over Time',
            showlegend: true,
            legend: {
                x: 0.1,
                y: 1
            },
            height: 500,
            width: 1000,
            xaxis: {title: 'Year'},
            yaxis: {title: '# Visitors (millions)'},
            yaxis2: {
                title: '# Local Jobs',
                overlaying: 'y',
                side: 'right'
              }
        };

        Plotly.newPlot('economic_benefits_bubble', data, layout);

    });
};


economicBenefitsBubble()