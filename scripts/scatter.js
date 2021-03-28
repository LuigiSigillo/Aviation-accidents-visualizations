var margin = { top: 30, right: 10, bottom: 100, left: 20 };
var width = 1100 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
/* height = document.getElementById('scatter').getBoundingClientRect()["height"]
width = document.getElementById('scatter').getBoundingClientRect()["width"]
console.log("scat",height,"h",width)
 */
var dbNames = {
    "crashCountry": "Crash.Country",
    "fatal": "Total.Fatal.Injuries",
    "serious": "Total.Serious.Injuries",
    "minor": "Total.Minor.Injuries",
    "uninjured": "Total.Uninjured",
    "weather": "Weather.Condition",
    "phase": "Broad.Phase.of.Flight"
}



var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xscale = d3.scaleLinear()
    .domain([0, 800])
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





//IN PROGRESS
function zuppa(d) {
    //console.log(d)
    s = ""
    for (var key in d) {
        if (key == "Weather.Condition" || key == "Broad.Phase.of.Flight" || key == "Aircraft.Damage") {
            s += key + ":\n"
            for (var k in d[key])
                s += ("\t" + k + " " + d[key][k] + "\n")
        }
    }
    console.log(s)
    return s
}


var aggregationType = "Crash.Country"
var X = 'Total_Accidents'
var Y = 'Fatal'
var R = 'Serious'
var yearInput = 2000

function changing(aggregationType, X, Y, R, year) {

    //console.log('Chiamata changing con parametri: ' + aggregationType, X, Y, R)
    var aggr = document.getElementById("aggregationType");
    aggr.onchange = function () {
        aggregationType = aggr.value
        console.log('CHIAMO CON X Y Z: ', X, Y, R)
        changing(aggr.value, X, Y, R, yearInput)
    }


    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {


        function scatter_visualization(yearInput, aggregationType) {

            dataset_dict = change(data, aggregationType, yearInput, false)
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
                //console.log(e[elem])
                dataset_dict[elem].x = +dataset_dict[elem][X];
                //data[key].x = +e[key][X];

                dataset_dict[elem].y = +dataset_dict[elem][Y];
                dataset_dict[elem].r = +dataset_dict[elem][R];
                if (dataset_dict[elem]["x"] > xmax)
                    xmax = dataset_dict[elem]["x"]
                if (dataset_dict[elem]["y"] > ymax)
                    ymax = dataset_dict[elem]["y"]
                if (dataset_dict[elem]["r"] > rmax)
                    rmax = dataset_dict[elem]["r"]
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
                    dataset_dict[elem][axis] = +dataset_dict[elem][nuovaXY]
                    //console.log('E ELEM AXIS: ' + dataset_dict[elem][axis])
                    if (dataset_dict[elem][axis] > xmax)
                        xmax = dataset_dict[elem][axis]
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
                yscale.domain([0, returnRange(Y, "y")])
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
            }


            function xChange() {

                X = this.value // get the new y value
                console.log('NUOVA X: ' + X)
                console.log('VECCHIA Y: ' + Y)
                xscale.domain([0, returnRange(X, "x")])
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
            }

            function rChange() {
                R = this.value // get the new y value
                console.log('NUOVA R: ' + R)
                radius.domain([0, returnRange(R, "r")])

                d3.selectAll('circle') // move the circles
                    .transition().duration(1000)
                    .delay(function (d, i) { return i * 10 })
                    .attr("r", function (d) { return radius(d.r) * 10; })
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
                .on("mouseover", function (d) {createMousoverHtml(d);})

            var j = -1
            var color = d3.scaleOrdinal(d3.schemeCategory20)

            group.append("circle")
                .transition().duration(1000)
                .attr("r", function (d) { return radius(d.r) * 10; })
                .style("fill", function (d) {
                    j++
                    return color(keys[j]);
                })
                

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
                .attr("x", 6)
                .attr("y", -2)
                .attr("class", "axis")
                .attr('id', 'yAxisLabel')
                .text(X);

            svg.append("text")
                .attr("x", width - 2)
                .attr("y", height - 6)
                .attr("text-anchor", "end")
                .attr("class", "axis")
                .attr('id', 'xAxisLabel')
                .text(Y);

            //console.log(color.domain())
            var legend = svg.selectAll(".legend")
                .data(color.domain().sort(function (a,b) {return dataset_dict[b].r -dataset_dict[a].r}))
                .enter().append("g")
                .attr("class", "legendina")
                .attr("transform", function (d, i) { return "translate(2," + i * 14 + ")"; });


            legend.append("rect")
                .attr("x", width)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", color);

            legend.append("text")
                .attr("x", width + 16)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function (d) { return d; });

            legend.on("mouseover", function (type) {
                j = -1
                d3.selectAll(".legend")
                    .style("opacity", 0.1);
                d3.select(this)
                    .style("opacity", 1);
                d3.selectAll(".bubble")
                    .style("opacity", 0.1)
                    .filter(function (d) { j++; return keys[j] == type; })
                    .style("opacity", 1);
            })
                .on("mouseout", function (type) {
                    d3.selectAll(".legend")
                        .style("opacity", 1);
                    d3.selectAll(".bubble")
                        .style("opacity", 1);
                });


        }
        //console.log(data)
        //e = change(data, 'Crash.Country', 2000, false)
        scatter_visualization(year, aggregationType)
        //get input from slider
        d3.select("#slider")
            .on("change", function () {
                yearInput = +d3.select(this).node().value

                createMDS(yearInput, 0, 0)
                           
                scatter_visualization(yearInput,aggregationType)
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
changing(aggregationType, X, Y, R, yearInput)