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
    buildCharts(firstModel);
    buildMetadata(firstModel);
    buildModelsCompared();
    buildImage(firstModel);
  });
}

// Get current model selection:
var sel = document.getElementById('selDataset');

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  replaceImage(newSample);
  if (newSample == 2 || newSample == 3) {
    Plotly.purge("models_compared")
  }
  else {
    buildModelsCompared();
  }
}

// Model Info Panel 
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

function buildModelsCompared() {
  d3.json("static/js/results.json").then((data) => {
    // Get supervised model names and accuracy scores
    var rf_30 = "RF " + data.metadata[0].dataset;
    var rf_30_acc = data.metadata[0].accuracy;
    var rf_3 = "RF " + data.metadata[1].dataset;
    var rf_3_acc = data.metadata[1].accuracy;
    var nn = data.metadata[4].model;
    var nn_acc = data.metadata[4].accuracy;
    var models = [rf_30, rf_3, nn];
    var acc = [rf_30_acc, rf_3_acc, nn_acc];

    // Plot the result
    var barData = [{
      x: models,
      y: acc,
      type: "bar",
      marker:{
        color: ['rgba(146,235,56,0.65)', 'rgba(222,45,38,0.95)', 'rgba(86,200,34,0.65)']
      },
    }]

    var barLayout = {
      title: "<b>Supervised Model Precision vs. Model</b>",
      xaxis: {title: "Model"},
      yaxis: {title: "Total Accuracy"}
    }

    Plotly.newPlot("models_compared", barData, barLayout);
  })
}

//create function to build image
function buildImage(sample){
  d3.json("static/js/results.json").then((data)=>{
    var imageArray = data.images;
    var filter = imageArray.filter(sampleObj => sampleObj.id ==sample);
    var getFirst = filter[0];
    var img = document.createElement("img");
    img.src = getFirst.refs;
    var src = document.getElementById("img-container");
    src.appendChild(img);
    })
  }

function replaceImage(sample){
  d3.json("static/js/results.json").then((data)=>{
    var imageArray = data.images;
    var filter = imageArray.filter(sampleObj => sampleObj.id==sample);
    var getFirst =filter[0];
    var replace = document.getElementsByTagName("img");
    replace[0].src = getFirst.refs;
  })
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/results.json").then((data) => {
    var sampleArray = data.results;
    // Create a variable that filters the samples for the object with the 
    // desired sample number.
    var filter = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var getFirst = filter[0];
    // Create a variable that holds the samples array.
    if (sample == 0 || sample == 1 || sample == 4) {
      // Create variable that holds the precision.
      var prec = getFirst.precision;

      var xValue = Object.values(prec)
      var yticks = Object.keys(prec);

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
    if (sample == 2 || sample == 3) {
      var plots = [];
      var buttons = [];
      var cnt = 0;
      var is_visible = true;
      var labels = ["Predicted jazz", "Predicted metal", "Predicted disco", "Predicted pop", "Predicted reggae", "Predicted classical", "Predicted rock", "Predicted blues", "Predicted hiphop", "Predicted country"]
      // Iterate through KMeans data
      // key = Predicted class
      // value = JSON files with keys = actual genres / values = number of samples of each
      for (const [key, value] of Object.entries(getFirst)) {
        // skip first "id" key
        if (key != "id") {
          // Only want the first predicted category to be visible initially
          if (cnt > 0) {
            is_visible = false;
          }
          // Create bar chart for current predicted class
          let xValue = Object.values(value);
          let yticks = Object.keys(value);
          let barData = {
            x: xValue,
            y: yticks,
            type: "bar",
            orientation: "h",
            visible: is_visible,
            name: "Predicted " + key
          }

          // Create dropdown button
          let display = [false, false, false, false, false, false, false, false, false, false];
          display[cnt] = true;
          let button = {
            method: "restyle",
            args: ["visible", display],
            label: labels[cnt]
          }
          buttons.push(button);
          plots.push(barData);
          cnt = cnt + 1;
        }
      };

      // Build the plot with the dropdown buttons
      Plotly.newPlot('bar', plots, {
        title: "<b>Number of Actual Genre Classes<br>For Selected Predicted Genre</b>",
        xaxis: {title: "Number"},
        yaxis: {title: "Actual Genre"},
        updatemenus: [{
          x: 2,
          y: 1.5,
          buttons: buttons
        }],
      });
    }
  })
};
