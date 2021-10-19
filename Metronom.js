var Tempi = [
  ['"Grave"', 44],
  ['"Largo"', 48],
  ['"Lento"', 54],
  ['"Adagio"', 58],
  ['"Larghetto"', 63],
  ['"Adagietto"', 69],
  ['"Andante"', 76],
  ['"Maestoso"', 92],
  ['"Moderato"', 104],
  ['"Allegretto"', 116],
  ['"Animato"', 126],
  ['"Allegro"', 138],
  ['"Assai"', 152],
  ['"Vivace"', 176],
  ['"Presto"', 200],
  ['"Prestissimo"', 220]
];

var Play = false;
var BPM = 100;
var VTakt = ["A2", "A3","A4","A5"];
var STakt = ["A4","A3","A3","A3"];
var VCheckbox = document.getElementById("Voice");
var SCheckbox = document.getElementById("Klick");

const sampler = new Tone.Sampler({
	urls: {
		A2: "1.wav",
		A3: "2.wav",
    A4: "3.wav",
    A5: "4.wav",
	}
}).toDestination();

const vol = new Tone.Volume(-12).toDestination();

const synth = new Tone.MonoSynth({
	oscillator: {
		type: "sine"
	},
	envelope: {
		attack: 0.0005,
    decay: 0.7,
		sustain: 0.002,
		release: 0.5
	}
}).connect(vol);

var voiceseq = new Tone.Sequence((time, note) => {sampler.triggerAttackRelease(note, 1, time);}, VTakt, '4n');
var synthseq = new Tone.Sequence((time, note) => {synth.triggerAttackRelease(note, 1, time);}, STakt, '4n');
Tone.Transport.bpm.value = 100;


function stasto() {
  if (Play == false) {
    Tone.Transport.start();
    Tone.context.resume();
    VCheckbox.disabled = true;
    SCheckbox.disabled = true;
    Start();
    Play = true;
    document.getElementById("start").value = "Stop";
  } else {
    Tone.Transport.stop();
    VCheckbox.disabled = false;
    SCheckbox.disabled = false;
    document.getElementById("alert").innerHTML="";
    Stop();
    Play = false;
    document.getElementById("start").value = "Start";
  }
}

function setBPM(){
  var count = 0;
  var found = false;

  BPM = document.getElementById("BPM").value;
  console.log(BPM);
  Tone.Transport.bpm.value = BPM;
  document.getElementById("BPMAnzeige").innerHTML = BPM;

  while (!found) {
    if(BPM <= Tempi[count][1]) {
      document.getElementById("Tempi").innerHTML = Tempi[count][0];
      found = true;
      console.log(Tempi[count][0]);
    } else {
      count = count + 1;
    }
  }
}

function TaktSetzen(Takt) {
  switch (Takt) {
    case '4':
      Stop();
      VTakt = ["A2", "A3","A4","A5"];
      STakt = ["A4","A3","A3","A3"];
      console.log(Takt);
      Sequence(VTakt, STakt);
      Start();
      break; 
    case '3':
      Stop();
      VTakt = ["A2", "A3","A4"];
      STakt = ["A4","A3","A3"];
      console.log(Takt);
      Sequence(VTakt, STakt);
      Start();
      break; 
    case '2':
      Stop();
      VTakt = ["A2","A3"];
      STakt = ["A4","A3"];
      console.log(Takt);
      Sequence(VTakt, STakt);
      Start();
  }
}

function Start(){

  if(VCheckbox.checked == false && SCheckbox.checked == false){
    document.getElementById("alert").innerHTML="Keine Klangquelle!";
  }
  
  
  if(VCheckbox.checked) {
    voiceseq.start(0);
  }

  if(SCheckbox.checked) {
    synthseq.start(0.099);
  }  
}

function Stop() {
  voiceseq.stop(0);
  synthseq.stop(0);
}

function Sequence(VTakt, STakt) {
  voiceseq = new Tone.Sequence((time, note) => {sampler.triggerAttackRelease(note, 1, time);}, VTakt, '4n');
  synthseq = new Tone.Sequence((time, note) => {synth.triggerAttackRelease(note, 1, time);}, STakt, '4n');
}

window.addEventListener("DOMContentLoaded", () => {

  window.addEventListener("keypress", function(event) {
 
     if (event.key == " ") {
      stasto();
     }
 
  }, true);

});