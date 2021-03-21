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

var radius = d3.scaleSqrt()
    .range([2, 8]);

var xAxis = d3.axisBottom()
    .tickSize(-height)
    .scale(xscale);

var yAxis = d3.axisLeft()
    .tickSize(-width)
    .scale(yscale)

var aggregationType = "aggregated_state"

function changing(aggregationType) {
    
    d3.json("datasets/" + aggregationType + ".json", function (error, data) {

        //console.log(data);
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
        var X = 'Incidents'
        var Y = 'Total.Fatal.Injuries'
        var R = 'Total.Serious.Injuries'

        for (var key in data) {
            //console.log(data[key])
            //var d=data[key]

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
        //console.log(data)
        //console.log(keys)
        //console.log(come_vuole_lui)
        //data.sort(function (a, b) { console.log(a); return b.r - a.r; });
        /*yscale.domain(d3.extent(d3.values(data, function (d) {
            console.log('aaa')
            return d.y;
        }))).nice();
        */
        yscale.domain([0, ymax]).nice();
        xscale.domain([0, xmax]).nice();
        radius.domain([0, rmax]).nice();
        
        //cancello
        svg.selectAll("g").remove();
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis")
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(0,0)")
            .attr("class", "y axis")
            .call(yAxis);

        
        var group = svg.selectAll("g.bubble")
            .data(come_vuole_lui)
            .enter().append("g")
            .attr("class", "bubble")
            .attr("transform", function (d) { return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")" });
        var j = -1
        var color = d3.scaleCategory20();

        group.append("circle")
            .attr("r", function (d) { return radius(d.r); })
            .style("fill", function (d) {
                //console.log(d)
                j++
                return color(keys[j]);
            })
        j = -1

        group.append("text")
            .attr("x", function (d) { return radius(d.r); })
            .attr("alignment-baseline", "middle")
            .text(function (d) {
                j++
                return keys[j];
            });

        svg.append("text")
            .attr("x", 6)
            .attr("y", -2)
            .attr("class", "label")
            .text("Fatalities");

        svg.append("text")
            .attr("x", width - 2)
            .attr("y", height - 6)
            .attr("text-anchor", "end")
            .attr("class", "label")
            .text("Incidents");
        
        //svg.selectAll(".legend").remove()

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

changing(aggregationType)