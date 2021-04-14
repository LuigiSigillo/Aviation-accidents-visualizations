function brushMap(brushList, toBeBrushed, first = false) {
    d3version3.csv("datasets/AviationCrashLocation_new.csv", function (err, data) {

        var margin = { top: 50, right: 15, bottom: 15, left: 100 }
        var width = document.getElementById("map").clientWidth + margin.left + margin.right
        var height = document.getElementById("map").clientHeight - margin.top - margin.bottom;


        /* width: 960px;
        height: 500px;*/
        function scaling(width, height) {
            maxWidth = 1295
            maxHeight = 619
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
            return colors[res + 1].getColors().r
        }

        var path = d3version3.geo.path();

        if (first) {
            var mapSvg = d3version3.select("#canvas-svg")
                .append("svg")
                .attr("id", 'svgmappa')
                .attr("width", params.WIDTH + margin.left + margin.right)
                .attr("height", params.HEIGHT + margin.top + margin.bottom);
            mapSvg = mapSvg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
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

            function createHtml(d) {

                var html = "";
                html += "<div class=\"tooltip_kv\">";
                html += "<span class=\"tooltip_key\">";
                html += id_name_map[d.id];
                html += "</span><br>";
                html += "<span class=\"tooltip_value\">";
                html += "<a>Total Accidents: "
                try {
                    html += (e[id_name_map[d.id]]["Total_Accidents"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Fatalities: "
                    html += (e[id_name_map[d.id]]["Fatal"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Serious Injuries: "
                    html += (e[id_name_map[d.id]]["Serious"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Minor Injuries: "
                    html += (e[id_name_map[d.id]]["Minor"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Uninjured: "
                    html += (e[id_name_map[d.id]]["Uninjured"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>VMC: "
                    html += (e[id_name_map[d.id]]["VMC"]);
                    html += " IMC: "
                    html += (e[id_name_map[d.id]]["IMC"]);
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Destroyed: "
                    html += (e[id_name_map[d.id]]["Destroyed_Damage"]);
                    html += " Substantial: "
                    html += (e[id_name_map[d.id]]["Substantial_Damage"]);
                    html += " Minor: "
                    html += (e[id_name_map[d.id]]["Minor_Damage"]);
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
                        .style("fill", function (d) {
                            if (e[id_name_map[d.id]] != undefined)
                                var color = colorMapping(e[id_name_map[d.id]][type]);
                            else
                                var color = colors[0].getColors().r
                            /*if (toBeBrushed)
                                if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                                    var color = colors[9].getColors().r //TEST*/
                            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                        })
                        .style('stroke', 'black')
                        .style('stroke-width', function (d) {
                            if (toBeBrushed)
                                if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                                    return '5'
                        })
                        .attr("d", path)
                        .on("mousemove", function (d) {
                            createNameHtml(d)

                            mouse_on(id_name_map[d.id])
                        })
                        .on("mouseout", function () {
                            mouse_out()
                            $(this).attr("fill-opacity", "1.0");
                            $("#tooltip-container").hide();
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
                            console.log(i)
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

                function update() {
                    // For each check box:
                    d3version3.selectAll(".checkbox").each(function (d) {
                        cb = d3version3.select(this);
                        grp = cb.property("value")
                        if (cb.property("checked"))
                            updateMapColors(grp)
                        updateLegend()
                    })
                }

                // When a button change, I run the update function
                d3version3.selectAll(".checkbox").on("change", update);

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

brushMap([], false, true)


/*function brushMap(brushList,toBeBrushed) {
    d3version3.csv("datasets/AviationCrashLocation_new.csv", function (err, data) {
        var yearInput = +d3version3.select("#slider").node().value;
        var year_bool = document.getElementById("aggregationYear").value;
        e = change(data, "Crash.Country", yearInput, year_bool)
        function scaling(width, height) {
            maxWidth = 1295
            maxHeight = 619
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
        var mapSvg = d3version3.select("#svgmappa")
        d3version3.tsv("datasets/code-states.tsv", function (error, names) {

            name_id_map = {};
            id_name_map = {};

            for (var i = 0; i < names.length; i++) {
                name_id_map[names[i].name] = names[i].id;
                id_name_map[names[i].id] = names[i].name;
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


            var colors_hex = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000','#42382A']
            var colors = []
            for (var i = 0; i < colors_hex.length; i++) {
                colors.push(new Color(hexToRgb(colors_hex[i])));
            }
            function updateLegend() {
                //var legendText = ["0-1", "1-2", "3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
                var grp = $("input[type='radio'][name='gender']:checked").val();
                var mappa = {"Total_Accidents" :"Accidents","Fatal" :"Fatalities","Serious" :"Serious injuries","Minor" :"Minor injuries","Uninjured":"Uninjured"}
                var legendText = ["# "+mappa[grp], "0-1", "1-2", "3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
                var legendsvg = d3version3.select("#legenda-svg")
                legendsvg.selectAll(".legend").remove();
                var legend = legendsvg.append("svg")
                    .attr("class", "legend")
                    .attr("width", 170)
                    .attr("height", 200)
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
                        console.log(i)
                        if (i==0)
                            return "bold"
                    });
            }
            function colorMapping(numero) {
                //var legendText = ["0-1","1-2","3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
                if (numero == 0)
                    res = 0
                else
                    res = Math.floor(Math.log2(numero))
                return colors[res].getColors().r
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

            var path = d3version3.geo.path();

            d3version3.json("datasets/us-states.json", function (error, us) {
                type = "Fatal"
            //cambia colore
            mapSvg.selectAll("g").remove();
            mapSvg.append("g")
                .attr("class", "states-choropleth")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("transform", "scale(" + params.SCALE + ")")
                .style("fill", function (d) {
                    if (e[id_name_map[d.id]] != undefined)
                        var color = colorMapping(e[id_name_map[d.id]][type]);
                    else
                        var color = colors[0].getColors().r
                    /*if (toBeBrushed)
                        if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                            var color = colors[9].getColors().r //TEST
                    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                })
                .style('stroke','black')
                .style('stroke-width', function (d) {
                    if (toBeBrushed)
                        if (e[id_name_map[d.id]] != undefined && brushList.includes(e[id_name_map[d.id]]['Item']))
                            return '5'
                })
                .attr("d", path)
                .on("mousemove", function (d) {
                    createNameHtml(d)

                    mouse_on(id_name_map[d.id])
                })
                .on("mouseout", function () {
                    mouse_out()
                    $(this).attr("fill-opacity", "1.0");
                    $("#tooltip-container").hide();
                });
            updateLegend()
        })
    })
    })
}*/