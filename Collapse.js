// Collapse Synth version 0.1
// by Abel Enklaar
// 2019
//created as part of the course 'Generative Design & Media Design in Javascript' by Matt Deslauriers at DFPI 

//collapse synth is a digital synthesizer made with tone.js and p5.js 
// it consist of seperate modules to interface with the sound parameters, a synthserver keeping track of the changes and collapse.js which outputs the sound.

//for version 1.0 i want
// - Enable patchpoints within collapse.js
// - Integrate webmidi api.  
// - make use of individual components instead of monosynth. 
// - add a new module every week with a distinct flavour interface. 



//require modules 
const canvasSketch = require("canvas-sketch");
const Tone = require("tone");
//AudioEnergy currently not used but in here for future expension 
//const AudioEnergy = require("./AudioEnergy"); 
const p5 = require("p5");
let socket = require("socket.io-client");

new p5();

// have ready set to false to ensure every part of the synth is loaded before moving into draw loop
let ready = false;

//Setup all variables, give them some data in case server is offline.
let currentOscState = false;
let currentFilterState = false;
let currentPartialState = false;
let currentReverbState = false;
let currentOscillatorType = "sine";
let currentDetune = 0;
let currentPartial1 = 10;
let currentPartial2 = 10;
let currentRoomSize = 0;
let currentDampening = 0;

let Synth;
let reverb;
const volume = -10;
//experimental polymode enables the playing of multiple notes at once but quickly destroys the synth by reloading it too any times. use at own risk
let experimentalPolyMode = false;
// particles used in drawing the visual feedback when playing the synth
let particles = [];

//Start the socket and listen for the values emited by the seperate modules  
socket = socket('http://localhost:42069');

//These five check if the modules are being manipulated and saves this state as "current...State"
socket.on("oscillatorActive", (newOscState) => {
  console.log(newOscState);
  currentOscState = newOscState;
})
socket.on("filterActive", (newFilterState) => {
  console.log(newFilterState);
  currentFilterState = newFilterState;
})
socket.on("partialActive", (newPartialState) => {
  console.log(newPartialState);
  currentPartialState = newPartialState;
})
socket.on("reverbActive", (newReverbState) => {
  console.log(newReverbState);
  currentReverbState = newReverbState;
})

//These six receive the new values from the modules and saves these as "current..."
socket.on("typeUpdated", (newType) => {
  console.log("new type: ", newType);
  currentOscillatorType = newType;
})
socket.on("detuneUpdated", (newDetune) => {
  console.log("new Detune: ", newDetune);
  currentDetune = newDetune;
})
socket.on('partial1Updated', (newPartial1) => {
  console.log("new Partial 1: ", newPartial1);
  currentPartial1 = newPartial1;
})
socket.on("partial2Updated", (newPartial2) => {
  console.log("new Partial 2: ", newPartial2);
  currentPartial2 = newPartial2;
})
socket.on("roomSizeUpdated", (newRoomSize) => {
  console.log("new roomsize: ", newRoomSize);
  currentRoomSize = newRoomSize;
})
socket.on("dampeningUpdated", (newDampening) => {
  console.log("new dampening: ", newDampening);
  currentDampening = newDampening;
})


//Filter module (currently not being controlled through a module.)
let filter = ["lowpass", "bandpass", "highpass"];
//change the two values below to hear difference between filtertypes and frequency. 
let filterType = 0;
let filterFrequency = 2000;



window.setup = setup;
async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  //Start the synth node with the most recent values received through the websocket
  Synth = new Tone.MonoSynth({

    "oscillator": {
      "detune": currentDetune,
      "type": currentOscillatorType,
      "partials": [1, currentPartial1, currentPartial2],
    },
    "envelope": {
      "attack": 0.1
    },
    "filter": {
      "Q": 6,
      "type": filter[filterType],
      "frequency": filterFrequency,
      "rolloff": -24
    }
  })
  //Start the reverb node with the most recent values received through the websocket
  reverb = new Tone.Freeverb({
    "roomSize": currentRoomSize,
    "dampening": currentDampening
  })
  // connect the synth node to the reverb node, and both seperately to the master
  Synth.connect(reverb);
  reverb.connect(Tone.Master);
  Synth.connect(Tone.Master);
  //set the master volume using our volume variable defined in line 44
  Tone.Master.volume.value = volume;

  //set ready to true when all of the above has been done
  ready = true;
}
window.windowResized = windowResized;
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

