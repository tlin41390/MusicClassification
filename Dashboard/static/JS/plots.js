function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filter = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var getFirst = filter[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = getFirst.otu_ids;
    var otu_labels = getFirst.otu_labels;
    var sample_values = getFirst.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortId = otu_ids.map(id => "OTU " + id);
    var topSamples= sample_values.slice(0,10);
    var xValue = topSamples.reverse();
    var topTenId = sortId.slice(0,10);
    var yticks = topTenId.reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xValue,
      y: yticks,
      type: "bar",
      orientation:"h",
      text: otu_labels
      
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "<b>Top 10 Bacteria Cultures Found.</b>"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    var bubbleData = [{
      x:otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: true
      }
    }
  ];

  var layout = {
    title: "<b>Bubble Chart</b>",
    margin: {t:0},
    xaxis: {title:"OTU"},
    margin: {title: "OTU Id"},
    hovermode: "closest"
  };

  Plotly.newPlot("bubble",bubbleData,layout);

  var gauge = data.metadata.filter(data =>data.id == sample);
  var gaugeResults = gauge[0];
  var wfreqs = gaugeResults.wfreq;

  var gaugeData = [{
    type: "indicator",
    mode: "gauge+number",
    value: wfreqs,
    title: {text: "<b>Washing Frequency</b>"},
    gauge: {
    axis: {range: [null,10], tickwidth: 1, tickcolor: "darkblue" },
    bar: { color: "black" },
    steps: [
      {range: [0,2], color: "red"},
      {range: [2,4], color: "orange"},
      {range: [4,6], color: "yellow"},
      {range: [6,8], color: "green"},
      {range: [8,10], color: "blue"}
    ],
    dtick: 2
    }
  }];

  var gaugeLayout = { automargin: true
  };
  Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
