const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let data = require("./SynthState.json");



// the networking socket
// socket = io.connect('http://localhost:3000');

//how to get data from SynthServer.js on startup & on user input > change data & push from this file to server




new p5();



//network elements
let State = data.state;
let ready = false;


// audio elements
let frequency;
let type = ["sine", "square", "triangle"];
let Synth
const volume = -2;



// visual elements
let fxU =data.frequency;
let fxV =data.type;
let l = count;




window.setup = setup;
async function setup() {
    
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);





    ready = true;

  
}


window.draw = draw;
function draw() {
    if (!ready) return;

    const dim = Math.min(width, height);

    background(0, 0, 0, 60);
    noFill();
    strokeWeight(dim * 0.0175);
    stroke(255);
    drawEffectKnob(dim * 0.4, fxU);
    drawEffectKnob(dim * 0.6, fxV);
    frequency = map(fxU, 0, 1, 20, 5000);

    if (fxV > 0.33) {
        l = 1;

        if (fxV > 0.66) {
            l = 2;
        }
    } else {
        l = 0;
    }

    

   
    strokeWeight(3);
    textSize(40);
    drawWords(width * 0.5);

    let checkData  = {
        State: State,
        Waveform: type[l],
        Frequency: frequency
    };

   console.log(checkData);
   
}


function drawEffectKnob(radius, t) {
    if (t <= 0) return;
    arc(width / 2, height / 2, radius, radius, 0, PI * 2 * t);
}

function updateEffects() {
    fxU = max(0, min(1, mouseX / width));
    fxV = max(0, min(1, mouseY / height));
}


window.mousePressed = mousePressed;
function mousePressed() {
    updateEffects();
    
}



window.mouseDragged = mouseDragged;
function mouseDragged() {
    updateEffects();
    
}
window.drawWords = drawWords;
function drawWords(x) {
    fill(0);
    text("COLLAPSE", x, 80);
    fill(255);
    strokeWeight(0);
    text(type[l], x, 775);
    text(int(frequency), x, height *0.5 );
}


canvasSketch();
