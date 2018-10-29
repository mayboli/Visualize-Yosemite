// Store our scraped trailhead data inside url
// data scraped into /post convert inside url
var url = '/post';

// var url2 ='/entrances';

// Perform a GET request to the URL
d3.json(url).then(function(data) {
    
  // store data from URL 'post' into trails
  var trails = data;
  console.log(trails);
  
  // call createFeatures function using our trails data
  createFeatures(trails);
});

function createMap(trailheads) {

  // Define satellite, lightmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoiYWNjYWNoZXVuZyIsImEiOiJjam1zaG82cHgwMjNsM2pvNGtleTlqNzdrIn0.1jAm9Dl6HwdEXD7JRKQXyA"
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1IjoiYWNjYWNoZXVuZyIsImEiOiJjam1zaG82cHgwMjNsM2pvNGtleTlqNzdrIn0.1jAm9Dl6HwdEXD7JRKQXyA"
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoiYWNjYWNoZXVuZyIsImEiOiJjam1zaG82cHgwMjNsM2pvNGtleTlqNzdrIn0.1jAm9Dl6HwdEXD7JRKQXyA"
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Trailheads": trailheads
    // "Entrances": entrances
  };

  // Create our map, giving it the lightmap and trailhead layers to display on load
  var myMap = L.map("map", {
    center: [
      37.8651, -119.5383
    ],
    zoom: 10,
    layers: [lightmap, trailheads] //,entrances
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

function createFeatures(response) {

  // perform a PULL and store into data
  var data = response;

  // Initialize an array to hold the trailhead markers
  var trailheadMarkers = [];

  // loop data to add Trailhead Markers to trailheadMarkers array
  // bind trail name, distance and coordinates to the Popup
  for (var i = 0; i < data.length; i ++) {

    trailheadMarkers.push(L.marker(data[i].coordinates).bindPopup("<h3>" + data[i].trail + 
      "</h3><hr><p>Distance:" + data[i].distance + "</p>" +
      "<hr><p>Coordinates: " + data[i].coordinates + "</p>")
      );
  }


  // Sending our entrances layer to the createMap function
  createMap(L.layerGroup(trailheadMarkers));
}

