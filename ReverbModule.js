const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let socket = require("socket.io-client");
new p5();

// the networking socket
socket = socket('http://localhost:42069');

//create a value related to mouse X & Y
let mouseXmap;
let mouseYmap;

let roomSize;
let dampening;

window.setup = setup;
function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
}
//Updates drawing when resizing the window
window.windowResized = windowResized;
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

window.draw = draw;
function draw() {
    //have roomsize and dampening value map as an int from a value between 0 .. 1 to 0.. 80
    roomSize = int(map(mouseXmap, 0, 1, 0, 80));
    dampening = int(map(mouseYmap, 0, 1, 0, 80));
    const dim = Math.min(width, height);
    //draw a background with a little alpha
    background(0, 0, 0, 60);
    noFill();
    strokeWeight(dim * 0.0175);
    stroke(255);
    //Map the size of the circles to the roomsize and dampening
    let circle1dim = int(map(roomSize, 0, 100, 0, min(height, width)));
    let circle2dim = int(map(dampening, 0, 100, 0, min(height, width)));

    //draw two circles with new dimensions
    circle(width / 2, height / 2, circle1dim);
    circle(width / 2, height / 2, circle2dim);
    strokeWeight(3);
    textSize(40);
    drawWords(width * 0.5);
}
//update effect function creating a new mapped value for mouse x and y and emit new partial value to socket
// When this function is called it also let's the socket know the module is being used with the updatesocketstate function
function updateEffects() {
    updateSocketState(true);
    mouseXmap = max(0, min(1, mouseX / width));
    mouseYmap = max(0, min(1, mouseY / height));
    socket.emit("updateRoomSize", roomSize);
    socket.emit("updateDampening", dampening);
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
//The function drawwords writing out a small descriptive text 
window.drawWords = drawWords;
function drawWords(x) {
    fill(0);
    text("COLLAPSE", x, height / 8 * 1);
    textSize(25);
    strokeWeight(1.5);
    text("Reverb Module", x, height / 8 * 7.5);
}
//The function updateSocketState emits the active state (true/false) when the module is being manipulated
window.updateSocketState = updateSocketState
function updateSocketState(y) {
    socket.emit("reverbActive", y);
}
canvasSketch();