const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");

new p5();


let ready = false;


// audio elements
let frequency = 2040;
let type = ["sine", "square", "triangle"];
let Synth
const volume = -2;


// visual elements
let fxU = 0.5;
let fxV = 0.5;
let l = 0;



window.setup = setup;
async function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);


  Synth =   new Tone.MonoSynth({
    
        "oscillator" : {
            "type" : type[l]
     },
     "envelope" : {
         "attack" : 0.1
     }
    })

    Synth.connect(Tone.Master);
    Tone.Master.volume.value = volume;


    ready = true;
}


window.draw = draw;
function draw() {
    if (!ready) return;

    const dim = Math.min(width, height);

    background(0, 0, 0, 50);
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

}


function drawEffectKnob(radius, t) {
    if (t <= 0) return;
    arc(width / 2, height / 2, radius, radius, 0, PI * 2 * t);
}

function updateEffects() {
    fxU = max(0, min(1, mouseX / width));
    fxV = max(0, min(1, mouseY / height));
}

function updateSynth() {
    Synth =   new Tone.MonoSynth({
    
        "oscillator" : {
            "type" : type[l]
     },
     "envelope" : {
         "attack" : 0.1
     }
    }).toMaster();


}

window.mousePressed = mousePressed;
function mousePressed() {
    updateEffects();
    updateSynth();
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
    text(frequency, x, height *0.5 );
}

window.keyPressed = keyPressed;
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    const note = frequency;
    Synth.triggerAttackRelease(note, "4n");
  }
}

canvasSketch();
