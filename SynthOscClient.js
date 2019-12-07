const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let data = require("./SynthState.json");
let socket = require("socket.io-client");


// the networking socket
socket = socket('http://localhost:3001');//.connect('http://localhost:3001');

//how to get data from SynthServer.js on startup & on user input > change data & push from this file to server

let count = 0;
let l = 0;

socket.on("count", (newCount) => {
    count = newCount;
    console.log("new count: ", newCount);
})

new p5();



//network elements
let State = data.state;
let ready = false;


// audio elements
let detune;
let type = ["sine", "square", "triangle"];




// visual elements
let mouseXmap ;
let mouseYmap ;





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
    drawEffectKnob(dim * 0.4, mouseXmap);
    drawEffectKnob(dim * 0.6, mouseYmap);
   

    if (mouseYmap > 0.33) {
        l = 1;

        if (mouseYmap > 0.66) {
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
        Detune: detune
    };

   console.log(checkData);
   
}

function calculateOscillatorType(y) {

    // 0 - 1
    // 0.25 * 3 = 0.75 // 0
    // 0.5 * 3 = 1.5  //1
    // 0.75 * 3 = 2.25 // 2

    // if (y === 1.0){ 
    //     return 2;
    // } else {
    //     Math.floor(y * 3)
    // }
    
    return type[y === 1.0 ? 2 : Math.floor(y * 3)];
}

function calculateDetune(y) {
    return map(y, 0, 1, 0, 180);
}


function drawEffectKnob(radius, t) {
    if (t <= 0) return;
    arc(width / 2, height / 2, radius, radius, 0, PI * 2 * t);
}

function updateEffects() {
    mouseXmap = max(0, min(1, mouseX / width));
    mouseYmap = max(0, min(1, mouseY / height));
    socket.emit("updateType", calculateOscillatorType(mouseYmap));
    socket.emit("updateDetune",calculateDetune(mouseXmap))
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
    text(int(detune), x, height *0.5 );
}


canvasSketch();
