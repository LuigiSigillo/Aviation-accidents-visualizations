d3version3.csv("datasets/AviationCrashLocation_new.csv", function (err, data) {
    
/*     var height = document.getElementById('map').getBoundingClientRect()["height"]
    var width = document.getElementById('map').getBoundingClientRect()["width"]
    console.log("mapp",document.getElementById('map').getBoundingClientRect()["height"],"h",document.getElementById('map').getBoundingClientRect()["width"])
 */
    var params = {
        "WIDTH": height,
        "HEIGHT": width,
        "SCALE": 1
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


    var colors_hex = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']
    var colors = []

    for (var i = 0; i < colors_hex.length; i++) {
        colors.push(new Color(hexToRgb(colors_hex[i])));
    }


    //var a = new Color(hexToRgb(colors_hex[1]))
    //console.log(a)



    function colorMapping(numero) {
        //var legendText = ["0-1","1-2","3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
        if (numero==0)
            res = 0
        else 
            res = Math.floor(Math.log2(numero))
        return colors[res].getColors().r
    }

    var path = d3version3.geo.path();
    
    
    var mapSvg = d3version3.select("#map").append("svg")
        .attr("width", params.WIDTH)
        .attr("height", params.HEIGHT);

    d3version3.tsv("datasets/code-states.tsv", function (error, names) {

        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < names.length; i++) {
            name_id_map[names[i].name] = names[i].id;
            id_name_map[names[i].id] = names[i].name;
        }

        function createHtml (d) {
            
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
            }
            catch(error){
                html = html.replace("<a>Total Accidents: ","")
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



        e = change(data,"Crash.Country",2001,false)
        //console.log("primo dataset 2001",e)
        d3version3.json("datasets/us-states.json", function (error, us) {
            function updateMapColors(type ="Fatal"){
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
                        return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                    })
                    .style('stroke', 'black')
                    .attr("d", path)
                    .on("mousemove", function (d) { createHtml(d)
                    })
                    .on("mouseout", function () {
                        $(this).attr("fill-opacity", "1.0");
                        $("#tooltip-container").hide();
                    });
            }
            // aggiorna mappa subito
            updateMapColors()

            var legendText = ["0-1","1-2","3-6", "7-14", "15-30", "31-62", "63-126", "127-254", "255-510"];
            //var legendText = ["Fatalities:", "0-35", "36-70", "71-105", "106-140", "141-175", "176-210", "211-245", "246-280", "281-315"];
            var legend = d3version3.select("body").append("svg")
                .attr("class", "legend")
                .attr("width", 82)
                .attr("height", 178)
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
                    //if (i == 0) return;
                    //console.log(i)
                    //var color = colors[i - 1].getColors().r;
                    var color = colors[i].getColors().r;
                    //console.log(i, valueById.get(d.id))
                    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                });

            legend.append("text")
                .data(legendText)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function (d) { return d;
                });

        
            d3version3.select("#slider")
                .on("change", function () {
                    var yearInput = +d3version3.select(this).node().value;
                    e = change(data,"Crash.Country",yearInput,false)
                    grp = $("input[type='radio'][name='gender']:checked").val();
                    updateMapColors(grp)
                });

            function update(){
                // For each check box:
                d3version3.selectAll(".checkbox").each(function(d){
                    cb = d3version3.select(this);
                    grp = cb.property("value")
                    if(cb.property("checked"))
                        updateMapColors(grp)
                })
                }
              
            // When a button change, I run the update function
            d3version3.selectAll(".checkbox").on("change",update);
              
        });

    });


});