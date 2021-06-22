var margin = { top: 25, right: -230, bottom: 50, left: 30 };
var width = document.getElementById("scatter").clientWidth + margin.left + margin.right
var height = document.getElementById("scatter").clientHeight - margin.top - margin.bottom

console.log("scat", height, "h", width)

var dbNames = {
    "crashCountry": "Crash.Country",
    "fatal": "Total.Fatal.Injuries",
    "serious": "Total.Serious.Injuries",
    "minor": "Total.Minor.Injuries",
    "uninjured": "Total.Uninjured",
    "weather": "Weather.Condition",
    "phase": "Broad.Phase.of.Flight"
}

function triggeraSlider() {
    var slider = document.getElementById("slider");
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    slider.dispatchEvent(evt)
}

var n_w = (width + margin.left + margin.right) * 1.5
var n_h = (height + margin.top + margin.bottom) * 1.5
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", /* n_w + */ '100%')
    .attr("height", /* n_h + */ '100%')
    //.attr("viewBox", "0 0 1100 600")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xscale = d3.scaleLinear()
    .range([0, width]);

var yscale = d3.scaleLinear()
    .range([height, 0]);

var radius = d3.scaleLinear()
    .range([2, 8]);

var xAxis = d3.axisBottom()
    .tickSize(-height)
    .scale(xscale);

var yAxis = d3.axisLeft()
    .tickSize(-width)
    .scale(yscale)



function isPercentage(elem) {
    return elem == "VMC" || elem == "IMC" || elem.includes("Damage")
}

