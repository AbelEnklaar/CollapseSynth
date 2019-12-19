
let ready = false;
let Synth;


window.setup = setup;
  async  function setup() {
        createCanvas(windowWidth, windowHeight);
        background(0);
        textSize(40);
        fill(255);
        
        Synth = new Tone.MonoSynth({

            "oscillator": {
              "type": "sine",
    
            },
            "envelope": {
              "attack": 0.1
            },
            "filter": {
              "type" : "lowpass",
              "frequency": "20000"
            }
          })

       

          Synth.connect(Tone.Master);
          ready = true;
    }
    
window.draw = draw;
function draw() {
    if (!ready) return;
    let randomx = random(0, width);
    let randomy = random(0, height);    
    playMidi();
   
   
   
    
}
window.keyTyped = keyTyped;
function keyTyped() {
  
  if (key === "a") {
    Synth.triggerAttackRelease("C3", "4n");
  
  }
}
window.drawText = drawText;
function playMidi(){
 
    WebMidi.enable(function (err) {

        if (err) {
          console.log("WebMidi could not be enabled.", err);
        } else {
            console.log("WebMidi Enabled");
        }
      
        // Viewing available inputs and outputs
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
    
        const inputDevice = WebMidi.getInputByName("OP-1 Midi Device");
    
        inputDevice.addListener('noteon', "all",
        function (e) {
          console.log(e);
          text(e.note.name + e.note.octave, random(0, width), random(0, height));
      
      }
        );
        
    inputDevice.addListener('noteon', "all",
    function (e){
    Synth.triggerAttackRelease(e.note.name+e.note.octave, "4n");
  
    });

 
})

}
window.resetSynth = resetSynth;
function  resetSynth() {

}


// canvasSketch();