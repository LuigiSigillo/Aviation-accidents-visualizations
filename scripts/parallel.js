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

    
function between(x, _min, _max) {
    return x >= _min && x <= _max;
  }

// Parse the Data
var map_key
d3version3.selectAll(".checkbox").each(function (d) {
    cb = d3.select(this);
    grp = cb.property("value")
    if (cb.property("checked"))
        map_key = grp
})
var aggregationType = document.getElementById("aggregationType").value

var brushed_par = []
var dict_dataset_dict = {}
// var json_media = { "Item": "AVG", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
// var json_media_brush = { "Item": "AVG_BRUSH", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
function parallelCoord(aggregationType, map_key) {
    svgParallel.selectAll("path").remove()
    svgParallel.selectAll("g").remove()
    var year_checkbox = document.getElementById("year_normalized_checkbox").checked
    valerione = document.getElementById("others_checkbox").checked
    percentage = document.getElementById("percentage_checkbox").checked
    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
        // var yearInput = document.getElementById("slider").value

        dataset_dict = change(data, aggregationType, 2020, false)
        var i = 0
        keys = Object.keys(dataset_dict),
            i, len = keys.length;
        keys.sort(function (a, b) {
            return a - b;
        });

        dimensions = Array.from({ length: 20 }, (x, i) => 2001 + i);
        if (valerione)
            dimensions = ["Total_Accidents","Fatal", "Serious", "Minor", "Uninjured", "VMC", "IMC", "Minor_Damage", "Substantial_Damage", "Destroyed_Damage"]
        if (valerione && percentage)
            dimensions = ["Total_Accidents","Fatal", "Serious", "Minor", "Uninjured", "VMC", "IMC", "Minor_Damage", "Substantial_Damage", "Destroyed_Damage","Death_Rate","Survival_Rate"]



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
                if (d== null)
                    return false
                else
                    if (d == "AVG" || d =="AVG_BRUSH")
                        return false
                return !brushed_par.includes(d) 
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
                    if (d == "AVG")
                        return "red"
                    if (d == "AVG_BRUSH" && brushed_par.length != 0)
                        return "orange"
                    if (d == "AVG_BRUSH" && brushed_par.length == 0)
                        return "transparent"
                    if (d != null && brushed_par.includes(d))
                        return "black"
                    if (brushed_par.length == 0) {
                        return "#2c7bb6"
                    }
                    return "lightgrey"
                })
                .style("opacity", function (d) {
                    if (d == "AVG" || d == "AVG_BRUSH")
                        return "1"
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
            res = count / keys.length
            if (m_k.includes("Rate") || percentage || aggregationType =="Make")
                res = count/i
            return [max,res ]
        }
        
    function calculateAVGDynamic(dataset_dict,m_k=map_key) {
        var count = 0
        var i = 0
        for (var elem in dataset_dict) {
            if(brushed_par.includes(elem)) {
                count += dataset_dict[elem][m_k]
                i += 1
            }
        }
        res = count/brushed_par.length
        if (!Number.isNaN(res))
            return res
        else
            return 0
    }
        dict_dataset_dict = {}
        var max = 0
        var max_dict = {}
        if (!valerione) {
            dimensions.map(function (year) {
                dict_dataset_dict[year] = change(data, aggregationType, year, true)
                if (percentage){
                    dict_dataset_dict[year] = convert_to_percentage(dict_dataset_dict[year])
                }
                if(brushed_par.length!=0){
                    avg_brush = calculateAVGDynamic(dict_dataset_dict[year])
                    dict_dataset_dict[year]["AVG_BRUSH"] = { "Item": "AVG_BRUSH", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
                    dict_dataset_dict[year]["AVG_BRUSH"][map_key] = avg_brush
                }
                var results = calc_max(dict_dataset_dict[year])
                var nuov_max = results[0]
                var avg = results[1]
                max_dict[year] = nuov_max
                dict_dataset_dict[year]["AVG"] = { "Item": "AVG", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
                dict_dataset_dict[year]["AVG"][map_key] = avg
                if (max < nuov_max)
                    max = nuov_max
            })

            function path(d) {
                return d3.line()(dimensions.map(function (year) {
                    dataset_dict = dict_dataset_dict[year]
                    if (year_checkbox)
                        y[year].domain([0, max])
                    else
                        y[year].domain([0, max_dict[year]])

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
            var aggregated_by_year = document.getElementById("aggregationYear").checked;
            //var dataset_dict_giusto = change(data, aggregationType, year, aggregated_by_year)

            dimensions.map(function (cosa) {//cosa = IMC VMC ETC.
                dict_dataset_dict[cosa] = change(data, aggregationType, year, aggregated_by_year)
                if (percentage){
                    dict_dataset_dict[cosa] = convert_to_percentage(dict_dataset_dict[cosa])
                }
                if(brushed_par.length!=0){
                    avg_brush = calculateAVGDynamic(dict_dataset_dict[cosa],cosa)
                    dict_dataset_dict[cosa]["AVG_BRUSH"] = { "Item": "AVG_BRUSH", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
                    dict_dataset_dict[cosa]["AVG_BRUSH"][cosa] = avg_brush

                }
                var results = calc_max(dict_dataset_dict[cosa],cosa)
                var nuov_max = results[0]
                var avg = results[1]
                max_dict[cosa] = nuov_max
                dict_dataset_dict[cosa]["AVG"] = { "Item": "AVG", "Total_Accidents":NaN,"Fatal":NaN,"Serious":NaN,"Minor":NaN,"Uninjured":NaN,"VMC":NaN,"IMC":NaN,"Destroyed_Damage":NaN,"Substantial_Damage":NaN,"Minor_Damage":NaN,"Survival_Rate":NaN,"Death_Rate":NaN}
                

                dict_dataset_dict[cosa]["AVG"][cosa] = avg

                if (max < nuov_max)
                    max = nuov_max
            })
            

        function path(d) {
            return d3.line()(dimensions.map(function (cosa) {
                dataset_dict = dict_dataset_dict[cosa]

                if (year_checkbox)
                    y[cosa].domain([0, max])
                else {
                    y[cosa].domain([0, max_dict[cosa]])
                }

                try
                {
                    y_elem = dataset_dict[d][cosa]
                }
                catch(error){
                    y_elem = 0
                }
                    return [x(cosa), y[cosa](y_elem)]
            }))
        }
    }
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.

        function convert_to_percentage(dataset_dict) {
            var count = 0
            for (elem in dataset_dict) {

                for (v in dataset_dict[elem]){
                    if (v=="Death_Rate" || v=="Survival_Rate") 
                        continue
                    if(v =="Serious" || v =="Fatal" || v =="Uninjured"||v =="Minor") 
                        dataset_dict[elem][v] = +(+dataset_dict[elem][v] / +dataset_dict[elem]["Total_Passangers"]) * 100;
                    if(v=="Total_Accidents")
                        count+= dataset_dict[elem]["Total_Accidents"]
                    else
                        dataset_dict[elem][v] = (dataset_dict[elem][v] / dataset_dict[elem]["Total_Accidents"]) * 100;
                        
                }
            }
            for (elem in dataset_dict) {

                for (v in dataset_dict[elem]){
                    if(v=="Total_Accidents")
                        dataset_dict[elem][v] = (dataset_dict[elem][v] / count) * 100;
                }
            }
            return dataset_dict
        }

        keys.push("AVG")
        if (brushed_par.length!=0)
            keys.push("AVG_BRUSH")
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
                if (d == "AVG_BRUSH")
                    return "orange"
                if (brushed_par.includes(d))
                    return "black"
                return "#2c7bb6"
            })
            .style('stroke-width', "3")
            .style("opacity", function (d) {
                if (d == "AVG" || d == "AVG_BRUSH")
                    return "1"
                if (d != null && brushed_par.includes(d))
                    return "1"
                if (brushed_par.length == 0)
                    return "1"
                return "0.1"
            })
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
            .text(function (d) {
                d3.select(this).style("font-size", 15)
                return d.toString().replace("_Damage",""); })
            .style("fill", "black")

            

            function brushPar(year) {
                var anno = dict_dataset_dict[year]
                brushed_par = []

                var brushed_area = d3.brushSelection(this)

                // filter brushed extents
                for (var d in anno) {
                    if(valerione)
                        var _y = y[year](anno[d][year])
                    else
                        var _y = y[year](anno[d][map_key])
                    if (between(_y,Math.min(...brushed_area),Math.max(...brushed_area) ) )
                        brushed_par.push(d)
                }
                // first every group turns grey NOT WORKI
                svgParallel.selectAll("path")
                    .filter(function (d, i) {
                        if (d == "AVG" || d =="AVG_BRUSH")
                            return false
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
                        .style("stroke", function(d){
                            d3.select(this).raise().classed("active", true);
                            return "black"
                        })
                        .style("opacity", "1")
                });

                parallelCoord(aggregationType,map_key)
                brush_mds(brushed_par)
                brushScatter(brushed_par, true)
                brushMap(brushed_par, "brush")
                brush_legendina(brushed_par)


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
                    if (d == "AVG_BRUSH")
                        return "orange"
                    return "#2c7bb6"
                })
                .style("opacity", "1")
            brushMap([], "unbrush")
            unbrush_mds()
            unbrush_legendina()
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

parallelCoord(aggregationType, map_key)
