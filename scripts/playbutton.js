var playButton = d3.select("#play-button");

d3.csv("datasets/AviationCrashLocation_new.csv", function (error, data) {

    playButton.on("click", function () {
        // var i = 0
        // while(i<100){
        //     step()
        //     i++
        //     console.log(i)
        // }
        var i=0
        while(i<20){
            console.log(document.getElementById("aggregationType").value, +d3.select("#slider").node().value + i, d3.select("#aggregationYear").node().value)
            change(data, document.getElementById("aggregationType").value, +d3.select("#slider").node().value + i, d3.select("#aggregationYear").node().value)
            i++
        }
        // change(data, document.getElementById("aggregationType").value, +d3.select("#slider").node().value, d3.select("#aggregationYear").node().value)
        // step()

        console.log('dio')
    })

})