/* Create HTML for mouseover */
function mouse_on(pippo) {
    var aggr = document.getElementById("aggregationType").value;
    console.log('AGGR: ', aggr) 
    var aggregated_by_year = document.getElementById("aggregationYear").value;
    //console.log('AGGREGATED YEAR: ', aggregated_by_year)
    var year = document.getElementById('slider').value
    //console.log('YEAR: ', year)
    if (pippo.startsWith("par"))
        year = 2020
        pippo = pippo.replace("par","")
    if (pippo.startsWith("2")){

        d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
            dataset_dict = change(data, "Event.Id", year, aggregated_by_year)
            //console.log("ciaoo", dataset_dict)
            console.log("sssa",pippo)
            d = dataset_dict[pippo]
            console.log(d)
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
    else {
    d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {
        dataset_dict = change(data, aggr, year, aggregated_by_year)
        //console.log("ciaoo", dataset_dict)
        console.log("sssa",pippo)
        d = dataset_dict[pippo]
        console.log(d)
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
}

function mouse_out() {
    d3.select('#tooltip-container-menu').style('display', 'none')
}


function mouseon_mds(elem){
    if (!flights){
        var svg = d3.select("#mds").select("svg");
        svg.attr("clip-path", "url(#clip)")
                .selectAll("circle").filter(function (d) {
            if (elem == d){
                return true
            }
            return false
        })
            .classed("mouseon", true);
    }else{
        var svg = d3.select("#mds").select("svg");
        svg.attr("clip-path", "url(#clip)")
                .selectAll("circle").filter(function (d) {
                    if (aggreg == "Crash.Country"){
                        if (elem == size2[d]["STATE"]){
                            return true
                        }
                    }
                    if(aggreg == "Broad.Phase.of.Flight"){
                        if (elem == size2[d]["PHASE"]){
                            return true
                        }
                    }
                    if(aggreg == "Event.Month"){
                        if (elem == size2[d]["MONTH"]){
                            return true
                        }
                    }
                    if(aggreg == "Make"){
                        if (elem == size2[d]["MAKE"]){
                            return true
                        }
                    }
                    return false
        })
            .classed("mouseon", true);
    }
    
};

function mouseout_mds(elem){
    var svg = d3.select("#mds").select("svg");
    svg.attr("clip-path", "url(#clip)")
            .selectAll("circle").filter(function (d) {
        
            return true

    })
        .classed("mouseon", false);
};

function brush_mds(elem){
    var svg = d3.select("#mds").select("svg");
    svg.attr("clip-path", "url(#clip)")
            .selectAll("circle").filter(function (d) {
        if (elem.includes(d)){
            return true
        }
        if (aggreg == "Crash.Country"){
            if (elem.includes(size2[d]["STATE"])){
                return true
            }
        }
        if(aggreg == "Broad.Phase.of.Flight"){
            if (elem.includes(size2[d]["PHASE"])){
                return true
            }
        }
        if(aggreg == "Event.Month"){
            if (elem.includes(size2[d]["MONTH"])){
                return true
            }
        }
        if(aggreg == "Make"){
            if (elem.includes(size2[d]["MAKE"])){
                return true
            }
        }
        return false
})
        .classed("brushed", true)
}

function unbrush_mds(){
var svg = d3.select("#mds").select("svg");
svg.attr("clip-path", "url(#clip)")
            .selectAll("circle")
            .classed("brushed", false)
}


function mouseon_scatter(elem){
    d3.selectAll(".bubble")
                .style("opacity", 0.1)
                .filter(function (d) { return d.Item ==elem })
                .style("opacity", 1);
};

function mouseout_scatter(elem){
    if(brushed_countries.length == 0)
        d3.selectAll(".bubble").style("opacity", 1)
    else {
        d3.selectAll(".bubble")
                .style("opacity", 0.1)
                .filter(function (d) { return brushed_countries.includes(d.Item)})
                .style("opacity", 1);
    }
};

var brushed_par = []
function brushParallel(listBrush){
    brushed_par = listBrush
    var svgParallel = d3.select("#parallel")

        // first every group turns grey NOT WORKING
        svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        listBrush.forEach(d => {
        // Second the hovered specie takes its colorParallel
        svgParallel.selectAll(".line" + d)
        .transition().duration(200)
        .style("stroke", "black")
        .style("opacity", "1")
        });

}

function unbrushParallel(listBrush){
    brushed_par = []
    svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", "#2c7bb6")
            .style("opacity", "1")
        mtooltip.transition()
            .duration(500)
            .style("opacity", 0);

}

function mouseonParallel(d){
    var svgParallel = d3.select("#parallel")

        // first every group turns grey NOT WORKING
        svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        
        // Second the hovered specie takes its colorParallel
        svgParallel.selectAll(".line" + d)
        .transition().duration(200)
        .style("stroke", "green")
        .style("opacity", "1")

}

function mouseoutParallel(d){
    svgParallel.selectAll("path")
            .transition().duration(200)
            .style("stroke", function(d){
                if (d!=null && brushed_par.includes(d))
                    return "black"
                if (brushed_par.length == 0)
                    return "#2c7bb6"
                return "lightgrey"
                })
            .style("opacity",function(d){
                if (d!=null && brushed_par.includes(d))
                    return "1"
                if (brushed_par.length == 0)
                    return "1"
                return "0.2"
                } )
        mtooltip.transition()
            .duration(500)
            .style("opacity", 0);

}



function preset_selection() {
    //var user = $("input[type='radio'][name='preset']:checked").val();
    var user = document.getElementById("presetType").value
    console.log("user", user)
    var yearInput, aggregated_by_year, aggregationType, mds_type_value, X, Y, R, type_map
    /*  
    User 1:
    Description 1:
        Tizio americano che vuole sapere che tipo di velivolo acquistare/affittare in base all'affidabilità, relativa a marca, meteo, stato (dove sta lui o dove deve arrivare), mese in cui deve volare.
    Analitica 1:
        - Mappa: Controlla le disrtibuzioni delle fatalities dipendenti da dove vola lui
            --> Non viaggio verso uno stato in cui stira gente in aereo, lo vedo grazie alla mappa --> stati poco colorati ce posso viaggia.
        - Bubble: Group by manufacturer e nelle assi incidents e altro parametro a piacere per classificare i manufacturer in base alle fatalities/meteo/distruzione o altro. Stessa cosa col mese/state.
        - MDS: supporto al bubble ma con diverse prospettive di idee, dai ancora piu senso alle cose di prima. bubble + mds = TOP
*/
    if(user=="user1") {
        yearInput = 2020 
        aggregated_by_year = "false"
        aggregationType = "Make"
        mds_type_value = "percentage"
        X = "Total_Accidents"
        Y = "Uninjured"
        R = "Minor"
        type_map = "Uninjured"
    }

/*
    USER 2:
    Description 2:
        Tizio dell'azienda che produce velivoli vede che tipo di incidenti fanno i propri velivoli per capire cosa migliorare: ex se so fatal deve capi come non fa stira gente, oppure se so sotto la pioggia migliora la resistenza alle intemperie,
    Analitica 2:
        - Mappa: ___
        - Bubble: aggregazione per marca puo confrontare la sua azienda con le altre, capendo dove si posiziona la propria. Mesi so utili per vedere resistenza freddo col meteo pure(?).
            Dati utili: tipologia incidente, meteo, periodo, fase del volo (ex se me scaja l aereo mentre decollo devo migliora quella fase).
        - MDS: simil bubble, ci da info che rafforzano concetto.
    Non sappiamo come correlare phase e manufcaturer in modo pulito
*/
    if (user == "user2") {
        yearInput = 2020 
        aggregated_by_year = "false"
        aggregationType = "Broad.Phase.of.Flight"
        mds_type_value = "percentage"
        X = "Destroyed_Damage"
        Y = "IMC"
        R = "Fatal"
        type_map = "Fatal"
    }
/*
    USER 3
    Description:
        Aeronautica militare vuole avere una visione a tutto tondo degli incidenti per considerare nuove traiettorie, nuovi miglioramenti etc.
    Analitica 3:
        - Mappa: stessa funzione dello user 1
        - Bubble: utilita per tutto
        - MDS: simil bubble, ci da info che rafforzano concetto.
*/
    if (user == "user3") {
        yearInput = 2020 
        aggregated_by_year = "false"
        aggregationType = "Crash.Country"
        mds_type_value = "std"
        X = "Total_Accidents"
        Y = "Fatal"
        R = "Destroyed_Damage"
        type_map = "Fatal" 
    }

    brushMap([],"preset "+yearInput+" "+aggregated_by_year+" "+type_map)
    createMDS(yearInput, 0, 0, aggregated_by_year, aggregationType, mds_type_value)
    changing(aggregationType, X, Y, R, yearInput, aggregated_by_year)
    // update on HTML
    document.getElementById("slider").value =  yearInput
    document.getElementById("aggregationYear").value = aggregated_by_year
    document.getElementById("aggregationType").value = aggregationType 
    document.getElementById("mdsType").value = mds_type_value 
    document.getElementById("X_axis").value = X
    document.getElementById("Y_axis").value = Y
    document.getElementById("R_axis").value = R
    document.getElementById("demo").innerHTML = yearInput;
    /* var $radios = $('input:radio[name=gender]');
    $radios.filter('[value='+type_map+']').prop('checked', true); */
    console.log("AO",yearInput, aggregated_by_year, aggregationType, mds_type_value, X, Y, R, type_map)

    


}