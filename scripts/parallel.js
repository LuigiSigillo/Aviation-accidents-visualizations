// set the dimensions and marginParallels of the graph
var marginParallel = { top: 25, right: -230, bottom: 150, left: 70 };
var widthParallel = document.getElementById("parallel").clientWidth + marginParallel.left + marginParallel.right
var heightParallel = document.getElementById("parallel").clientHeight - marginParallel.top - marginParallel.bottom
// append the svg object to the body of the page
var svgParallel = d3.select("#parallel")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    //.attr("viewBox", "0 0 " + (widthParallel) + " " + (heightParallel))
    .append("g")
    .attr("transform", "translate(" + marginParallel.left + "," + marginParallel.top + ")");

var mtooltip = d3.select("#parallel").append("div")
    .attr("class", "mdsTooltip")
    .style("opacity", 0);
// Parse the Data
d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
    
    dataset_dict = change(data, "Crash.Country", 2020, "false")

    var i
    keys = Object.keys(dataset_dict),
        i, len = keys.length;
    keys.sort(function (a, b) {
        return a - b;
    });
    dimensions = Array.from({ length: 20 }, (x, i) => 2001 + i);
    // Here I set the list of dimension manually to control the order of axis:

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}

    for (i in dimensions) {
        _name = dimensions[i]
        y[_name] = d3.scaleLinear()
            .domain([0, 40]) // --> Same axis range for each group
            // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
            .range([heightParallel, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, widthParallel])
        .domain(dimensions);

    // Highlight the specie that is hovered
    var highlight = function (d) {
        mtooltip.transition()
            .duration(200)
            .style("opacity", .9)
        mtooltip.html(d)
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1] - 25) + "px");


        // first every group turns grey NOT WORKING
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        // // Second the hovered specie takes its colorParallel
        d3.selectAll(".line" + d)
            .transition().duration(200)
            .style("stroke", "#f03b20")
            .style("opacity", "1")
            .text
    }

    // Unhighlight
    var doNotHighlight = function (d) {
        console.log(d)
        d3.selectAll(".line" + d)
            .transition().duration(200)
            .style("stroke", "#2ca25f")
            .style("opacity", "1")
        mtooltip.transition()
            .duration(500)
            .style("opacity", 0);
    }

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function (year) {
            dataset_dict = change(data, "Crash.Country", year, "true")
            try {
                return [x(year), y[year](dataset_dict[d]['Fatal'])]
            }
            catch (error) {
                return [x(year), y[year](0)]
            }
        }));
    }

    // Draw the lines
    svgParallel
        .selectAll("myPath")
        .data(keys)
        .enter()
        .append("path")
        .attr("class", function (d) { return "line" + d })
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "#2ca25f")
        .style('stroke-width', "3")
        .style("opacity", 1)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight)

    // Draw the axis:
    svgParallel.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "parAxis")
        // I translate this element to its right position on the x axis
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function (d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; })
        .style("fill", "black")

})
