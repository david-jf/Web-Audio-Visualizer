//Created by David Fountain, Zack Baker, Erik Haugrud
//Last updated April 2019

var audio = new Audio(); //create the Audio object
//audio.crossOrigin = 'anonymous';
//audio.src = 'http://localhost/knocking.mp3';
audio.controls = true;
audio.loop = false;
audio.autoplay = false;

var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
//var old_arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//var rand = 0;

window.addEventListener("load", initMp3Player, false); //on page load, run the initMp3Player function

//space bar pauses
window.onkeydown=function(e){
    if(e.keyCode===32){
        if(audio.paused){
            audio.play();
        }
        else{
            audio.pause();
        }
        e.preventDefault();
        return false;  
    }
};

//initiate mp3 player
function initMp3Player(){
    document.getElementById('audio_box').appendChild(audio);
    context = new (window.AudioContext || window.webkitAudioContext)(); // AudioContext object, works for different browsers
    analyser = context.createAnalyser(); // AnalyserNode method
    analyser.fftSize = 8192; //size of fast fourier transform to determine frequency domain (must be base 2)
    //console.log(context.state);
    
    canvas = document.getElementById('analyser_space');
    ctx = canvas.getContext('2d');
    // Re-route audio playback into the processing graph of the AudioContext
    source = context.createMediaElementSource(audio); 
    source.connect(analyser);
    analyser.connect(context.destination);

    

    //pick song from local file
    var song = document.getElementById("song");
    song.onchange = function() {
        var file = song.files[0];
        if(!file){
            console.error("[ERROR] No file entered");
            return;
        }
        audio.src = URL.createObjectURL(file);
        audio.play(); 
        startPlayback = context.resume(); //added to make the AudioContext resume. It is in a suspended state to being with because of google's new autoplay policy (dec 2018)
        //audio.resume();
    };

    frameLooper();
}

//creates the animation
function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount); //fbc_array holds the the frequencies of the song being played
    analyser.getByteFrequencyData(fbc_array); //puts frequency data into fbc_array, each frequency in it's own index in the array
    //console.log(fbc_array.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //ctx.fillStyle = '#12ba98'; // Color of the bars
    bars = 150;
    for (var i = 0; i < bars; i++) {

        bar_x = i *2;
        bar_width = 1;
        bar_height = -(fbc_array[i]/1.72);

        

        var grd = ctx.createLinearGradient(0,0,0,200);
        //creates a colour gradient: 0 is the top of the screen, 1 is the bottom of the screen
        grd.addColorStop(0.1,"red");
        grd.addColorStop(0.2, "yellow");
        grd.addColorStop(0.3, "green");
        grd.addColorStop(0.9,"white");

        ctx.fillStyle = grd;
        // console.log((-parseInt(bar_height)).toString(16));
        //  fillRect( x, y, width, height ) // Explanation of the parameters below
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        

    }

    //function playBack()
    //{
    //    context.resume();
    //}
}