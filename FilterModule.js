const canvasSketch = require("canvas-sketch");
const p5 = require("p5");

let socket = require("socket.io-client");



// the networking socket
socket = socket('http://localhost:3001');//.connect('http://localhost:3001');


new p5();



let tracker;
let particles = [];

window.setup = setup;
function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker = createFaceTracker({
    contain: false,
   
    drawVideo: false
  });
}

window.windowResized = windowResized;
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tracker.resize();
}

window.draw = draw;
function draw() {
  // paint our background color once the video is playing
  background("#fff2d5");
  tracker.draw(drawScene);
}

function drawScene(face, score) {
  console.log(face, score);
  if (face && score > 0.25) {
    // Debug the points
    // for (let i = 0; i < face.length; i++) {
    //   const point = face[i];
    //   noStroke();
    //   fill("#000");
    //   circle(point.x, point.y, 2);
    // }

    stroke(255);
    strokeWeight(min(width, height) * 0.0175);
    noFill();

    // left and right eye
    //  circle(point.x, point.y, 2);
    // }

    stroke(255);
    strokeWeight(min(width, height) * 0.0175);
    noFill();

    // left and right eye
    // const diameter = 50;
    // const eyeLeft = face[27];
    // stroke("#fa0001");
    // circle(eyeLeft.x, eyeLeft.y, diameter);

    //     const eyeRight = face[32];
    //     stroke("#ffbe00");
    //     circle(eyeRight.x, eyeRight.y, diameter);

    // left eye full outline
    // const le01 = face[23];
    // const le02 = face[63];
    // const le03 = face[24];
    // const le04 = face[64];
    // const le05 = face[25];
    // const le06 = face[65];
    // const le07 = face[26];
    // const le08 = face[66];

    strokeWeight(2);
    // beginShape();
    // vertex(le01.x, le01.y);
    // vertex(le02.x, le02.y);
    // vertex(le03.x, le03.y);
    // vertex(le04.x, le04.y);
    // vertex(le05.x, le05.y);
    // vertex(le06.x, le06.y);
    // vertex(le07.x, le07.y);
    // vertex(le08.x, le08.y);
    // vertex(le01.x, le01.y);
    // endShape();

    //particle effect
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      circle(particle.Lx, particle.Ly, particle.size);
      circle(particle.Rx, particle.Ry, particle.size);
      let r = 3;
      const angle = particle.angle;
      particle.Lx = particle.Lx + cos(angle)* r;
      particle.Ly = particle.Ly + sin(angle) * r;
      particle.Rx = particle.Rx + cos(angle)* r;
      particle.Ry = particle.Ry+ sin(angle)* r;

      particle.size *= 0.7;
     // particle.angle = particle.angle + PI;
    }

    if (particles.length > 30) {
      particles.shift();
    }
    const MidEL = face[27];
    const MidER = face[32];
    const data = {
      size: random(50, 100),
      Lx: MidEL.x,
      Ly: MidEL.y,
      Rx: MidER.x,
      Ry:MidER.y,
      angle: random(-PI * 2, PI * 2)
    };
    particles.push(data);

    let roomAmount = int(map(MidEL.x, 0, width, 0, 100))
    socket.emit("updateRoomsize", roomAmount);
    

    // nose
    // const n0 = face[33];
    // const n1 = face[62];
    // stroke("#006697");
    // line(n0.x, n0.y, n1.x, n1.y);

    // mouth
    // const m0 = face[44];
    // const m1 = face[50];
    // stroke("#0a0607");
    // line(m0.x, m0.y, m1.x, m1.y);
  } else {
    // No face detected, put up a spinner or something
    stroke("#ffbe00");
    noFill();
    circle(width / 2, height / 2, width / 2);

    noStroke();
    fill("#0a0607");
    textAlign(CENTER, CENTER);
    textSize(12);
    textFont('"Andale Mono", monospace');
    text("SEARCHING FOR YOUR FACE...", width / 2, height / 2);
  }
}

canvasSketch();