window.draw = draw;
function draw() {
  // if ready is not yet set to true wait for this to happen before moving further 
  if (!ready) return;

  //set a dimension variable at the smallest value between width and height
  const dim = Math.min(width, height);
  //time since start of script in seconds
  const time = millis() / 1000;
  const duration = 2;
  //create playhead for seamless loop (value that wraps around between 0 & 1)
  const playhead = time / duration % 1;
  //use pi*2 to make it go a full circle 
  const anim = sin(playhead * PI * 2) * 0.5 + 0.5;
  //animate the strokepulse with these values
  const sPulse = dim * 0.01 * anim;

  //set a visual que for when experimental mode is triggered
  if (experimentalPolyMode == true) {
    background(250, 0, 0, 15);
  } else {
    background(0, 0, 0, 15);
  }
  stroke(255);
  strokeWeight(3);
  noFill();
  textSize(40);
  //using the function drawWords to write text on the screen at the specified x location. 
  drawWords(width * 0.5);

  //oscillator module, becomes green and gets a pulsing outline when receiving data from the socket
  if (currentOscState == true) {
    strokeWeight(sPulse);
    fill(20, 250, 0, 20);
  } else {
    noFill();

  }
  circle(width / 2, height / 2, dim * 0.1);

  //Partial module, becomes green and gets a pulsing outline when receiving data from the socket
  strokeWeight(3);
  if (currentPartialState == true) {
    strokeWeight(sPulse);
    fill(20, 250, 0, 20);
  } else {
    noFill();
  }
  circle(width / 2 + dim * 0.1, height / 2 - dim * 0.1, dim * 0.1);

  //Filter module, currently inactive
  strokeWeight(3);
  if (currentFilterState == true) {
    strokeWeight(sPulse);
    fill(20, 250, 0, 20);
  } else {
    fill(255,0,0);
  }
  circle(width / 2 - dim * 0.1, height / 2 + dim * 0.1, dim * 0.1);

  //Reverb module, becomes green and gets a pulsing outline when receiving data from the socket
  strokeWeight(3);
  if (currentReverbState == true) {
    strokeWeight(sPulse);
    fill(20, 250, 0, 20);
  } else {
    noFill();
  }
  circle(width / 2 + dim * 0.1, height / 2 + dim * 0.1, dim * 0.1);
}

