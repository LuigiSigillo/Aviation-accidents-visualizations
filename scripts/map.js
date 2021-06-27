var brushed_countries = []

function brushMap(brushList, mode) {
    d3version3.csv("datasets/AviationCrashLocation_new.csv", function (err, data) {

        if (mode =="brush")
            brushed_countries = brushList
        if (mode =="unbrush")
            brushed_countries = []
        var margin = { top: 50, right: 15, bottom: 15, left: 100 }
        var width = document.getElementById("map").clientWidth + margin.left + margin.right
        var height = document.getElementById("map").clientHeight - margin.top - margin.bottom;

        
        /* width: 960px;
        height: 500px;*/
        function scaling(width, height) {
            maxWidth = 647.5
            maxHeight = 309.5
            ratio = 1
            // Check if the current width is larger than the max
            if (width < maxWidth)
                ratio = width / maxWidth   // get ratio for scaling image
            // Check if current height is larger than max
            if (height < maxHeight)
                ratio = height / maxHeight; // get ratio for scaling image
            return ratio
        }


        var scale = scaling(width, height)
        var params = {
            "WIDTH": width,
            "HEIGHT": height,
            "SCALE": scale
        }
        function Color(_r, _g, _b) {
            var r, g, b;
            var setColors = function (_r, _g, _b) {
                r = _r;
                g = _g;
                b = _b;
            };

            setColors(_r, _g, _b);
            this.getColors = function () {
                var colors = {
                    r: r,
                    g: g,
                    b: b
                };
                return colors;
            };
        }

        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }


        var colors_hex = ['#ffffff', '#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']
        var colors = []

        for (var i = 0; i < colors_hex.length; i++) {
            colors.push(new Color(hexToRgb(colors_hex[i])));
        }


        //var a = new Color(hexToRgb(colors_hex[1]))
        //console.log(a)



        function colorMapping(numero) {
            //var legendText = ["0-1","1-2","3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
            if (numero == 0)
                res = 0
            else
                res = Math.floor(Math.log2(numero))
            return colors[res+1].getColors().r
        }

        var path = d3version3.geo.path();

        if (mode=="init") {
            var mapSvg = d3version3.select("#canvas-svg")
                .append("svg")
                .attr("id", 'svgmappa')
                .attr("viewBox", "0 0 1143 812")
                .attr("width", params.WIDTH + margin.left + margin.right)
                .attr("height", params.HEIGHT + margin.top + margin.bottom);
            mapSvg = mapSvg.append("g")
                        //.attr("transform","translate(" + margin.left + "," + margin.top + ")");
        }
        else {
            var mapSvg = d3version3.select("#svgmappa")
        }



        d3version3.tsv("datasets/code-states.tsv", function (error, names) {

            name_id_map = {};
            id_name_map = {};

            for (var i = 0; i < names.length; i++) {
                name_id_map[names[i].name] = names[i].id;
                id_name_map[names[i].id] = names[i].name;
            }


            function createNameHtml(d) {
                var html = "";

                html += "<span class=\"tooltip_key\">";
                html += id_name_map[d.id];
                html += "</span><br>";
                $("#tooltip-container").html(html);
                $(this).attr("fill-opacity", "0.8");
                $("#tooltip-container").show();

                var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

                if (d3version3.event.layerX < map_width / 2) {
                    d3version3.select("#tooltip-container")
                        .style("top", (d3version3.event.layerY + 15) + "px")
                        .style("left", (d3version3.event.layerX + 15) + "px");
                } else {
                    var tooltip_width = $("#tooltip-container").width();
                    d3version3.select("#tooltip-container")
                        .style("top", (d3version3.event.layerY + 15) + "px")
                        .style("left", (d3version3.event.layerX - tooltip_width - 30) + "px");
                }
            }

            //var aggregationYear = "false"
            var yearInput = +d3version3.select("#slider").node().value;
            var aggregationYear = document.getElementById("aggregationYear").value;
            var type = "Fatal"
            if (mode.startsWith("preset")) {
                par = mode.split(" ")
                yearInput = par[1]
                aggregationYear = par[2] 
                type = par[3]
            }
            e = change(data, "Crash.Country", yearInput, aggregationYear)
            //console.log("primo dataset 2001",e)
            d3version3.json("datasets/us-states.json", function (error, us) {
                function updateMapColors(type = "Fatal") {
                    //cambia colore
                    mapSvg.selectAll("g").remove();
                    mapSvg.append("g")
                        .attr("class", "states-choropleth")
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects.states).features)
                        .enter().append("path")
                        .attr("transform", "scale(" + params.SCALE + ")")
                        //.attr("transform","translate(" + margin.left + "," + margin.top + ")")
                        .style("fill", function (d) {
                            if (e[id_name_map[d.id]] != undefined)
                                var color = colorMapping(e[id_name_map[d.id]][type]);
                            else
                                var color = colors[0].getColors().r
                            
                            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                        })
                        .style('stroke', function (d){
                            if (mode=="mouseon")
                                if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                                    return 'green'
                                if (mode=="brush")
                                    if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                                        return 'red'
                            return 'black'
                        })
                        .style('stroke-width', function (d) {
                            if (brushed_countries != [])
                                if (e[id_name_map[d.id]] != undefined && brushed_countries.includes(e[id_name_map[d.id]]['Item']))
                                    return '8'
                            if (mode=="mouseon")
                                    if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                                            return '8'
                        })
                        .attr("d", path)
                        .on("mousemove", function (d) {
                            //brushMap(id_name_map[d.id],"mouseon")
                            if(document.getElementById("aggregationType").value == "Crash.Country") {
                                createNameHtml(d)
                                mouseon_mds(id_name_map[d.id])
                                mouseonParallel([id_name_map[d.id]])
                                //brushParallel([id_name_map[d.id]])
                                mouse_on(id_name_map[d.id])
                                mouseon_scatter(id_name_map[d.id])
                            }
                        })
                        .on("mouseout", function (d) {
                            //brushMap(id_name_map[d.id],"mouseout")
                            if(document.getElementById("aggregationType").value == "Crash.Country") {
                                mouse_out()
                                $(this).attr("fill-opacity", "1.0");
                                $("#tooltip-container").hide();
                                mouseout_mds(id_name_map[d.id])
                                //unbrushParallel()
                                mouseoutParallel()
                                mouseout_scatter(id_name_map[d.id])
                                }
                        });
                }

                function updateLegend() {
                    //var legendText = ["0-1", "1-2", "3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
                    var grp = $("input[type='radio'][name='gender']:checked").val();
                    var mappa = { "Total_Accidents": "Accidents", "Fatal": "Fatalities", "Serious": "Serious injuries", "Minor": "Minor injuries", "Uninjured": "Uninjured" }
                    var legendText = ["# " + mappa[grp], "0-1", "1-2", "3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
                    var legendsvg = d3version3.select("#legenda-svg")
                    legendsvg.selectAll(".legend").remove();
                    var legend = legendsvg.append("svg")
                        .attr("width", 170)
                        .attr("height", 200)
                        .attr("class", "legend")
                        .selectAll("g")
                        .data(legendText)
                        .enter()
                        .append("g")
                        .attr("transform", function (d, i) {
                            return "translate(0," + i * 20 + ")";
                        });

                    legend.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", function (d, i) {
                            var color = colors[i].getColors().r;
                            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                        });

                    legend.append("text")
                        .data(legendText)
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return d;
                        })
                        .style("font-weight", function (d, i) {
                            if (i == 0)
                                return "bold"
                        });
                }
                // aggiorna mappa subito
                updateMapColors()
                updateLegend()


                var year_bool = document.getElementById("aggregationYear");
                year_bool.onchange = function () {
                    console.log("cambiato mappa")
                    aggregationYear = year_bool.value
                    e = change(data, "Crash.Country", yearInput, aggregationYear)
                    grp = $("input[type='radio'][name='gender']:checked").val();

                    updateMapColors(grp)
                    updateLegend()
                }

                d3version3.select("#slider")
                    .on("change", function () {
                        var yearInput = +d3version3.select(this).node().value;
                        console.log("anno slider", yearInput)

                        e = change(data, "Crash.Country", yearInput, aggregationYear)
                        grp = $("input[type='radio'][name='gender']:checked").val();
                        updateMapColors(grp)
                        updateLegend()

                    }
                    );

                function updateCheckBox() {
                    // For each check box:
                    d3version3.selectAll(".checkbox").each(function (d) {
                        var aggregationType = document.getElementById("aggregationType").value
                        cb = d3version3.select(this);
                        grp = cb.property("value")
                        if (cb.property("checked")) {
                            updateMapColors(grp)
                            parallelCoord(aggregationType,grp)
                        }
                        updateLegend()
                    })
                }

                // When a button change, I run the update function
                d3version3.selectAll(".checkbox").on("change", updateCheckBox);

                window.onresize = function () {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    //fare cose
                    /* d3version3.select("#map").select("svg").remove();
                     mapSvg = d3version3.select("#map")
                     .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom);
                     params.SCALE = scaling(width,height)
                     updateLegend()
                     updateMapColors()
                     
                     console.log(width,height)*/
                };


            });

        });


    });
}

brushMap([], "init")

