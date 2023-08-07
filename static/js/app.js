// Define the URL for the data we will be using
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// optionChanged function that just returns that value
function optionChanged(value) {
    return value
};

// Fetch the json data with D3 
d3.json(url).then(function (data) {

    // Split the JSON into its 3 parts
    let samplesData = data.samples;
    let namesData = data.names;
    let metadata = data.metadata;

    //----------------------------------------------------------------------------------------------------------------------
    //------------------- Function to populate dropdown with the sample name -----------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------
    // Some code copied from https://www.tutorialspoint.com/how-to-create-a-dropdown-list-with-array-values-using-javascript
    // and modified

    function fillDropdown(list) {
        let options = "";
        list.map((op) => { options += `<option value="${op}">${op}</option>` })
        document.getElementById("selDataset").innerHTML = options;
    };

    // Use fillDropdown to fill the dropdown menu
    fillDropdown(namesData);

    //----------------------------------------------------------------------------------------------------------------------
    //------------------- Function to plot the bar chart -------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------

    function barPlotData() {
        // Take the ID selected from the dropdown menu
        sampleName = d3.select("#selDataset").property("value")

        // Array to push things into to plot
        let plotVal = []

        // Want to find the sample data for the ID selected in the dropdown option
        // We loop through all the elements in data.samples to find the right ID
        for (let i = 0; i < samplesData.length; i++) {

            // See if the ID matches the dropdown value
            if (samplesData[i].id === sampleName) {

                // If it matches, create a list of objects with keys otu_id, value and otu_labels so we 
                // can plot them
                for (let j = 0; j < samplesData[i].otu_ids.length; j++) {
                    plotVal.push({
                        "otu_id": `OTU ${samplesData[i].otu_ids[j]}`, "value": samplesData[i].sample_values[j],
                        "otu_labels": samplesData[i].otu_labels[j]
                    });
                }
            }
        }

        // Now we get the info to plot the bar chart

        // Get the top 10 values and list them in descending order
        let top10Samples = plotVal.sort((a, b) => b.value - a.value).slice(0, 10).reverse()

        // Define the trace for the data
        let trace = {
            x: top10Samples.map(object => object.value),
            y: top10Samples.map(object => object.otu_id),
            text: top10Samples.map(object => object.otu_labels),
            type: "bar",
            orientation: "h"
        }

        // Define layout
        let layout = {
            title: `Top 10 OTU for ID ${sampleName}`,
            height: 600,
            width: 400
        }

        // Trace data Array
        let traceData = [trace];

        // Plot the data in a bar chart
        Plotly.newPlot("bar", traceData, layout);
    };

    //----------------------------------------------------------------------------------------------------------------------
    //------------------- Function plotting the bubble chart ---------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------

    function bubblePlotData() {
        // Take the ID selected from the dropdown menu
        sampleName = d3.select("#selDataset").property("value")

        // Array to push things into to plot
        let plotVal = []

        // Want to find the sample data for the ID selected in the dropdown option
        // We loop through all the elements in data.samples to find the right ID
        for (let i = 0; i < samplesData.length; i++) {

            // See if the ID matches the dropdown value
            if (samplesData[i].id === sampleName) {

                // If it matches, create a list of objects with keys otu_id, value and otu_labels so we 
                // can plot them
                for (let j = 0; j < samplesData[i].otu_ids.length; j++) {
                    plotVal.push({
                        "otu_id": samplesData[i].otu_ids[j], "value": samplesData[i].sample_values[j],
                        "otu_labels": samplesData[i].otu_labels[j]
                    });
                }
            }
        }

        // Now we get the info to plot the bubble chart

        // Define the trace for the data
        let trace = {
            y: plotVal.map(object => object.value),
            x: plotVal.map(object => object.otu_id),
            text: plotVal.map(object => object.otu_labels),
            mode: "markers",
            marker: {
                size: plotVal.map(object => Math.sqrt(object.value) * 5),
                color: plotVal.map(object => object.otu_id),
                colorscale: [
                    [0.000, "rgb(0, 128, 255)"],
                    [0.500, "rgb(51, 255, 51)"],
                    [1.000, "rgb(153, 76, 0)"]]
            }
        }

        // Define the layout
        let layout = {
            showlegend: false,
            height: 500,
            width: 1200
        };

        // Trace data Array
        let traceData = [trace];

        // Plot the data in a bar chart
        Plotly.newPlot("bubble", traceData, layout);
    };

    //----------------------------------------------------------------------------------------------------------------------
    //------------------- Function that lists the metadata information -----------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------

    function metadataPlot() {
        // Take the ID selected from the dropdown menu
        sampleName = d3.select("#selDataset").property("value")

        // Want to find the sample data for the ID selected in the dropdown option
        // We loop through all the elements in data.metadata to find the right ID
        for (let i = 0; i < metadata.length; i++) {

            // See if the ID matches the dropdown value
            if (metadata[i].id === parseInt(sampleName)) {

                // Creates a paragraph in html to show the key value pairs in the panel
                let dataList = ""
                for (let item in metadata[i]){
                    dataList += `${item}: ${metadata[i][item]}</br>`
                }
                objList = "<p>" + dataList + "</p>"
                document.getElementById("sample-metadata").innerHTML = objList;
            }
        }
    };

    // Function that plots all the data 
    function plotAll() {
        barPlotData();
        bubblePlotData();
        metadataPlot();
    };

    // Initial plots
    barPlotData();
    bubblePlotData();
    metadataPlot();

    // Refresh the plots when the ID is changed from the drop down
    d3.selectAll("#selDataset").on("change", plotAll);

});
