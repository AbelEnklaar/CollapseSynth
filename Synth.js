const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");

new p5();


let ready = false;

// visual elements




// audio elements
let synth;
const volume = -10;

// array with modules
let modules = ["A", "B", "C"]

//module states
let oscState = true;
let fxState = true;


window.setup = setup;
async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);


  Tone.Master.volume.value = volume;
  synth = new Tone.Synth({
    oscillator: {
      type: "square"
    }
  });


  synth.connect(Tone.Master);

  ready = true;
}


window.draw = draw;
function draw() {
  if (!ready) return;

  const dim = Math.min(width, height);
  const time = millis() / 1000;
  const duration = 2;
  const playhead = time / duration % 1;
  const anim = sin(playhead * PI * 2) * 0.5 + 0.5;
  const sPulse = dim * 0.03  * anim;



  background(0, 0, 0, 15);
  stroke(255);
  strokeWeight(3);
  noFill();
  textSize(40);
  drawWords(width * 0.5);
 

  

  //oscillator node

  if (oscState == true) {
    strokeWeight(sPulse);
  } else {

  }
  circle(width / 3, height / 3 + 50, dim * 0.2);

  //fx node

  strokeWeight(3);
if (fxState == true) {
  strokeWeight(sPulse);
} else {
}
 circle(width/ 3 * 2, height/3 + 50, dim * 0.2);
}







window.keyPressed = keyPressed;
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    const notes = ["C", "Db", "F", "Gb", "Bb"];
    const octaves = [2, 3, 4];
    const octave = random(octaves);
    const note = random(notes);
    synth.triggerAttackRelease(note + octave, "8n");
  }
}
window.drawWords = drawWords;
function drawWords(x) {
  fill(0);
  text("COLLAPSE", x, 80);

  fill(255);
  textSize(20);
  strokeWeight(0);
  text("Collapse is an online synthesizer made with Tone.js, meant as a tool for collaborative music performance and experimentation.", x, 500);

  text("it comprises of different modules for soundgeneration, fx's, control, and performance all communicating with one central output.", x, 530);

  text("open up different modules on seperate tabs and play around, or get some friends to help you out.", x, 580);

  fill(0);
  strokeWeight(2);
  text("For more information go to www.studioenklaar.com/collapse", x, 700);
}

canvasSketch();