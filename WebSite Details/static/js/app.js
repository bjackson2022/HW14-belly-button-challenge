// Use D3 library to read in samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  
    // Populate Test Subject ID No. dropdown with IDs
    var select = d3.select("#selDataset");
    data.names.forEach(function(name) {
      select.append("option").text(name).property("value", name);
    //   dropdownMenu.append("option").text(name).property("value", name);
    });
    
    // Display default plots and sample metadata for first ID in dataset
    buildPlots(data.names[0]);
    buildMetadata(data.names[0]);
    
    // Function to update plots and sample metadata when dropdown selection changes
    function optionChanged(newId) {
      buildPlots(newId);
      buildMetadata(newId);
    }
    
    // Function to build horizontal bar chart and bubble chart
    function buildPlots(id) {
      
      // Filter data to only include samples for selected ID
      var samples = data.samples.filter(function(sample) {
        return sample.id === id;
      });
      var sample = samples[0];
      
      // Create horizontal bar chart with top 10 OTUs
      var barData = [{
        type: "bar",
        orientation: "h",
        x: sample.sample_values.slice(0, 10).reverse(),
        y: sample.otu_ids.slice(0, 10).map(function(id) {
          return `OTU ${id}`;
        }).reverse(),
        text: sample.otu_labels.slice(0, 10).reverse()
      }];
      var barLayout = {
        title: "<b>Top 10 OTUs</b>",
        xaxis: {
          title: "Sample Values"
        }
      };
      Plotly.newPlot("bar", barData, barLayout);
      
      // Create bubble chart with all OTUs
      var bubbleData = [{
        type: "scatter",
        mode: "markers",
        x: sample.otu_ids,
        y: sample.sample_values,
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids,
          colorscale: "Earth"
        },
        text: sample.otu_labels
      }];
      var bubbleLayout = {
        title: "<b>All OTUs</b>",
        xaxis: {
          title: "OTU ID"
        },
        yaxis: {
          title: "Sample Values"
        }
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }
    
    // Function to build sample metadata display
    function buildMetadata(id) {
      var metadata = data.metadata.filter(function(obj) {
        return obj.id == id;
      })[0];
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(metadata).forEach(function([key, value]) {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    }
    
    // Event listener for dropdown change
    d3.selectAll("#selDataset").on("change", function() {
      var newId = d3.select(this).property("value");
      optionChanged(newId);
    });
    
  });
