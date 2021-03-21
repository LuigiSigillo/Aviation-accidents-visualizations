var margin = { top: 30, right: 220, bottom: 40, left: 50 };
var width = 1560 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;

var dbNames = {
    "crashCountry": "Crash.Country",
    "fatal": "Total.Fatal.Injuries",
    "serious": "Total.Serious.Injuries",
    "minor": "Total.Minor.Injuries",
    "uninjured": "Total.Uninjured",
    "weather": "Weather.Condition",
    "phase": "Broad.Phase.of.Flight"
}

var svg = d3.select("body")
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




var aggregationType = "aggregated_state"
var X = 'Incidents'
var Y = 'Total.Fatal.Injuries'
var R = 'Total.Serious.Injuries'


function zuppa(d) {
    //console.log(d)
    s = ""
    for (var key in d) {
        if (key == "Weather.Condition" || key == "Broad.Phase.of.Flight" || key == "Aircraft.Damage") {
            s += key + ":\n"
            for (var k in d[key])
                s += ("\t"+k + " " + d[key][k] + "\n")
        }
    }

    console.log(s)
    return s
}

function changing(aggregationType, X, Y, R) {

    var aggr = document.getElementById("aggregationType");
    aggr.onchange = function () {
        aggregationType = aggr.value
        console.log(X, Y, R)
        changing(aggr.value, X, Y, R)
    }


    d3.json("datasets/" + aggregationType + ".json", function (error, data) {
        // data pre-processing
        var i
        keys = Object.keys(data),
            i, len = keys.length;
        keys.sort(function (a, b) {
            return a - b;
        });
        console.log(keys.length)
        var xmax = -1
        var ymax = -1
        var rmax = -1
        var come_vuole_lui = []


        for (var key in data) {

            data[key].x = +data[key][X];
            data[key].y = +data[key][Y];
            data[key].r = +data[key][R];
            if (data[key]["x"] > xmax)
                xmax = data[key]["x"]
            if (data[key]["y"] > ymax)
                ymax = data[key]["y"]
            if (data[key]["r"] > rmax)
                rmax = data[key]["r"]
            come_vuole_lui.push(data[key])
        }

        yscale.domain([0, ymax]).nice();
        xscale.domain([0, xmax]).nice();
        radius.domain([0, rmax]).nice();


        function returnRange(nuovaXY, axis) {
            var xmax = -1
            for (var key in data) {
                data[key][axis] = +data[key][nuovaXY];
                if (data[key][axis] > xmax)
                    xmax = data[key][axis]
            }
            if (axis == "r")
                return xmax
            return xmax + 10
        }

        function yChange() {
            Y = this.value // get the new y value
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
            console.log(R)
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
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(0,0)")
            .attr("class", "y axis")
            .attr('id', 'yAxis')
            .call(yAxis);


        var group = svg.selectAll("g.bubble")
            .data(come_vuole_lui)
            .enter().append("g")
            .attr("class", "bubble")
            .attr("transform", function (d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")" });
        var j = -1
        var color = d3.scaleCategory20();

        group.append("circle")
            .attr("r", function (d) { return radius(d.r) * 10; })
            .style("fill", function (d) {
                j++
                return color(keys[j]);
            })
        j = -1

        group.append("text")
            .attr("r", function (d) { return radius(d.r); })
            .attr("alignment-baseline", "middle")
            .style("white-space","pre-line")
            .text(function (d) {
                j++
                //console.log(d)
                //return zuppa(d);
                return keys[j];;
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
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
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
    });
}

changing(aggregationType, X, Y, R)