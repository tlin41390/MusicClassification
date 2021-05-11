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
    var sampleArray = data.results;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filter = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var getFirst = filter[0];
    // Create a variable that holds the samples array.
    if (sel_val == 0 || sel_val == 1 || sel_val == 4) {
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
      plots = [];
      for (const [key, value] of Object.entries(getFirst)) {
        if (key != "id") {
          xValue = Object.values(value);
          yticks = Object.keys(value);
          barData = {
            x: xValue,
            y: yticks,
            type: "bar",
            orientation: "h",
            name: "Predicted " + key
          }
          plots.push(barData);
        }
      };

      Plotly.newPlot('bar', plots, {
        updatemenus: [{
          y: 1.2,
          yanchor: 'top',
          buttons: [{
            method: 'restyle',
            args: ['visible', [true, false, false, false, false, false, false, false, false, false]],
            label: 'Predicted jazz'
          }, {
            method: 'restyle',
            args: ['visible', [false, true, false, false, false, false, false, false, false, false]],
            label: 'Predicted metal'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, true, false, false, false, false, false, false, false]],
            label: 'Predicted disco'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, true, false, false, false, false, false, false]],
            label: 'Predicted pop'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, true, false, false, false, false, false]],
            label: 'Predicted reggae'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, false, true, false, false, false, false]],
            label: 'Predicted classical'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, false, false, true, false, false, false]],
            label: 'Predicted rock'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, false, false, false, true, false, false]],
            label: 'Predicted blues'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, false, false, false, false, true, false]],
            label: 'Predicted hiphop'
          }, {
            method: 'restyle',
            args: ['visible', [false, false, false, false, false, false, false, false, false, true]],
            label: 'Predicted country'
          }]
        }],
      });
    }
  })
};
