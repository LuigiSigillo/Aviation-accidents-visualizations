var dataset_path = "datasets/AviationCrashLocation_new.csv"

var dbNames = {
    "crashCountry": "Crash.Country",
    "fatal": "Total.Fatal.Injuries",
    "serious": "Total.Serious.Injuries",
    "minor": "Total.Minor.Injuries",
    "uninjured": "Total.Uninjured",
    "weather": "Weather.Condition",
    "phase": "Broad.Phase.of.Flight",
    "damage": "Aircraft.Damage"
}



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
    $("#tooltip-container").html(html);
    $(this).attr("fill-opacity", "0.8");
    $("#tooltip-container").show();

    var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;
    /*
        console.log('LAYER X ' + d3version3.event.layerX)
        console.log('LAYER Y ' +d3version3.event.layerY)
        
    
    
        if (d3version3.event.layerX < map_width / 2) {
            d3version3.select("#tooltip-container")
                .style("top", (d3version3.event.layerY + 15) + "px")
                .style("left", (d3version3.event.layerX + 15) + "px");
        } else {
            var tooltip_width = $("#tooltip-container").width();
            d3version3.select("#tooltip-container")
                .style("top", (d3version3.event.layerY + 15) + "px")
                .style("left", (d3version3.event.layerX - tooltip_width - 30) + "px");
        }*/
}





/*
Function:   Change visualization subject depending from year and tipology of visualization
Params:     subject-->  (string)    the subject of visualization -> Crash.Country, Broad.Phase.of.Flight, 
            year-->     (int)       year of slider
            single_year (bool)      single year or multiple year
Returns:    result-->   (map)       filtered and processed map 
*/


function change(data, subject, year, single_year) {
    var filtered_map

    //if single year, filter map with single year
    if (single_year) {
        filtered_map = data.filter(function (d) { return +d["Event.Date"].split("-")[0] == year });
    } else {
        filtered_map = data.filter(function (d) { return +d["Event.Date"].split("-")[0] <= year });
    }

    //aggregate values, TO ADD MAKE AND MONTH
    var res = d3version3.nest()
        .key(function (d) { return d[subject]; })
        .rollup(function (v) {
            return {
                Item: v[0][subject],
                Total_Accidents: d3.sum(v, function (d) { return 1; }),
                Fatal: d3.sum(v, function (d) { return d["Total.Fatal.Injuries"]; }),
                Serious: d3.sum(v, function (d) { return d["Total.Serious.Injuries"]; }),
                Minor: d3.sum(v, function (d) { return d["Total.Minor.Injuries"]; }),
                Uninjured: d3.sum(v, function (d) { return d["Total.Uninjured"]; }),
                VMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "VMC"; }),
                IMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "IMC"; }),
                Minor_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Minor"; }),
                Substantial_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Substantial"; }),
                Destroyed_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Destroyed"; }),
                Minor_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Minor"; }),
                MANEUVERING: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "MANEUVERING"; }),
                STANDING: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "STANDING"; }),
                UNKNOWN: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "UNKNOWN"; }),
                TAKEOFF: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "TAKEOFF"; }),
                APPROACH: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "APPROACH"; }),
                CLIMB: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "CLIMB"; }),
                CRUISE: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "CRUISE"; }),
                DESCENT: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "DESCENT"; }),
                LANDING: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "LANDING"; }),
                GOAROUND: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "GO-AROUND"; }),
                TAXI: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "TAXI"; }),
                January: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "01" }),
                February: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "02" }),
                March: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "03" }),
                April: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "04" }),
                May: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "05" }),
                June: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "06" }),
                July: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "07" }),
                August: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "08" }),
                September: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "09" }),
                October: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "10" }),
                November: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "11" }),
                December: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "12" })
            };
        })
        .map(filtered_map)
    return res;

}
