
d3.csv("AviationCrashLocation.csv", function (err, data) {

    var config = {
        "color1": "#d3e5ff",
        "color2": "#08306B",
        "crashCountry": "Crash.Country",
        "fatal": "Total.Fatal.Injuries",
        "serious":"Total.Serious.Injuries",
        "minor":"Total.Minor.Injuries",
        "uninjured":"Total.Uninjured",
        "weather":"Weather.Condition",
        "phase":"Broad.Phase.of.Flight"
    }

    var WIDTH = 800, HEIGHT = 500;

    var COLOR_COUNTS = 200;

    var SCALE = 0.7;


    function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		return "<h4>"+n+"</h4><table>"+
			"<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
			"<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
			"<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
			"</table>";
	}

    function Interpolate(start, end, steps, count) {
        var s = start,
            e = end,
            final = s + (((e - s) / steps) * count);
        return Math.floor(final);
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

    function valueFormat(d) {
        if (d > 1000000000) {
            return Math.round(d / 1000000000 * 10) / 10 + "B";
        } else if (d > 1000000) {
            return Math.round(d / 1000000 * 10) / 10 + "M";
        } else if (d > 1000) {
            return Math.round(d / 1000 * 10) / 10 + "K";
        } else {
            return d;
        }
    }

    var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;

    var rgb = hexToRgb(COLOR_FIRST);

    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

    var MAP_STATE = config.crashCountry;
    var MAP_VALUE = config.fatal;

    var width = WIDTH,
        height = HEIGHT;

    var valueById = d3.map();

    var startColors = COLOR_START.getColors(),
        endColors = COLOR_END.getColors();

    var colors = [];

    for (var i = 0; i < COLOR_COUNTS; i++) {
        var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
        var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
        var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
        colors.push(new Color(r, g, b));
    }

    var quantize = d3.scale.quantize()
        .domain([0, 1.0])
        .range(d3.range(COLOR_COUNTS).map(function (i) { return i }));

    var path = d3.geo.path();

    var svg = d3.select("#canvas-svg").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.tsv("https://gist.githubusercontent.com/amartone/5e9a82772cf1337d688fe47729e99532/raw/65a04d5b4934beda724630f18c475d350628f64d/us-state-names.tsv", function (error, names) {

        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < names.length; i++) {
            name_id_map[names[i].name] = names[i].id;
            id_name_map[names[i].id] = names[i].name;
        }

        var e = d3.nest()
            .key(function (d) { return d[MAP_STATE]; })
            .rollup(function (v) {
                return {
                    Fatalities: d3.sum(v, function (d) { return d[MAP_VALUE]; }),
                    Serious_Injuries: d3.sum(v, function (d) { return d[config.serious] }),
                    Minor_Injuries: d3.sum(v, function (d) { return d[config.minor] })
                };
            })
            .entries(data);
        console.log(JSON.stringify(e))

        e.forEach(function (d) {
            var id = name_id_map[d["key"]];
            valueById.set(id, +d["values"]["Fatalities"]);
        });

        /*
        data.forEach(function (d) {
            var id = name_id_map[d[MAP_STATE]];
            valueById.set(id,  +d[MAP_VALUE]);
        });
        console.log(data)
        */


        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json", function (error, us) {
            quantize.domain([d3.min(topojson.feature(us, us.objects.states).features, function (d) { return +valueById.get(d.id) }),
            d3.max(topojson.feature(us, us.objects.states).features, function (d) { return +valueById.get(d.id) })]);
        })


        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json", function (error, us) {
            svg.append("g")
                .attr("class", "states-choropleth")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("transform", "scale(" + SCALE + ")")
                .style("fill", function (d) {
                    if (valueById.get(d.id)) {
                        var i = quantize(valueById.get(d.id));
                        console.log(i, valueById.get(d.id))
                        var color = colors[i].getColors();
                        return "rgb(" + color.r + "," + color.g +
                            "," + color.b + ")";
                    } else {
                        return "";
                    }
                })
                .attr("d", path)
                .on("mousemove", function (d) {
                    var html = "";
                    html += "<div class=\"tooltip_kv\">";
                    html += "<span class=\"tooltip_key\">";
                    html += id_name_map[d.id];
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Fatalities: "
                    html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Serious Injuries: "
                    html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
                    html += "</a>";
                    html += "</span><br>";
                    html += "<span class=\"tooltip_value\">";
                    html += "<a>Minor Injuries: "
                    html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
                    html += "</a>";
                    html += "</span>";
                    html += "</div>";

                    $("#tooltip-container").html(html);
                    $(this).attr("fill-opacity", "0.8");
                    $("#tooltip-container").show();

                    var coordinates = d3.mouse(this);

                    var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

                    if (d3.event.layerX < map_width / 2) {
                        d3.select("#tooltip-container")
                            .style("top", (d3.event.layerY + 15) + "px")
                            .style("left", (d3.event.layerX + 15) + "px");
                    } else {
                        var tooltip_width = $("#tooltip-container").width();
                        d3.select("#tooltip-container")
                            .style("top", (d3.event.layerY + 15) + "px")
                            .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
                    }
                })
                .on("mouseout", function () {
                    $(this).attr("fill-opacity", "1.0");
                    $("#tooltip-container").hide();
                });

            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                .attr("class", "states")
                .attr("transform", "scale(" + SCALE + ")")
                .attr("d", path);




        });

    });
});