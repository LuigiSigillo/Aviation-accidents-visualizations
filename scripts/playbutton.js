var playButton = d3.select("#play-button");
var pauseButton = d3.select("#pause-button");
var globalone = undefined
function myStopFunction(myVar) {
    clearInterval(myVar);
}

function rec_play() {
    var slider = document.getElementById("slider");
    if (slider.value >= 2020) {
        myStopFunction();
        return;
    }
    var output = document.getElementById("demo");
    slider.value = +slider.value + 1
    output.innerHTML = slider.value;
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    slider.dispatchEvent(evt)
    console.log('slider ', slider.value)
}

playButton.on("click", function () {
    globalone = setInterval(rec_play, 1000);
    document.getElementById('play-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'block';
})

pauseButton.on("click", function () {
    myStopFunction(globalone);
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('play-button').style.display = 'block';
})