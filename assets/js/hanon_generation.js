// Generate Hanon Sheet Music in arbitrary keys. 
// The current approach doesn't work, yet. It may be feasible, but using
// https://opensheetmusicdisplay.github.io/demo/ may be a better approach, since it merely requires setting up opensheetmusticdisplay and then generating musicxml files.

const noteToScaleDegree = {
  "C": 0,
  "D": 1,
  "E": 2,
  "F": 3,
  "G": 4,
  "A": 5,
  "B": 6
};  
const noteToOctave = {
  "C": 4,
  "D": 4,
  "E": 4,
  "F": 4,
  "G": 4,
  "A": 4,
  "B": 3 // We make "B" an octave lower because it typically (always?) occurs a half-step below the "C" in Hanon's, rather than a 7th above.
};

const noteNamesWithSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteNamesWithFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const majorScaleDegreeToSemitones = [0, 2, 4, 5, 7, 9, 11];

function raiseByScaleDegrees(notes, raiseNDegrees, semitonesTransposeAboveC = 0) {
  return notes.map(note => {
    const currentDegree = noteToScaleDegree[note];
    const newDegree = (currentDegree + raiseNDegrees) % 7;
    const octaveLabel = Math.floor((currentDegree + raiseNDegrees) / 7) + noteToOctave[note];
    const noteNumber = (majorScaleDegreeToSemitones[newDegree] + semitonesTransposeAboveC) % 12;
    return noteNamesWithSharps[noteNumber] + "/" + octaveLabel;
    // return str(Object.keys(noteToScaleDegree).find(key => noteToScaleDegree[key] === newDegree)) + + "/" + str(octaveLabel);  
    });
}

// Read the up pattern from the HTML as a comma separated list of notes in C major, and convert it to an array of notes.
let upPattern               = document.getElementById("hanon-up-pattern")                .innerHTML.split(",").map(note => note.trim());
let upRightFingersPattern   = document.getElementById("hanon-up-right-fingers-pattern")  .innerHTML.split(",").map(note => note.trim());
let upLeftFingersPattern    = document.getElementById("hanon-up-left-fingers-pattern")   .innerHTML.split(",").map(note => note.trim());
let downPattern             = document.getElementById("hanon-down-pattern")              .innerHTML.split(",").map(note => note.trim());
let downRightFingersPattern = document.getElementById("hanon-down-right-fingers-pattern").innerHTML.split(",").map(note => note.trim());
let downLeftFingersPattern  = document.getElementById("hanon-down-left-fingers-pattern").innerHTML.split(",").map(note => note.trim());
console.log("Up pattern: "   + upPattern);
console.log("Up Fingers: "   + upRightFingersPattern);
console.log("Down pattern: " + downPattern);
console.log("Down Fingers: " + downRightFingersPattern);

let upHanon = [];
let upFingers = [];
for (let scaleDegree = 0; scaleDegree < 4; scaleDegree++) {
  // upHanon += raiseByScaleDegrees(upPattern, scaleDegree).join("-") + " | ";
  // upFingers += upRightFingersPattern.join(",") + " ,|,";
  let notes = raiseByScaleDegrees(upPattern, scaleDegree)
  upHanon = upHanon.concat(notes);
  console.log("notes: " + notes);
  console.log("upHanon (after concat): " + upHanon); 
  upFingers = upFingers.concat(upRightFingersPattern); 
}
// upHanon += "| |";
// hanon 
// fingers += "| |";
downHanon = [];
downFingers = [];
for (let scaleDegree = 3; scaleDegree >= 0; scaleDegree--) {
  downHanon = downHanon.concat(raiseByScaleDegrees(downPattern, scaleDegree));
  downFingers = downFingers.concat(downRightFingersPattern);
}

console.log("notes: " + upHanon); // ["D", "E", "F#", "G", "A", "B", "C#"]
document.getElementById("hanon-up-notes").innerHTML = upHanon;
document.getElementById("hanon-up-fingers").innerHTML = upFingers;
document.getElementById("hanon-down-notes").innerHTML = downHanon;
document.getElementById("hanon-down-fingers").innerHTML = downFingers;

let debugStr = "Up\n";
for (let i = 0; i < upHanon.length; i++) {
  debugStr += upHanon[i].replace(/\/\d/g, '') + " (" + upFingers[i] + "), ";
  if ((i+1) % 8 == 0) {
    debugStr += "\n";
  }
}
debugStr += "\nDown\n";
for (let i = 0; i < downHanon.length; i++) {
  debugStr += downHanon[i].replace(/\/\d/g, '') + " (" + downFingers[i] + "), ";
  if ((i+1) % 8 == 0) {
    debugStr += "\n";
  }
}


