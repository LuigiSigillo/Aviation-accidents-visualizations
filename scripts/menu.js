/* Create HTML for mouseover */
function mouse_on(pippo) {
    var aggr = document.getElementById("aggregationType").value;
    console.log('AGGR: ', aggr)
    var aggregated_by_year = document.getElementById("aggregationYear").value;
    console.log('AGGREGATED YEAR: ', aggregated_by_year)
    var year = document.getElementById('slider').value
    console.log('YEAR: ', year)

    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
        dataset_dict = change(data, aggr, year, aggregated_by_year)
        console.log("ciaoo", dataset_dict)
        d = dataset_dict[pippo]
        var html = "";
        html += "<div>";
        html += "<span>";
        try {
            html += d['Item'];
            html += "</span><br>";
            html += "<span>";
            html += "<a>Total Accidents: "
            html += (d["Total_Accidents"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Fatalities: "
            html += (d["Fatal"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Serious Injuries: "
            html += (d["Serious"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Minor Injuries: "
            html += (d["Minor"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Uninjured: "
            html += (d["Uninjured"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>VMC: "
            html += (d["VMC"]);
            html += " IMC: "
            html += (d["IMC"]);
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Destroyed: "
            html += (d["Destroyed_Damage"]);
            html += " Substantial: "
            html += (d["Substantial_Damage"]);
            html += " Minor: "
            html += (d["Minor_Damage"]);
        }
        catch (error) {
            html += pippo;
            html += "</span><br>";
            html += "<span>";
            // html += "<a>Total Accidents: "
            // html = html.replace("<a>Total Accidents: ", "")
            html += "<a>Total Accidents: 0"
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Fatalities: 0"
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Serious Injuries: 0"
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Minor Injuries: 0"
            html += "</a>";
            html += "</span><br>";
            html += "<span>";
            html += "<a>Uninjured: 0"
        }
        html += "</a>";
        html += "</span><br>";
        html += "</div>";
        $("#tooltip-container-menu").html(html);
        $(this).attr("fill-opacity", "0.8");
        $("#tooltip-container-menu").show();

        //quello commentato ha senso, ma scaja
        //var map_width = document.getElementById('scatter').getBoundingClientRect().width;
        var map_width = $('scatter')[0].getBoundingClientRect().width;
        console.log($('scatter'))

        console.log('LAYER X ' + d3.event.layerX)
        console.log('LAYER Y ' + d3.event.layerY)

        if (d3.event.layerX < map_width / 2) {
            d3.select("#tooltip-container-menu")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
        } else {
            var tooltip_width = $("#tooltip-container-menu").width();
            d3.select("#tooltip-container-menu")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
        }
    })
}

function mouse_out() {
    d3.select('#tooltip-container-menu').style('display', 'none')
}

//da qui ce sta il nuovo slider col play button
// var formatDateIntoYear = d3.timeFormat("%Y");
// var formatDate = d3.timeFormat("%b %Y");
// var parseDate = d3.timeParse("%m/%d/%y");

// var startDate = new Date("2001-11-01"),
//     endDate = new Date("2021-04-01");

// var margin = { top: 50, right: 50, bottom: 0, left: 50 },
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// var svg = d3.select("#vis")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

////////// slider //////////

// var moving = false;
// var currentValue = 0;
// var targetValue = width;

var playButton = d3.select("#play-button");

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 5 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function () { slider.interrupt(); })
        .on("start drag", function () {
            currentValue = d3.event.x;
            update(x.invert(currentValue));
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function (d) { return formatDateIntoYear(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-25) + ")")


////////// plot //////////

// var dataset;

// var plot = svg.append("g")
//     .attr("class", "plot")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



playButton
    .on("click", function () {
        // var i = 0
        // while(i<100){
        //     step()
        //     i++
        //     console.log(i)
        // }
        step()
        console.log('dio')
    })

function prepare(d) {
    d.id = d.id;
    d.date = parseDate(d.date);
    return d;
}

function step() {
    update(x.invert(currentValue));
    currentValue = currentValue + (targetValue / 151);
    if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
    }
}

// function drawPlot(data) {
//   var locations = plot.selectAll(".location")
//     .data(data);

//   // if filtered dataset has more circles than already existing, transition new ones in
//   locations.enter()
//     .append("circle")
//     .attr("class", "location")
//     .attr("cx", function(d) { return x(d.date); })
//     .attr("cy", height/2)
//     .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
//     .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
//     .style("opacity", 0.5)
//     .attr("r", 8)
//       .transition()
//       .duration(400)
//       .attr("r", 25)
//         .transition()
//         .attr("r", 8);

//   // if filtered dataset has less circles than already existing, remove excess
//   locations.exit()
//     .remove();
// }

function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDate(h));

//   // filter data set and redraw plot
//   var newData = dataset.filter(function(d) {
//     return d.date < h;
//   })
//   drawPlot(newData);
}




function mouseon_mds(elem){
    var svg = d3.select("#mds").select("svg");
    svg.attr("clip-path", "url(#clip)")
            .selectAll("circle").filter(function (d) {
        if (elem == d){
            return true
        }
        return false
    })
        .classed("mouseon", true);
};

function mouseout_mds(elem){
    var svg = d3.select("#mds").select("svg");
    svg.attr("clip-path", "url(#clip)")
            .selectAll("circle").filter(function (d) {
        if (elem == d){
            return true
        }
        return false
    })
        .classed("mouseon", false);
};
