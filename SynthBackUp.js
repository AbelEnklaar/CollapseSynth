const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");

new p5();


let ready = false;

const settings = {
    dimensions: [1920, 1080]

};

// audio elements
let synth;
const volume = -10;
let analyser;

// effects
let reverbState = false;
let delayState = false;
let chorusState = false;
let crushState = false;

let diam = 100;
window.setup = setup;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  Tone.Master.volume.value = volume;
  synth = new Tone.Synth({
    oscillator: {
      type: "square"
    }
  });

  analyser = new AudioEnergy();
  synth.connect(analyser);

  reverb = new Tone.JCReverb(0.7);

  delay = new Tone.FeedbackDelay(0.4, 0.85);

  chorus = new Tone.Chorus(4, 2.5, 0.5);

  bitCrush = new Tone.BitCrusher(3);

  synth.connect(Tone.Master);
  synth.connect(reverb);
  synth.connect(delay);
  synth.connect(chorus);
  synth.connect(bitCrush);
  ready = true;
}
window.draw = draw;
function draw() {
  if (!ready) return;

  background(0);
  stroke(255);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);

  //SYNTH
  rect(0 + diam / 2, height / 2, diam, diam);
  
    //ANALYZER
  analyser.update();

  const lowEnergy = analyser.getEnergy();
  // Convert dB to 0..1 range
  const lowScale = map(lowEnergy, -100, -30, 1, 2);

  
  
  //REVERB
  if (mouseX > 350 && mouseX < 450 && mouseY > 150 && mouseY < 250) {
    fill(200, 0, 50);
  }
  if (reverbState === true) {
    fill(200, 0, 50);
    reverb.connect(Tone.Master);
  } else {
    reverb.disconnect();
  }
  circle(400, 200, diam);
  noFill();

  //DELAY
  if (mouseX > 650 && mouseX < 750 && mouseY > 550 && mouseY < 650) {
    fill(0, 200, 50);
  }
  if (delayState === true) {
    fill(0, 200, 50);
    delay.connect(Tone.Master);
  } else {
    delay.disconnect();
  }
  circle(700, 600, diam);
  noFill();

  //CHORUS
  if (mouseX > 950 && mouseX < 1050 && mouseY > 300 && mouseY < 400) {
    fill(50, 0, 200);
  }
  if (chorusState === true) {
    fill(50, 0, 200);
    chorus.connect(Tone.Master);
  } else {
    chorus.disconnect();
  }
  circle(1000, 350, diam);
  noFill();

  //BITCRUSH
  if (mouseX > 450 && mouseX < 550 && mouseY > 400 && mouseY < 550) {
    fill(20, 200, 200);
  }
  if (crushState === true) {
    fill(20, 200, 200);
    bitCrush.connect(Tone.Master);
  } else {
    bitCrush.disconnect();
  }
  circle(500, 450, diam);
  noFill();

  //MASTER
  rect(width - diam / 2, height / 2, diam , diam );

  console.log(
    "reverb " + reverbState + " delay " + delayState + " chorus " + chorusState
  );


}
window.mousePressed = mousePressed;
function mousePressed() {
  if (mouseX > 350 && mouseX < 450 && mouseY > 150 && mouseY < 250) {
    reverbState = !reverbState;
  }
  if (mouseX > 650 && mouseX < 750 && mouseY > 550 && mouseY < 650) {
    delayState = !delayState;
  }
  if (mouseX > 950 && mouseX < 1050 && mouseY > 300 && mouseY < 400) {
    chorusState = !chorusState;
  }
  if (mouseX > 450 && mouseX < 550 && mouseY > 400 && mouseY < 550) {
    crushState = !crushState;
  }
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

canvasSketch( dimensions);