//IN PROGRESS
/* Create HTML for mouseover */
function createMousoverHtml(d) {

    var html = "";
    html += "<div class=\"tooltip_kv\">";
    html += "<span class=\"tooltip_key\">";
    html += d['Item'];
    html += "</span><br>";
    html += "<span class=\"tooltip_value\">";
    html += "<a>Total Accidents: "
    try {
        html += (d["Total_Accidents"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Fatalities: "
        html += (d["Fatal"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Serious Injuries: "
        html += (d["Serious"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Minor Injuries: "
        html += (d["Minor"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Uninjured: "
        html += (d["Uninjured"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>VMC: "
        html += (d["VMC"]);
        html += " IMC: "
        html += (d["IMC"]);
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Destroyed: "
        html += (d["Destroyed_Damage"]);
        html += " Substantial: "
        html += (d["Substantial_Damage"]);
        html += " Minor: "
        html += (d["Minor_Damage"]);
    }
    catch (error) {
        html = html.replace("<a>Total Accidents: ", "")
        html += "<a>Total Accidents: 0"
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Fatalities: 0"
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Serious Injuries: 0"
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Minor Injuries: 0"
        html += "</a>";
        html += "</span><br>";
        html += "<span class=\"tooltip_value\">";
        html += "<a>Uninjured: 0"
    }
    html += "</a>";
    html += "</span><br>";
    html += "</div>";
    $("#tooltip-container-scatter").html(html);
    $(this).attr("fill-opacity", "0.8");
    $("#tooltip-container-scatter").show();

    //quello commentato ha senso, ma scaja
    //var map_width = document.getElementById('scatter').getBoundingClientRect().width;
    var map_width = $('scatter')[0].getBoundingClientRect().width;
    console.log($('scatter'))

    console.log('LAYER X ' + d3.event.layerX)
    console.log('LAYER Y ' + d3.event.layerY)

    if (d3.event.layerX < map_width / 2) {
        d3.select("#tooltip-container-scatter")
            .style("top", (d3.event.layerY + 15) + "px")
            .style("left", (d3.event.layerX + 15) + "px");
    } else {
        var tooltip_width = $("#tooltip-container-scatter").width();
        d3.select("#tooltip-container-scatter")
            .style("top", (d3.event.layerY + 15) + "px")
            .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
    }
}


function brushScatter(brushed_points, highlighting) {
    var aggr = document.getElementById("aggregationType").value;
    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
        if (highlighting) {
            tobebrushed = true
            brushedPoints = brushed_points
            d3.selectAll(".bubble")
                .style("opacity", 0.1)
                .filter(function (d) { return brushed_points.includes(d.Item); })
                .style("opacity", 1);
        }
        else {
            tobebrushed = false
            d3.selectAll(".bubble")
                .style("opacity", 1)
        }
    })
}


var brushedPoints = []
var tobebrushed = false

var aggregationType = document.getElementById("aggregationType").value
var X = document.getElementById("X_axis").value
var Y = document.getElementById("Y_axis").value
var R = document.getElementById("R_axis").value
var yearInput = document.getElementById("slider").value
var aggregated_by_year = document.getElementById("aggregationYear").value
var mds_type_value = document.getElementById("mdsType").value
function changing(aggregationType, X, Y, R, year, aggregated_by_year) {

    //console.log('Chiamata changing con parametri: ' + aggregationType, X, Y, R)
    var aggr = document.getElementById("aggregationType");
    aggr.onchange = function () {
        aggregationType = aggr.value
        //console.log('CHIAMO CON X Y Z: ', X, Y, R)
        changing(aggregationType, X, Y, R, yearInput, aggregated_by_year)
        createMDS(yearInput, 0, 0, aggregated_by_year, aggregationType, mds_type_value)

    }
    d3.select("#aggregationYear")
        .on("change", function () {
            var year_bool = d3.select(this).node().value;
            console.log("scatter", year_bool)
            changing(aggregationType, X, Y, R, yearInput, year_bool)
            createMDS(yearInput, 0, 0, year_bool, aggregationType, mds_type_value)

        })

    var mdsType = document.getElementById("mdsType");
    mdsType.onchange = function () {
        mds_type_value = mdsType.value
        createMDS(yearInput, 0, 0, aggregated_by_year, aggregationType, mds_type_value)

    }

    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {


        function scatter_visualization(yearInput, aggregationType) {

            dataset_dict = change(data, aggregationType, yearInput, aggregated_by_year)
            //console.log("ciao",e)
            //e = change(yearInput);
            var i
            keys = Object.keys(dataset_dict),
                i, len = keys.length;
            keys.sort(function (a, b) {
                return a - b;
            });
            //console.log('CHIAVI: ' + keys)
            var xmax = -1
            var ymax = -1
            var rmax = -1
            var come_vuole_lui = []

            //check max values to rescale axis
            //console.log(e)
            for (var elem in dataset_dict) {
                //console.log(keys[key])
                //console.log(e[elem])

                dataset_dict[elem].x = +dataset_dict[elem][X]

                dataset_dict[elem].y = +dataset_dict[elem][Y]
                dataset_dict[elem].r = +dataset_dict[elem][R]


                if (isPercentage(X) || isPercentage(Y) || isPercentage(R)) {
                    dataset_dict[elem].x = +(+dataset_dict[elem].x / +dataset_dict[elem]["Total_Accidents"]) * 100;
                    dataset_dict[elem].y = +(+dataset_dict[elem].y / +dataset_dict[elem]["Total_Accidents"]) * 100;
                    dataset_dict[elem].r = +(+dataset_dict[elem].r / +dataset_dict[elem]["Total_Accidents"]) * 100;
                }

                //console.log("x normalizzato =", dataset_dict[elem].x, "x originale = ", dataset_dict[elem][X], "total =", dataset_dict[elem]["Total_Accidents"])
                if (dataset_dict[elem]["x"] > xmax)
                    xmax = +dataset_dict[elem]["x"]
                if (dataset_dict[elem]["y"] > ymax)
                    ymax = +dataset_dict[elem]["y"]
                if (dataset_dict[elem]["r"] > rmax)
                    rmax = +dataset_dict[elem]["r"]
                come_vuole_lui.push(dataset_dict[elem])

            }
            //scale the axis to the correct values
            yscale.domain([0, ymax]).nice();
            xscale.domain([0, xmax]).nice();
            radius.domain([0, rmax]).nice();

            function returnRange(nuovaXY, axis) {
                var xmax = -1

                for (var elem in dataset_dict) {
                    //console.log(axis)
                    //console.log(nuovaXY)
                    //console.log(dataset_dict[elem])
                    if (isPercentage(nuovaXY)) {
                        dataset_dict[elem][axis] = +(+dataset_dict[elem][nuovaXY] / +dataset_dict[elem]["Total_Accidents"]) * 100;
                    }
                    else
                        dataset_dict[elem][axis] = +dataset_dict[elem][nuovaXY]
                    //console.log('E ELEM AXIS: ' + dataset_dict[elem][axis])
                    if (dataset_dict[elem][axis] > xmax)
                        xmax = +dataset_dict[elem][axis]
                }
                console.log('MAX: ' + xmax)
                if (axis == "r")
                    return xmax
                return xmax + 10
            }

            function yChange() {
                Y = this.value // get the new y value
                console.log('NUOVA Y: ' + Y)
                console.log('VECCHIA X: ' + X)
                yscale.domain([0, returnRange(Y, "y")]).nice()
                yAxis.scale(yscale) // change the yScale
                d3.select('#yAxis') // redraw the yAxis
                    .transition().duration(1000)
                    .call(yAxis)
                d3.select('#yAxisLabel') // change the yAxisLabel
                    .transition().duration(1000)
                    .text(Y)
                d3.selectAll('g.bubble') // move the circles
                    .transition().duration(1000)
                    .delay(function (d, i) { return i * 10 })
                    .attr("transform", function (d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")" });
                triggeraSlider()
            }


            function xChange() {

                X = this.value // get the new y value
                console.log('NUOVA X: ' + X)
                console.log('VECCHIA Y: ' + Y)
                xscale.domain([0, returnRange(X, "x")]).nice()
                xAxis.scale(xscale) // change the yScale
                d3.select('#xAxis') // redraw the yAxis
                    .transition().duration(1000)
                    .call(xAxis)
                d3.select('#xAxisLabel')
                    .transition().duration(1000)// change the yAxisLabel
                    .text(X)
                d3.selectAll('g.bubble') // move the circles
                    .transition().duration(1000)
                    .delay(function (d, i) { return i * 10 })
                    .attr("transform", function (d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")" });

                triggeraSlider()

            }

            function rChange() {
                R = this.value // get the new y value
                console.log('NUOVA R: ' + R)
                radius.domain([0, returnRange(R, "r")]).nice()

                d3.selectAll('.circle_scatter') // move the circles
                    .transition().duration(1000)
                    .delay(function (d, i) { return i * 10 })
                    .attr("r", function (d) { return radius(d.r) * 5; })
                triggeraSlider()
            }


            var X_axis = document.getElementById("X_axis");
            X_axis.onchange = xChange
            var Y_axis = document.getElementById("Y_axis");
            Y_axis.onchange = yChange
            var R_axis = document.getElementById("R_axis");
            R_axis.onchange = rChange
            //cancello
            svg.selectAll("g").remove();
            svg.selectAll("text").remove();

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "x axis")
                .attr('id', 'xAxis')
                .transition().duration(1000)
                .call(xAxis);
            svg.append("g")
                .attr("transform", "translate(0,0)")
                .attr("class", "y axis")
                .attr('id', 'yAxis')
                .transition().duration(1000)
                .call(yAxis);

            var group = svg.selectAll("g.bubble")
                .data(come_vuole_lui)
                .enter().append("g")
                .attr("class", "bubble")
                .attr("transform", function (d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")" })
                .on("mouseover", function (d) {
                    mouse_on(d.Item);
                    mouseon_mds(d.Item);
                    brushMap([d.Item], "mouseon")
                })
                .on("mouseout", function (d) {
                    mouse_out()
                    mouseout_mds(d.Item)
                    brushMap([d.Item], "mouseout")

                    /* $(this).attr("fill-opacity", "1.0");
                    $("#tooltip-container-scatter").hide(); */
                });

            var j = -1
            var color = d3.scaleOrdinal(d3.schemeCategory20)




            //very simple hash
            function hashStr(str) {
                var hash = 0;
                for (var i = 0; i < str.length; i++) {
                    var charCode = str.charCodeAt(i);
                    hash += charCode;
                }
                return parseFloat('0.' + hash)
            }

            var rgbToHex = function (rgb) {
                var hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = "0" + hex;
                }
                return hex;
            };

            var fullColorHex = function (rgb) {
                //console.log(rgb)
                //rgb(255, 0, 0)
                var stringone = angryRainbow(hashStr(rgb)).split('(')[1].split(',')
                //console.log(stringone)
                var red = rgbToHex(stringone[0]);
                var green = rgbToHex(stringone[1].split(' ')[1]);
                var blue = rgbToHex(stringone[2].split(')')[0]);
                //console.log(red+green+blue)
                return '#' + red + green + blue;
            };

            var angryRainbow = d3.scaleSequential(t => d3.hsl(t * 360, 1, 0.5).toString())
            //console.log(angryRainbow(hashStr('Alabama')),angryRainbow(hashStr('Indiana')),angryRainbow(hashStr('Florida')))
            //var color = d3.scaleSequential(hashStr);
            //console.log(color)

            //const scale = d3.scaleSequential(hashStr);
            //console.log(color())
            //const before = scale(0.5);
            //const range = scale.range();
            //scale.range(range); // uses the same extrema, but resets the interpolator
            //const after = scale(0.5);
            //console.log(before, after, range);



            //const scale = d3.scaleSequential(d3.interpolateSinebow); // same as t1
            //const interpolator = scale.hashStr();
            //console.log(interpolator('Alabama'))
            legendlist = []
            group.append("circle")
                .transition().duration(1000)
                .attr("r", function (d) { return radius(d.r) * 5; })
                .style("fill", function (d) {
                    j++
                    color(keys[j]);
                    legendlist.push(keys[j])
                    //console.log(angryRainbow(hashStr(keys[j])),color(keys[j]))
                    return angryRainbow(hashStr(keys[j]));

                    //return color(angryRainbow(hashStr(keys[j])));
                })
                .attr("class", "circle_scatter")


            //color.domain().sort(function (a, b) { return dataset_dict[b].r - dataset_dict[a].r })
            legendlist.sort(function(a,b){return dataset_dict[b].r - dataset_dict[a].r})


            if (tobebrushed) {
                d3.selectAll(".bubble")
                    .style("opacity", 0.1)
                    .filter(function (d) { return brushedPoints.includes(d.Item); })
                    .style("opacity", 1);
            }
            j = -1

            group.append("text")
                .attr("r", function (d) { return radius(d.r); })
                .attr("alignment-baseline", "middle")
                .style("white-space", "pre-line")
                .text(function (d) {
                    j++
                    //console.log(d)
                    //return zuppa(d);
                    return keys[j];
                });

            svg.append("text")
                .attr("x", width - 2)
                .attr("y", height - 6)
                .attr("class", "axis")
                .attr('id', 'xAxisLabel')
                .text(X);
                console.log(X)

            svg.append("text")
                .attr("x", 6)
                .attr("y", -2)
                .attr("text-anchor", "end")
                .attr("class", "axis")
                .attr('id', 'yAxisLabel')
                .text(Y);

            //console.log(color.domain())

            var div = svg.append("g")
                .attr("id", "legendaScatter")
                .style('overflow', 'visible')
                .attr("class", "legenda")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var legend = div.selectAll(".legenda")
                //.data(color.domain().sort(function (a, b) { return dataset_dict[b].r - dataset_dict[a].r }))
                .data(legendlist)
                .enter().append("g")
                .attr("class", "legendina")
                .attr("transform", function (d, i) { return "translate(2," + i * 14 + ")"; });

            //console.log(color.domain(),color)
            //console.log(color(1),angryRainbow(1))

            legend.append("rect")
                .attr("x", width)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", fullColorHex);
            legend.append("text")
                .attr("x", width + 16)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function (d) { return d; });

            legend.on("mouseover", function (type) {
                j = -1
                d3.selectAll(".legendina")
                    .style("opacity", 0.1);
                d3.select(this)
                    .style("opacity", 1);
                d3.selectAll(".bubble")
                    .style("opacity", 0.1)
                    .filter(function (d) { j++; return keys[j] == type; })
                    .style("opacity", 1);
                mouse_on(type);
                mouseon_mds(type);
                brushMap([type], "mouseon")
            })
                .on("mouseout", function (type) {
                    d3.selectAll(".legendina")
                        .style("opacity", 1);
                    d3.selectAll(".bubble")
                        .style("opacity", 1);
                    mouse_out()
                    mouseout_mds(type)
                    brushMap([type], "mouseout")
                });


        }
        //console.log(data)
        //e = change(data, 'Crash.Country', 2000, false)
        scatter_visualization(year, aggregationType)
        //get input from slider
        d3.select("#slider")
            .on("change", function () {
                yearInput = +d3.select(this).node().value

                createMDS(yearInput, 0, 0, aggregated_by_year, aggregationType, mds_type_value)

                scatter_visualization(yearInput, aggregationType)
                /*
                                d3.selectAll('circle') // move the circles
                                    .transition().duration(1000)
                                    .attr("r", function (d) { return radius(d.r) * 0; })
                                    .on("end", function (d) {
                                        scatter_visualization(yearInput, aggregationType)
                                    });
                                d3.select('#xAxis') // redraw the xAxis
                                    .transition().duration(1000)
                                    .call(xAxis)
                                d3.select('#yAxis') // redraw the yAxis
                                    .transition().duration(1000)
                                    .call(yAxis)*/
            })
    });
}
changing(aggregationType, X, Y, R, yearInput, aggregated_by_year)