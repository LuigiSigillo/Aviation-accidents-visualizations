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
    if (single_year == 'true') {
        filtered_map = data.filter(function (d) { return +d["Event.Date"].split("-")[0] == year });
    } else {
        filtered_map = data.filter(function (d) { return +d["Event.Date"].split("-")[0] <= year });
    }

    //aggregate values, TO ADD MAKE AND MONTH
    if(subject != "Event.Id"){
    var res = d3version3.nest()
        .key(function (d) { return d[subject]; })
        .rollup(function (v) {console.log("AAAA", )
            return {
                Item: v[0][subject],
                Total_Accidents: d3.sum(v, function (d) { return 1; }),
                Total_Passangers: d3.sum(v, function (d) { return d["Total.Fatal.Injuries"]; }) +
                d3.sum(v, function (d) { return d["Total.Serious.Injuries"]; }) +
                d3.sum(v, function (d) { return d["Total.Minor.Injuries"]; }) + 
                d3.sum(v, function (d) { return d["Total.Uninjured"]; }),
                Death_Rate:  d3.sum(v, function (d) { return d["Total.Fatal.Injuries"]; }) / (d3.sum(v, function (d) {return d["Total.Fatal.Injuries"]; }) +
                d3.sum(v, function (d) { return d["Total.Serious.Injuries"]; }) +
                d3.sum(v, function (d) { return d["Total.Minor.Injuries"]; }) + 
                d3.sum(v, function (d) { return d["Total.Uninjured"]; })),
                Fatal: d3.sum(v, function (d) { return d["Total.Fatal.Injuries"]; }),
                Serious: d3.sum(v, function (d) { return d["Total.Serious.Injuries"]; }),
                Minor: d3.sum(v, function (d) { return d["Total.Minor.Injuries"]; }),
                Uninjured: d3.sum(v, function (d) { return d["Total.Uninjured"]; }),
                VMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "VMC"; }),
                IMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "IMC"; }),
                Minor_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Minor"; }),
                Substantial_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Substantial"; }),
                Destroyed_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Destroyed"; }),
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
                December: d3.sum(v, function (d) { return d["Event.Date"].split("-")[1] == "12" }),
                SURVIVAL_RATE:   +v[0]["Total.Fatal.Injuries"] / d3.sum(v, function (d) { return 1; })
            };
        })
        .map(filtered_map)
    } else{
        var res = d3version3.nest()
        .key(function (d) { return d[subject]; })
        .rollup(function (v) {
            return {
                Item: v[0][subject],
                Total_Accidents: 1,
                Fatal: v[0]["Total.Fatal.Injuries"],
                Serious: v[0]["Total.Serious.Injuries"],
                Minor: v[0]["Total.Minor.Injuries"],
                Uninjured: v[0]["Total.Uninjured"],
                VMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "VMC"; }),
                IMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "IMC"; }),
                Minor_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Minor"; }),
                Substantial_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Substantial"; }),
                Destroyed_Damage: d3.sum(v, function (d) { return d["Aircraft.Damage"] == "Destroyed"; }),
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
                VMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "VMC"; }),
                IMC: d3.sum(v, function (d) { return d["Weather.Condition"] == "IMC"; }),
                STATE: v[0]["Crash.Country"],
                PHASE: v[0]["Broad.Phase.of.Flight"],
                MONTH: v[0]["Event.Month"],
                MAKE: v[0]["Make"]
                };
        })
        .map(filtered_map)
    }
    console.log()
    return res;

}
