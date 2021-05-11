function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/results.json").then((data) => {
    var musicClassifier = data.ids;

    musicClassifier.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstModel = musicClassifier[0];
    buildCharts(firstModel, 0);
    buildMetadata(firstModel);
  });
}

// Get current model selection:
var sel = document.getElementById('selDataset');

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  var sel_val = sel.options[sel.selectedIndex].value;
  console.log(sel_val);
  buildMetadata(newSample);
  buildCharts(newSample, sel_val);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/results.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample, sel_val) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/results.json").then((data) => {

    // Create a variable that holds the samples array.
    if (sel_val == 0 || sel_val == 1 || sel_val == 4) {
      var sampleArray = data.results;
      // Create a variable that filters the samples for the object with the desired sample number.
      var filter = sampleArray.filter(sampleObj => sampleObj.id == sample);
      // Create a variable that holds the first sample in the array.
      var getFirst = filter[0];

      // Create variable that holds the precision.
      var prec = getFirst.precision;

      xValue = Object.values(prec)
      yticks = Object.keys(prec);

      // Create the trace for the bar chart. 
      var barData = [{
        x: xValue,
        y: yticks,
        type: "bar",
        orientation: "h",
      }];

      // Create the layout for the bar chart. 
      var barLayout = {
      title: "<b>Precision vs. Genre</b>",
      xaxis: {title: "Precision"},
      yaxis: {title: "Genre"}
      };

      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
    }
  
    // Handle the KMeans models:
    if (sel_val == 2 || sel_val == 3) {
      // Placholder bar chart
      var barData = [{
        x: [5, 6, 7, 8],
        y: [0, 1, 2, 3],
        type: "bar",
        orientation: "h"
      }];
      Plotly.newPlot("bar", barData);

    }
  })
};