// Function update reassambles the synth with the new values.
// This has to be outside of the draw loop otherwise the synth get's stuck updating itself x times every second, 
// causing a crashing sound
function updateSynth() {
  if (experimentalPolyMode == false) {
    cleanUpSynth();
  }
  Synth = new Tone.MonoSynth({

    "oscillator": {
      "detune": currentDetune,
      "type": currentOscillatorType,
      "partials": [1, currentPartial1, currentPartial2],
    },
    "envelope": {
      "attack": 0.1
    },
    "filter": {
      "Q": 6,
      "type": filter[filterType],
      "frequency": filterFrequency,
      "rolloff": -24
    }
  })

  reverb = new Tone.Freeverb({
    "roomSize": currentRoomSize,
    "dampening": currentDampening
  })

  Synth.connect(reverb);
  Synth.connect(Tone.Master);
  reverb.connect(Tone.Master);
}
//using keytyped to interact with the synthesizer it resambles a piano roll layout with a through k being the white keys from c3 to c4.
// the row above are assigned the black keys 
// this function also draws circlular particles in parts of the screen corresponding to the notes played. 
window.keyTyped = keyTyped;
function keyTyped() {
  updateSynth();
  if (key === "a") {
    Synth.triggerAttackRelease("C3", "4n");
    drawParticles(random(0, width / 8), random(height / 2, height))
  } else if (key === "w") {
    Synth.triggerAttackRelease("C#3", "4n");
    drawParticles(random(width / 8 + 50, width / 8 + 100), random(0, height / 2))
  } else if (key === "s") {
    Synth.triggerAttackRelease("D3", "4n");
    drawParticles(random(width / 8, width / 8 * 2), random(height / 2, height))
  } else if (key === "e") {
    Synth.triggerAttackRelease("D#3", "4n");
    drawParticles(random(width / 8 * 2 + 50, width / 8 * 2 + 100), random(0, height / 2))
  } else if (key === "d") {
    Synth.triggerAttackRelease("E3", "4n");
    drawParticles(random(width / 8 * 2, width / 8 * 3), random(height / 2, height))
  } else if (key === "f") {
    Synth.triggerAttackRelease("F3", "4n");
    drawParticles(random(width / 8 * 3, width / 8 * 4), random(height / 2, height))
  } else if (key === "t") {
    Synth.triggerAttackRelease("F#3", "4n");
    drawParticles(random(width / 8 * 4 + 50, width / 8 * 4 + 100), random(0, height / 2))
  } else if (key === "g") {
    Synth.triggerAttackRelease("G3", "4n");
    drawParticles(random(width / 8 * 4, width / 8 * 5), random(height / 2, height))
  } else if (key === "y") {
    Synth.triggerAttackRelease("G#3", "4n");
    drawParticles(random(width / 8 * 5 + 50, width / 8 * 5 + 100), random(0, height / 2))
  } else if (key === "h") {
    Synth.triggerAttackRelease("A3", "4n");
    drawParticles(random(width / 8 * 5, width / 8 * 6), random(height / 2, height))
  } else if (key === "u") {
    Synth.triggerAttackRelease("A#3", "4n");
    drawParticles(random(width / 8 * 6 + 50, width / 8 * 6 + 100), random(0, height / 2))
  } else if (key === "j") {
    Synth.triggerAttackRelease("B3", "4n");
    drawParticles(random(width / 8 * 6, width / 8 * 7), random(height / 2, height))
  } else if (key === "k") {
    Synth.triggerAttackRelease("C4s", "4n");
    drawParticles(random(width / 8 * 7, width), random(height / 2, height))
  } else if (key === "x") {
    experimentalPolyMode = !experimentalPolyMode;
  }
}
//The function drawwords writing out a small descriptive text about the project 
window.drawWords = drawWords;
function drawWords(x) {
  fill(0);
  text("COLLAPSE V0.1", x, 70);



  fill(255);
  textSize(10);
  strokeWeight(0);
  textAlign(LEFT, CENTER);
  if (experimentalPolyMode == false) {
  text("Press x to go into experimental poly mode.", width/8, height/7);
  } else {
    text("Press x to retun to mono mode.", width/8, height/7);
  }
  textAlign(CENTER, CENTER);
  textSize(15);
  text("Collapse is an online synthesizer made with Tone.js, meant as a tool for collaborative music performance and experimentation.", x, height/8 * 6);

  text("its goal is to be a collection of  opensource modules for soundgeneration, fx, control, and performance all communicating with one central output.", x, height/8 * 6.5);

  text("open up different modules on seperate tabs and play around, or get some friends to help you out.", x, height/8 *7);

  fill(0);
  strokeWeight(2);
  text("For more information, the full code and a roadmap of the project go to https://github.com/AbelEnklaar/CollapseSynth", x, height - 20);
}
//Drawparticle function with x and y 
window.drawParticles = drawParticles;
function drawParticles(x, y) {
  //Have length of the array particle increae eachtime the function loops
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    //Draw a circle for every particle[i] with it's own x and y 
    circle(particle.px, particle.py, particle.size);
    //Create an angle which the particles move on every time they are drawn again
    let r = 3;
    const angle = particle.angle;
    particle.px = particle.px + cos(angle) * r;
    particle.py = particle.py + sin(angle) * r;
    //Let the size of the particles decrease each time the function loops 
    particle.size *= 0.7;
  }
  // if i reaches 31 delete the oldest of the particles to make room for a new one.
  if (particles.length > 30) {
    particles.shift();
  }
  //create a dataobject for each particle with their own size, x & y, and angle 
  const data = {
    size: random(100, 200),
    py: y,
    px: x,
    angle: random(-PI * 2, PI * 2)
  };
  particles.push(data);
}
//clean up function for synth in order to prevent it from "crashing into itself" when it get's called too many times
window.cleanUpSynth = cleanUpSynth;
function cleanUpSynth() {
  Synth.dispose();
  reverb.dispose();
}
canvasSketch();