function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
   // Use d3 to select the panel with id of `#sample-metadata`

  d3.json("/metadata/" + sample).then(response => {
   var selectPanel = d3.select("#sample-metadata");
    
   // Use `.html("") to clear any existing metadata
    selectPanel.html("");
    console.log(selectPanel);
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    entries = Object.entries(response);
    for (i = 0; i < entries.length; i++) {
      selectPanel.append("p").text(entries[i][0] 
      + ": " + entries[i][1]);
    }
  })
  //console.log(entries)
}
  // BONUS: Build the Gauge Chart

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json("/samples/" + sample).then(response => {
      // console.log(response);
      // @TODO: Build a Bubble Chart using the sample data
      var trace = {
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode: 'markers',
        marker: {
          color: response.otu_ids,
          size: response.sample_values
        }
      };
      
      var data1 = [trace];
      
      var layout = {
        
        height: 500,
        width: 500
      };
      
      Plotly.newPlot('bubble', data1, layout);

      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      var data2 = [{
        values: response.sample_values.slice(0,10),
        labels: response.otu_ids.slice(0,10),
        text: response.otu_labels.slice(0,10),
        type: 'pie'
      }];
      
      var layout = {
        height: 500,
        width: 500
      };
      
      Plotly.newPlot('pie', data2, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();