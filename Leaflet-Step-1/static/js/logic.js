


var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
  
});

var techtonics='PB2002_steps.json'
console.log(techtonics)

techtonics_layer=d3.json(techtonics).then(function(data1){
  for (var i = 0; i < data1.features.length; i++){


    // retrive the coordinates for markers
   var techtonics_layer = [data1.features[i].geometry.coordinates[0]]
    
  }
  return(techtonics_layer)
});


// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryUrl);

// Our style object
var mapStyle = {
  color: "white",
  fillColor: "pink",
  fillOpacity: 0.5,
  weight: 1.5
};

d3.json(queryUrl).then(function(data){
  console.log(data)
  // Start for loop to add the new markers 
  for (var i = 0; i < data.features.length; i++){


      // retrive the coordinates for markers
      coords = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
      
      //retrieve the color used for each marker
      var color = '';
      var depth = data.features[i].geometry.coordinates[2];
      switch(true){
          case (depth > -10 && depth < 10):
              color = 'rgb(19, 235, 45)'
              break;
          case (depth >= 10 && depth < 30):
              color = 'rgb(138, 206, 0)'
              break;
          case (depth >= 30 && depth < 50):
              color = 'rgb(186, 174, 0)'
              break;
          case (depth >= 50 && depth < 70):
              color = 'rgb(218, 136, 0)'
              break;
          case ( depth >= 70 && depth < 90):
              color = 'rgb(237, 91, 0)'
              break;
          case (depth >= 90):
              color = 'rgb(242, 24, 31)'
              break;
      }

      // create the variables for your popup
      //var date = moment(data.features[i].properties.time).format('MMMM Do YYYY')
      //var time =  moment(data.features[i].properties.time).format('h:mm:ss a')
      var loc = data.features[i].properties.place
      var mag = data.features[i].properties.mag

      // Create the circles for each earthquake report and add to the baseMap layer.
      L.circle(coords, {
          opacity: .5,
          fillOpacity: 0.75,
          weight: .5,
          color: 'black',
          fillColor: color,
          radius: 5000 * data.features[i].properties.mag
  }).bindPopup(`<p align = "left"> <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)

  newMarker = L.layer
}});

var legend = L.control({position: 'bottomright'});


legend.onAdd = function (){
  var div = L.DomUtil.create('div', 'info legend');
  var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
  var colors = [
      'rgb(19, 235, 45)',
      'rgb(226, 248, 184)',
      'rgb(224, 210, 17)',
      'rgb(218, 136, 0)',
      'rgb(255, 157, 0)',
      'rgb(211, 10, 17)'
      ];
  var labels = [];
  // loop through our density intervals and generate a label with a colored square for each interval
  grades.forEach(function(grade, index){
      labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
  })

  div.innerHTML += "<ul>" + labels.join("") +"</ul>";
  return div;

};

legend.addTo(myMap);
// Adding the tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
  Street: street,
  Topography: topo
};

// Overlays that can be toggled on or off
var overlayMaps = {
  "Techtonics layer":techtonics_layer
};

//var myMap = L.map("map", {
//  center: [37.7749, -122.4194],
//  zoom: 5,
//  layers: [street, topo]
//});
// Create a map object, and set the default layers.
// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

