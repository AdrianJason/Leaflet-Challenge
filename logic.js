// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function getColor(depth) {
  switch (true) {
    case depth > 90: 
      return "#1f005c"; 
    case depth > 70: 
      return "#5b1060"; 
    case depth > 50: 
      return "#ac255e"; 
    case depth > 30: 
      return "#ca485c"; 
    case depth > 10: 
      return "#e16b5c"; 
    default: 
      return "#ffb56b";}
  }

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng){
      return L.circleMarker(latlng,
        {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: feature.properties.mag*8,
          stroke: true,
          weight: 0.5
        });
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

// Creating legend
var legend = L.control({position: "bottomright"}); 
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"); 
    limits = [0,10,20,30,40,50,60,70,80,90]; 
  var colors= ["#577590", "#4D908E", "#43AA8B", "#90BE6D", "#C5C35E", "#F9C74F", "#F8961E", "#F3722C", "#F65A38", "#F94144"]
  var labels = [];

  var legendInfo = "<h1>Depth of Earthquake</br> (per km) </h1>" +
  "<div class=\"labels\">" +
  "<div class = \"min\">" + limits[0] + "</div>" +
  "<div class=\"max\">" + limits[limits.lenght - 1] + "</div>" +
  "</div>";
  
  div.intterHTML = legendInfo; 

  limits.onEach(function(limit, index){
    labels.push("<li style=\'background-color: " + colors[index] + "\"></li>"); 
  }); 

  div.innterHTML += "<ul>" + labels.join("") + "</ul>"; 

}; 
