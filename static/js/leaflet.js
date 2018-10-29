// Store our scraped trailhead data inside url
// data scraped into /post convert inside url
var url = '/post';

var url2 ='/entrances';

// Perform a GET request to the URL
d3.json(url).then(function(data) {
    
  // store data from URL 'post' into trails
  var trails = data;
  console.log(trails);

  d3.json(url2).then(function(data) {
    var entrances = data;
    console.log(entrances);

    // call createFeatures function using our trails data
    createFeatures(trails, entrances);
  })
  
});

function createMap(trailheads, entrances) {

  // Define satellite, lightmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Trailheads": trailheads,
    "Entrances": entrances
  };

  // Create our map, giving it the lightmap and trailhead layers to display on load
  var myMap = L.map("map", {
    center: [
      37.8651, -119.5383
    ],
    zoom: 9,
    layers: [lightmap, trailheads, entrances]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var yosemiteBoundary = [
    [38.177226, -119.630488],
    [38.138989, -119.709608],
    [38.050358, -119.882146],
    [37.874451, -119.889963],
    [37.875518, -119.852451],
    [37.822209, -119.851670],
    [37.813477, -119.875069],
    [37.734096, -119.834328],
    [37.729246, -119.767602],
    [37.646270, -119.758680],
    [37.642468, -119.712548],
    [37.547975, -119.699457],
    [37.493558, -119.670629],
    [37.477746, -119.538155],
    [37.527280, -119.536753],
    [37.531645, -119.441298],
    [37.769553, -119.218120],
    [37.894802, -119.220439],
    [37.958798, -119.325307],
    [38.053475, -119.320965],
    [38.177226, -119.630488]
  ];

  L.polygon(yosemiteBoundary, {
    color: "purple",
    fillColor: "purple",
    fillOpacity: 0.25,
    stroke: true,
    weight: 3
  }).addTo(myMap);
}

function createFeatures(response1, response2) {

  // perform a PULL and store into trail
  var trail = response1;

  // Initialize an array to hold the trailhead markers
  var trailheadMarkers = [];

  // loop trail to add Trailhead Markers to trailheadMarkers array
  // bind trail name, distance and coordinates to the Popup
  for (var i = 0; i < trail.length; i ++) {

    trailheadMarkers.push(L.marker(trail[i].coordinates).bindPopup("<h3>" + trail[i].trail + 
      "</h3><hr><p>Distance:" + trail[i].distance + "</p>" +
      "<hr><p>Coordinates: " + trail[i].coordinates + "</p>")
      );
  }


  // perform a PULL with second layer data and store into entrances
  var entrances = response2;

  // create a new icon for entrance marker
  var entranceIcon = new L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAchor: [1, -34],
    shadowSize: [41, 41]
  })

  // Initialize an array to hold the entrances markers
  var entranceMarkers = [];

  // loop data to add Entrances Markers to entrancesMarkers array
  // bind entrance name, coordinates to the Popup
  for (var i = 0; i < entrances.length; i ++) {

    entranceMarkers.push(L.marker([parseFloat(entrances[i].Lat), parseFloat(entrances[i].Long)], {icon: entranceIcon})
      .bindPopup("<h3>Entrance<hr>" + entrances[i].Entrance + 
      "</h3><hr><p>Coordinates: " + entrances[i].Lat + ", " +
      entrances[i].Long + "</p>")
      );
  }

  // Sending our entrances layer to the createMap function
  createMap(L.layerGroup(trailheadMarkers), L.layerGroup(entranceMarkers));
}


