const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let data = require("./SynthState.json");
let socket = require("socket.io-client");
new p5();

// The networking socket
socket = socket('http://localhost:42069');
let detune;
let type = ["sine", "square", "sawtooth"];
let l;
//Create a value related to mouse X & Y
let mouseXmap;
let mouseYmap;

window.setup = setup;
 function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
}
//Updates drawing when resizing the window
window.windowResized = windowResized;
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}
window.draw = draw;
function draw() {
    const dim = Math.min(width, height);
    background(0, 0, 0, 60);
    noFill();
    strokeWeight(dim * 0.0175);
    stroke(255);
    drawEffectKnob(dim * 0.4, mouseXmap);
    drawEffectKnob(dim * 0.6, mouseYmap);

    //Using the mouseYmap value to change the value of l, which is used to write out the current waveform
    if (mouseYmap > 0.33) {
        l = 1;

        if (mouseYmap > 0.66) {
            l = 2;
        }
    } else {
        l = 0;
    }

    detune = map(mouseXmap, 0, 1, 0, 180)
    strokeWeight(3);
    textSize(40);
    drawWords(width * 0.5);
}
//function to map the y position of the mouse to a value of 1 .. 3 
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
//Draw the effectknobs as an arch in which we feed the dim and the mapped value of mouse X and Y
function drawEffectKnob(radius, t) {
    if (t <= 0) return;
    arc(width / 2, height / 2, radius, radius, 0, PI * 2 * t);
}
//update effect function creating a new mapped value for mouse x and y and emit new type and detune to socket
// When this function is called it also let's the socket know the module is being used with the updatesocketstate function
function updateEffects() {
    updateSocketState(true);
    mouseXmap = max(0, min(1, mouseX / width));
    mouseYmap = max(0, min(1, mouseY / height));
    socket.emit("updateType", calculateOscillatorType(mouseYmap));
    socket.emit("updateDetune", detune)
}
//run updateEffects whenever mouse is pressed or dragged
window.mousePressed = mousePressed;
function mousePressed() {
    updateEffects();
}
window.mouseDragged = mouseDragged;
function mouseDragged() {
    updateEffects();
}
//When mouse is released it sets the socket state to false
window.mouseReleased = mouseReleased;
function mouseReleased() {
updateSocketState(false);
}
//The function drawwords writing out the values and waveform using the array holding the waveforms and the value l to cycle through the array
window.drawWords = drawWords;
function drawWords(x) {
    fill(0);
    text("COLLAPSE", x,  height/8 * 1);
    textSize(20);
    text("detune", x, height*0.5 - 25);
    fill(255);
    strokeWeight(0);
    text(type[l], x, height/8 * 7);
    
    text(int(detune), x, height * 0.5);
    textSize(25);
    strokeWeight(1.5);
    fill(0);
     text("Oscillator Module", x, height/8 * 7.5);
}
//The function updateSocketState emits the active state (true/false) when the module is being manipulated
window.updateSocketState=updateSocketState
function updateSocketState(y) {
    socket.emit("oscActive", y);
}
canvasSketch();