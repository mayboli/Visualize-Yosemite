function weather() {
    var url = '/weather';

    d3.json(url).then(function(data) {
      console.log("Weather Data");    
      console.log(data);
      console.log("---------------------------");
  
    // Use d3 to select the panel with id
        var panel = d3.select("#weatherdata");
  
      // Clear any existing metadata
        panel.html("");
        var weatherdata = data[0]

      //Add each key and value pair to the panel
      Object.entries(weatherdata).forEach(([key, value]) => {
        var text = panel.append("p");
        text.text(key + ': ' + value);
        });
   });
  }

function tweet() {
    var url = '/twitter';
    d3.json(url).then(function(data) {
        console.log("Tweet Data");    
        console.log(data);
        console.log("---------------------------");  
    
        var panel = d3.select("#tweetdata");
  
    
        panel.html("");
        var tweetdata = data[0]
        console.log(tweetdata);

        Object.entries(tweetdata).forEach(([key, value]) => {
            var text = panel.append("p");
            text.text(value);
            });
    });
}

function news() {
    var url = '/news';
    d3.json(url).then(function(data) {
        console.log("Recent news Data");    
        console.log(data);
        console.log("---------------------------");  

        var panel = d3.select("#newsdata");
  
        panel.html("");
        var newsdata = data[0]
        console.log(newsdata);

        Object.entries(newsdata).forEach(([key, value]) => {
            var text = panel.append("p");
            text.text(value);
            });
    });
}

var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideIndex-1].style.display = "block";  
}



weather();
tweet();
news();