const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let data = require("./SynthState.json");
let socket = require("socket.io-client");


// the networking socket
socket = socket('http://localhost:42069');



let mouseXmap;
let mouseYmap;


let roomSize;
let dampening;

window.setup = setup;
function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
}




window.draw = draw;
function draw() {

    roomSize = int(map(mouseXmap, 0, 1, 0, 80));
    dampening = int(map(mouseYmap, 0, 1, 0, 80));

    const dim = Math.min(width, height);

    background(0, 0, 0, 60);
    noFill();
    strokeWeight(dim * 0.0175);
    stroke(255);
    let circle1dim = int(map(roomSize, 0, 100, 0, min(height, width)));
    let circle2dim = int(map(dampening, 0, 100, 0, min(height, width)));


    circle(width / 2, height / 2, circle1dim);


    circle(width / 2, height / 2, circle2dim);


    console.log(roomSize, dampening);



}






function updateEffects() {
    updateSocketState(true);
    mouseXmap = max(0, min(1, mouseX / width));
    mouseYmap = max(0, min(1, mouseY / height));
    socket.emit("updateRoomSize", roomSize);
    socket.emit("updateDampening", dampening);
}


window.mousePressed = mousePressed;
function mousePressed() {
    updateEffects();

}



window.mouseDragged = mouseDragged;
function mouseDragged() {
    updateEffects();

}

window.mouseReleased = mouseReleased;
function mouseReleased() {
updateSocketState(false);
}

window.drawWords = drawWords;
function drawWords(x) {
    fill(0);
    text("COLLAPSE", x, 80);
    fill(255);
    strokeWeight(0);
    text(partial1Amount, x, 775);
    text(partial2Amount, x, height * 0.5);
}
window.updateSocketState=updateSocketState
function updateSocketState(y) {
    socket.emit("reverbActive", y);
}

canvasSketch();