document.getElementById("hanon-debug").innerHTML = debugStr;
// document.getElementById("hanon-up-notes-debug").innerHTML = upHanon.join(',');
// document.getElementById("hanon-up-fingers-debug").innerHTML = upFingers.join(',');//.replace(/ ,\|,/g, ' ,|,<br>');
// document.getElementById("hanon-down-notes-debug").innerHTML = downHanon.join(',');//.replace(/\| /g, '|<br>');
// document.getElementById("hanon-down-fingers-debug").innerHTML = downFingers.join(',');//.replace(/ ,\|,/g, ' ,|,<br>');

const { Renderer, Stave, StaveNote, Voice, Formatter, Factory, Beam, TextNote } = Vex.Flow;

/*
const vf = new Factory({
  renderer: { elementId: 'output', width: 500, height: 100 },
});

const score = vf.EasyScore();
const system = vf.System();

// Create the notes
const notes = []

upHanon.forEach(note => {
  notes.push(new StaveNote({
    keys: [note],
    duration: "16"
  }));
});
console.log("upHanon:", upHanon)
console.log("notes:", notes)

//   // A quarter-note C.
//   new StaveNote({ keys: ["a/4"], duration: "q" }),
//   new StaveNote({ keys: ["b/4"], duration: "q" }),
//   new StaveNote({ keys: ["c/4"], duration: "q" }),
//   new StaveNote({ keys: ["d/4"], duration: "q" }),
//   new StaveNote({ keys: ["e/4"], duration: "q" }),
//   new StaveNote({ keys: ["f/4"], duration: "q" }),
//   new StaveNote({ keys: ["g/4"], duration: "q" }),
// ];


// Create an SVG renderer and attach it to the DIV element named "output".
const div = document.getElementById("output");
const renderer = new Renderer(div, Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(500, 400);
const context = renderer.getContext();

// Create a stave of width 400 at position 10, 40 on the canvas.
const stave = new Stave(20, 20, 500);
const bassStave = new Stave(20, 20, 500);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");
bassStave.addClef("bass").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();
bassStave.setContext(context).draw();

// Create a voice in 4/4 and add above notes
// console.log("notes.length:", notes.length)
// console.log("notes:", notes)
let notesPerBeat = 4;
const voice = new Voice({ num_beats: notes.length / notesPerBeat, beat_value: 4 });
voice.addTickables(notes);


const beams = Beam.generateBeams(notes);
Formatter.FormatAndDraw(context, stave, notes);
beams.forEach((b) => {
    b.setContext(context).draw();
});

// Format and justify the notes to 400 pixels.
console.log("voice:", voice)
// new Formatter().joinVoices([voice]).format([voice], 700);

// Render voice
voice.draw(context, stave);

// fingering_text = new TextNote(noteStruct);
// var word = new Vex.Flow.TextNote({ text: 'a',  duration: 'q' }).setStave(stave);

system
  .addStave({
    voices: [
      score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
      score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
    ],
  })
  .addClef('treble')
  .addTimeSignature('4/4');
system
  .addStave({
    voices: [
      score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
      score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
    ],
  })
  .addClef('treble')
  .addTimeSignature('4/4');
system.addConnector()

vf.draw();
*/ 


const vf = new Factory({
  renderer: { elementId: 'output2', width: 800, height: 700 },
});

const score = vf.EasyScore();
const system = vf.System();

// !! Use the approach described here for adding fingerings: https://github.com/0xfe/vexflow/pull/813
system
  .addStave({
    voices: [
      score.voice(score.notes('C#5/16[fingerings="1"],B4, A4,G#4, C4,D4, E4, F4,B4, A4,G#4, C4,D4, E4, F4,A4', { stem: 'up' })),
    ],
  })
  .addClef('treble')
  .addTimeSignature('4/4');
system
  .addStave({
    voices: [
      score.voice(score.notes('C#5/q, B4, A4, G#4 | A4, ', { stem: 'down' }))
    ],
  })
  .addClef('treble')
  .addTimeSignature('4/4');
system.addConnector()

let notes = system.getVoices()[0].getTickables();
const beams = Beam.generateBeams(notes);
context = system.getContext();
staves = system.getStaves();

console.log("context:", context)
console.log("staves:", staves)
console.log("notes:", notes)
// Formatter.FormatAndDraw(context, staves, notes);
// beams.forEach((b) => {
//     b.setContext(context).draw();
// });
// 
vf.draw();
console.log("context:", context)
console.log("staves:", staves)
console.log("notes:", notes)
