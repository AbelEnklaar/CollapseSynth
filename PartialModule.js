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


let partial1Amount;
let partial2Amount;

window.setup = setup;
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

window.windowResized = windowResized;
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

window.draw = draw;
function draw() {

  partial1Amount = int(map(mouseXmap, 0, 1, 0, 10));
  partial2Amount = int(map(mouseYmap, 0, 1, 0, 10));

  const dim = Math.min(width, height);

  background(0, 0, 0, 60);
  noFill();
  strokeWeight(dim * 0.0175);
  stroke(255);
  let circle1dim = int(map(partial1Amount, 0, 10, 0, 200));
  let circle2dim = int(map(partial2Amount, 0, 10, 0, 200));


  circle(width / 2, height / 2, circle1dim);


  circle(width / 2, height / 2, circle2dim);




  strokeWeight(3);
  textSize(40);
  drawWords(width * 0.5);

}






function updateEffects() {
  updateSocketState(true);
  mouseXmap = max(0, min(1, mouseX / width));
  mouseYmap = max(0, min(1, mouseY / height));
  socket.emit("updatePartial1", partial1Amount);
  socket.emit("updatePartial2", partial2Amount);
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
  text("COLLAPSE", x, height/8 * 1);
 textSize(25);
 strokeWeight(1.5);
  text("Partial Module", x, height/8 * 7.5);

}
window.updateSocketState=updateSocketState
function updateSocketState(y) {
    socket.emit("partialActive", y);
}

canvasSketch();
