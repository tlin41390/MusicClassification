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
      type: "bar"
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
    img.src = getFirst.bannerImg1;
    var src = document.getElementById("img-container");
    src.appendChild(img);
    src.src = getFirst.bannerImg1;
    })
  }
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/results.json").then((data) => {
    var sampleArray = data.results;
    // Create a variable that filters the samples for the object with the desired sample number.
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
      for (const [key, value] of Object.entries(getFirst)) {
        if (key != "id") {
          xValue = Object.values(value);
          yticks = Object.keys(value);
          barData = {
            x: xValue,
            y: yticks,
            type: "bar",
            orientation: "h",
            visible: false,
            name: "Predicted " + key
          }
          plots.push(barData);
        }
      };


      Plotly.newPlot('bar', plots, {
        title: "<b>Number of Actual Genre Classes<br>For Selected Predicted Genre</b>",
        xaxis: {title: "Number"},
        yaxis: {title: "Actual Genre"},
        updatemenus: [{
          x: 2,
          y: 1.5,
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
