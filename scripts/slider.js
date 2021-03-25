
var dataset_path = "datasets/AviationCrashLocation.csv"

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

/*
Function:   Change visualization subject depending from year and tipology of visualization
Params:     subject-->  (string)    the subject of visualization
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
    var res = d3.nest()
        .key(function (d) { return d[subject]; })
        .rollup(function (v) {
            return {
                Total_Accidents: d3.sum(v, function (d) { return 1; }),
                Human_Injuries: {
                    Fatal: d3.sum(v, function (d) { return d["Total.Fatal.Injuries"]; }),
                    Serious: d3.sum(v, function (d) { return d["Total.Serious.Injuries"]; }),
                    Minor: d3.sum(v, function (d) { return d["Total.Minor.Injuries"]; }),
                    Uninjured: d3.sum(v, function (d) { return d["Total.Uninjured"]; })
                },
                Weather: {
                    VMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "VMC"; }),
                    IMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "IMC"; })
                },
                Aircraft: {
                    Minor_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Minor"; }),
                    Substantial_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Substantial"; }),
                    Destroyed_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Destroyed"; })
                },
                Phase: {
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
                    TAXI: d3.sum(v, function (d) { return d["Broad.Phase.of.Flight"] == "TAXI"; })
                }
            };
        })
        .map(filtered_map)
    return res;
}