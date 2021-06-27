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
var map_key
d3version3.selectAll(".checkbox").each(function(d) {
    cb = d3.select(this);
    grp = cb.property("value")
    if (cb.property("checked"))
        map_key = grp
})
var aggregationType = document.getElementById("aggregationType").value

function parallelCoord (aggregationType,map_key) {
    console.log("vengo chiamata")        
    svgParallel.selectAll("path").remove()
    svgParallel.selectAll("g").remove()

d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
    // var yearInput = document.getElementById("slider").value

    dataset_dict = change(data, aggregationType, 2001, "false")

    var i
    keys = Object.keys(dataset_dict),
        i, len = keys.length;
    keys.sort(function (a, b) {
        return a - b;
    });


    dimensions = Array.from({ length: 20 }, (x, i) => 2001 + i);

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}

    for (i in dimensions) {
        _name = dimensions[i]
        y[_name] = d3.scaleLinear()
            .domain([0, 100]) // --> Same axis range for each group
            // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
            .range([heightParallel, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, widthParallel])
        .domain(dimensions);

    // Highlight the specie that is hovered
    var highlight = function (d) {
        //highlight
        mtooltip.transition()
            .duration(200)
            .style("opacity", .9)
        mtooltip.html(d)
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1] - 25) + "px");

        // mouse on

        mouseon_mds(d)
        mouse_on("par"+d)
        mouseon_scatter(d)
        brushMap([d], "mouseon")

        // first every group turns grey NOT WORKING
        svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        // // Second the hovered specie takes its colorParallel
        svgParallel.selectAll(".line" + d)
            .transition().duration(200)
            .style("stroke", "green")
            .style("opacity", "1")
    }

    // Unhighlight
    var doNotHighlight = function (d) {
        
        svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", "#2c7bb6")
            .style("opacity", "1")
        mtooltip.transition()
            .duration(500)
            .style("opacity", 0);

        mouse_out()
        $(this).attr("fill-opacity", "1.0");
        $("#tooltip-container").hide();
        brushMap([d], "mouseout")
        mouseout_mds(d)
        mouseout_scatter(d)
    }

    function calc_max(dataset_dict){
        var max = 0
        for (var elem in dataset_dict) {
            if (max<dataset_dict[elem][map_key])
                max = dataset_dict[elem][map_key]
        }
        return max
    }
    var dict_dataset_dict = {}
    var max = 0

    dimensions.map(function (year) {
        dict_dataset_dict[year] = change(data, aggregationType, year, "true")
        var nuov_max = calc_max(dict_dataset_dict[year])
        if (max<nuov_max)
            max = nuov_max
    })
    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.

    function path(d) {
        return d3.line()(dimensions.map(function (year) {
            dataset_dict = dict_dataset_dict[year]
            y[year].domain([0, max+2])
            try {
                return [x(year), y[year](dataset_dict[d][map_key])]
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
        .style("stroke", "#2c7bb6")
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
}

parallelCoord(aggregationType,map_key)