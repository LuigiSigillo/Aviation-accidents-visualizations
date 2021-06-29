// set the dimensions and marginParallels of the graph
var marginParallel = { top: 20, right: -100, bottom: 190, left: 25 };
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
d3version3.selectAll(".checkbox").each(function (d) {
    cb = d3.select(this);
    grp = cb.property("value")
    if (cb.property("checked"))
        map_key = grp
})
var aggregationType = document.getElementById("aggregationType").value

function parallelCoord(aggregationType, map_key) {
    svgParallel.selectAll("path").remove()
    svgParallel.selectAll("g").remove()
    var year_checkbox = document.getElementById("year_normalized_checkbox").checked
    valerione = document.getElementById("others_checkbox").checked

    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
        // var yearInput = document.getElementById("slider").value

        dataset_dict = change(data, aggregationType, 2020, "false")

        var i
        keys = Object.keys(dataset_dict),
            i, len = keys.length;
        keys.sort(function (a, b) {
            return a - b;
        });

        dimensions = Array.from({ length: 20 }, (x, i) => 2001 + i);
        if (valerione)
            dimensions = ["Total_Accidents","Fatal", "Serious", "Minor", "Uninjured", "VMC", "IMC", "Minor_Damage", "Substantial_Damage", "Destroyed_Damage", "MANEUVER", "STANDING", "UNKNOWN", "TAKEOFF", "APPROACH", "CLIMB", "CRUISE", "DESCENT", "LANDING", "GOAROUND", "TAXI"]
        // For each dimension, I build a linear scale. I store all in a y object
        var y = {}

        for (i in dimensions) {
            _name = dimensions[i]
            y[_name] = d3.scaleLinear()
                .domain([0, 100]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([heightParallel, 0])
            y[_name].brush = d3.brushY()
                .extent([[-8, y[_name].range()[1]], [8, y[_name].range()[0]]])
                .on('brush', brush_end)
                .on("end", brushPar)
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
            mouse_on("par" + d)
            mouseon_scatter(d)
            brushMap([d], "mouseon")

            // first every group turns grey NOT WORKING
            svgParallel.selectAll("path")
                .filter(function (d, i) {
                    return d != null
                })
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.1")
            // Second the hovered specie takes its colorParallel
            svgParallel.selectAll(".line" + d.replace(/ /g, ''))
                .transition().duration(200)
                .style("stroke", function(d){
                    d3.select(this).raise().classed("active", true);
                    return "green"
                })
                .style("opacity", "1")

        }

        // Unhighlight
        var doNotHighlight = function (d) {

            svgParallel.selectAll("path")
                .filter(function (d, i) {
                    return d != null
                })
                .transition().duration(200)
                .style("stroke", function (d) {
                    if (d != null && brushed_par.includes(d))
                        return "black"
                    if (brushed_par.length == 0) {
                        if (d == "AVG")
                            return "red"
                        return "#2c7bb6"
                    }
                    return "lightgrey"
                })
                .style("opacity", function (d) {
                    if (d != null && brushed_par.includes(d))
                        return "1"
                    if (brushed_par.length == 0)
                        return "1"
                    return "0.1"
                })
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

        function calc_max(dataset_dict,m_k=map_key) {
            var max = 0
            var count = 0
            var i = 0
            for (var elem in dataset_dict) {
                count += dataset_dict[elem][m_k]
                if (max < dataset_dict[elem][m_k])
                    max = dataset_dict[elem][m_k]
                i += 1
            }
            return [max, count / i]
        }
        
        var dict_dataset_dict = {}
        var max = 0
        var max_dict = {}
        if (!valerione) {
            dimensions.map(function (year) {
                dict_dataset_dict[year] = change(data, aggregationType, year, "true")
                var results = calc_max(dict_dataset_dict[year])
                var nuov_max = results[0]
                var avg = results[1]
                max_dict[year] = nuov_max
                dict_dataset_dict[year]["AVG"] = { "Item": "AVG" }
                dict_dataset_dict[year]["AVG"][map_key] = avg
                if (max < nuov_max)
                    max = nuov_max
            })

            function path(d) {
                return d3.line()(dimensions.map(function (year) {
                    dataset_dict = dict_dataset_dict[year]
                    if (year_checkbox)
                        y[year].domain([0, max + 2])
                    else
                        y[year].domain([0, max_dict[year]+ 2])

                    try {
                        return [x(year), y[year](dataset_dict[d][map_key])]
                    }
                    catch (error) {
                        return [x(year), y[year](0)]
                    }
                }))
            }
    }
        else {
            var year = document.getElementById('slider').value
            var aggregated_by_year = document.getElementById("aggregationYear").value;

            dimensions.map(function (cosa) {//cosa = IMC VMC ETC.
                dict_dataset_dict[cosa] = change(data, aggregationType, year, aggregated_by_year)

                var results = calc_max(dict_dataset_dict[cosa],cosa)
                var nuov_max = results[0]
                var avg = results[1]
                max_dict[cosa] = nuov_max
                dict_dataset_dict[cosa]["AVG"] = { "Item": "AVG" }
                dict_dataset_dict[cosa]["AVG"][cosa] = avg
                if (max < nuov_max)
                    max = nuov_max
            })
            
        dataset_dict_giusto = change(data, aggregationType, year, aggregated_by_year)

        function path(d) {
            return d3.line()(dimensions.map(function (cosa) {
                if (year_checkbox)
                    y[cosa].domain([0, max + 2])
                else {
                    y[cosa].domain([0, max_dict[cosa]+ 2])
                }
                try {
                    return [x(cosa), y[cosa](dataset_dict_giusto[d][cosa])]
                }
                catch (error) {
                    return [x(cosa), y[cosa](0)]
                }
            }))
        }
    }
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.



        keys.push("AVG")
        // Draw the lines
        svgParallel
            .selectAll("myPath")
            .data(keys)
            .enter()
            .append("path")
            .attr("class", function (d) { return "line" + d.replace(/ /g, '') })
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                if (d == "AVG")
                    return "red"
                else
                    return "#2c7bb6"
            })
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
            .each(function (d) { d3.select(this).call(y[d].brush); d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) { return d.toString().replace("_Damage",""); })
            .style("fill", "black")
            

            function brushPar(year) {
                //console.log(high,year)
                var anno = dict_dataset_dict[year]
                var brushed_area = d3.brushSelection(this)

                // filter brushed extents
                for (var d in anno) {
                    var _y = y[year](anno[d][map_key])
                    if (between(_y,Math.min(...brushed_area),Math.max(...brushed_area) ) )
                    brushed_par.push(d)
                }
                // first every group turns grey NOT WORKI
                svgParallel.selectAll("path")
                    .filter(function (d, i) {
                        return d != null && ! brushed_par.includes(d)
                    })
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.1")
                // Second the hovered specie takes its colorParallel
                brushed_par.forEach(d => {
                    // Second the hovered specie takes its colorParallel
                    svgParallel.selectAll(".line" + d.replace(/ /g, ''))
                        .transition().duration(200)
                        .style("stroke", "black")
                        .style("opacity", "1")
                });

                brush_mds(brushed_par)
                brushScatter(brushed_par, true)
                brushMap(brushed_par, "brush")


            }

        function brush_end(year) {
            svgParallel.selectAll("path")
                .filter(function (d, i) {
                    return d != null
                })
                .transition().duration(200)
                .style("stroke", function (d) {
                    if (d == "AVG")
                        return "red"
                    return "#2c7bb6"
                })
                .style("opacity", "1")
            brushMap([], "unbrush")
            unbrush_mds()
            brushScatter(brushed_points, false)

            brushed_par = []
            mtooltip.transition()
                .duration(500)
                .style("opacity", 0);

            //clearing brush
            var brush = y[year].brush
            //d3.select(this).call(brush.move, null);
        }
    })


}

function between(x, _min, _max) {
    return x >= _min && x <= _max;
  }

parallelCoord(aggregationType, map_key)
