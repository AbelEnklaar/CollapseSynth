const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
const AudioEnergy = require("./AudioEnergy");
const p5 = require("p5");
let socket = require("socket.io-client");



let currentOscillatorType = 'sine';

// visual elements

socket = socket('http://localhost:3001');//.connect('http://localhost:3001');

//how to get data from SynthServer.js on startup & on user input > change data & push from this file to server

let count = 0;
let l = 0;
 

socket.on("count", (newCount) => {
    count = newCount;
    console.log("new count: ", newCount);
})

socket.on("typeUpdated", (newType) => {
  console.log("new type: ", newType);
  currentOscillatorType = newType;
})

new p5();


let ready = false;

// visual elements

// what is read out from the socket: 

// oscilator module 
//  - type (sine, square, triangle)


// partial module
//  - partial1Amount (value between 0 & 10)
//  - partial2Amount (value between 0 & 10)

//reverb  module
//  - roomsize (value between ..& .. )
//  - dampening (value between .. & .. )

//filter module 
//  - type (lowpass, bandpass, highpass)
//  - frequency (value between .. & ..)


// audio elements
let Synth;
const volume = -10;

//osc module
let oscillator = ["sine", "square", "triangle"]
let oScType = 0;

//partial module
let  partial1Amount;
let  partial2Amount;


//filter module
let filter = ["lowpass", "bandpass", "highpass"];
let filterType = 0;
let filterFrequency = 2000;

//reverb module
let roomsize;
let dampening;

//animate nodes
let oscState = true;
let partialState = true;
let filterState = true;
let reverbState = true;

window.setup = setup;
async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);


  Synth =   new Tone.MonoSynth({
    
        "oscillator" : {
            "type" : currentOscillatorType,
            "partials" : [1,  partial1Amount, partial2Amount],
     },
     "envelope" : {
         "attack" : 0.1
     },
     "filter" : {
       "Q" : 6 ,
       "type" : filter[filterType] ,
       "frequency": filterFrequency,
       "rolloff" : -24
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
  const time = millis() / 1000;
  const duration = 2;
  const playhead = time / duration % 1;
  const anim = sin(playhead * PI * 2) * 0.5 + 0.5;
  const sPulse = dim * 0.01  * anim;
  
  
  



  background(0, 0, 0, 20);
  stroke(255);
  strokeWeight(3);
  noFill();
  textSize(40);
  drawWords(width * 0.5);

  //partial module
  partial1Amount = map(mouseX, 0, width, 0, 10);
  partial2Amount =map(mouseY,0, width, 0, 10); 
  
  

  //oscillator node
  if (oscState == true) {
    strokeWeight(sPulse);
  } else {

  }
  circle(width / 2, height / 3 , dim * 0.1);


  //partial node
  strokeWeight(3);
if (partialState == true) {
  strokeWeight(sPulse);
} else {
}
circle(width / 2 + dim * 0.1, height / 3 - dim * 0.1 , dim * 0.1);


//filter node
strokeWeight(3);
if (filterState == true) {
  strokeWeight(sPulse);
} else {
}
circle(width / 2 - dim * 0.1, height / 3 + dim * 0.1 , dim * 0.1);


// reverb node
strokeWeight(3);
if (reverbState == true) {
  strokeWeight(sPulse);
} else {
}
circle(width / 2 + dim * 0.1, height / 3 + dim * 0.1 , dim * 0.1);
}



function updateSynth() {
    Synth =   new Tone.MonoSynth({
        
        "oscillator" : {
            "type" : currentOscillatorType,
            "partials" : [1,  partial1Amount, partial2Amount],
     },
     "envelope" : {
         "attack" : 0.1
     },
    "filter" : {
      "Q" : 6 ,
      "type" : filter[filterType] ,
      "frequency": filterFrequency,
      "rolloff" : -24
    }
    }).toMaster();


}


window.keyTyped = keyTyped;
function keyTyped() {
updateSynth();

  if (key === "a") {
    Synth.triggerAttackRelease("C3", "8n");
  }else if (key === "w") {
    Synth.triggerAttackRelease("C#3", "8n");
  } else if (key === "s") {
    Synth.triggerAttackRelease("D3", "8n");
  } else if (key === "e") {
    Synth.triggerAttackRelease("D#3", "8n");
  } else if (key === "d") {
    Synth.triggerAttackRelease("E3", "8n");
  } else if (key === "f") {
    Synth.triggerAttackRelease("F3", "8n");
  } else if (key === "t") {
    Synth.triggerAttackRelease("F#3", "8n"); 
  } else if (key === "g") {
    Synth.triggerAttackRelease("G3", "8n");
  } else if (key === "y") {
    Synth.triggerAttackRelease("G#3", "8n");
  } else if (key === "h") {
    Synth.triggerAttackRelease("A3", "8n");
  } else if (key === "u") {
    Synth.triggerAttackRelease("A#3", "8n");
  } else if (key === "j") {
    Synth.triggerAttackRelease("B3", "8n");
  } else if (key === "k") {
    Synth.triggerAttackRelease("C4s" , "8n");
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