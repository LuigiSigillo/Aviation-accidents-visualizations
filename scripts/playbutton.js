var playButton = d3.select("#play-button");


playButton.on("click", function () {

    var myVar = setInterval(rec_play, 1000);
    

    
    function myStopFunction() {
      clearInterval(myVar);
    }

    function rec_play() {
        var slider = document.getElementById("slider");
        if(slider.value>=2020){
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

})


