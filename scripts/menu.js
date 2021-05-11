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
        console.log("ciaoo",dataset_dict)
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

function mouse_out(){
    d3.select('#tooltip-container-menu').style('display','none')
}