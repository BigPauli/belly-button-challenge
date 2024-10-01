// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data["metadata"];

    // Filter the metadata for the object with the desired sample number
    let desiredSample = metadata.filter(function (i) {
      return (i["id"] == sample);
    })[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [key, value] of Object.entries(desiredSample)) {
      let newCardBody = sampleMetadata.append("p");
      newCardBody.text(`${key}: ${value}`);
    };

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data["samples"];

    // Filter the samples for the object with the desired sample number
    let desiredSample = samples.filter(function (i) {
      return (i["id"] == sample);
    })[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = desiredSample["otu_ids"];
    let otuLabels = desiredSample["otu_labels"];
    let sampleValues = desiredSample["sample_values"];

    // Build a Bubble Chart
    // https://plotly.com/javascript/bubble-charts/
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
      }
    };

    let layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace1], layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    otuIds = otuIds.map((i) => `OTU: ${i.toString()}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      type: "bar",
      orientation: "h",
      x: sampleValues.reverse().slice(-10),
      y: otuIds.reverse().slice(-10),
      text: otuLabels.reverse().slice(-10)
    }

    layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"
      },
    }

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace2], layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data["names"];

    // Use d3 to select the dropdown with id of `#selDataset`
    let selDataset = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let newOption = selDataset.append("option");
      newOption.attr("value", `${names[i]}`);
      newOption.text(`${names[i]}`)
    };

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
