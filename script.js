import * as Tonal from 'https://cdn.skypack.dev/@tonaljs/tonal';
import * as Tone from 'https://cdn.skypack.dev/tone';

const output = document.getElementById("output");
const genreSelect = document.getElementById("genre");
const numChordsSelect = document.getElementById("numChords");
const generateBtn = document.getElementById("generate");

const majorKeys = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];

// main event handler
generateBtn.onclick = () => {
  const genre = genreSelect.value;
  const numChords = parseInt(numChordsSelect.value);
  const key = majorKeys [Math.floor(Math.random() * majorKeys.length)];
  const scale = Tonal.Scale.get(`${key} major`).notes;
  
  let baseProgression = [];

  // genre-specific chords/ base pool
  if (genre === "pop") {               // I – V – vi – IV
    baseProgression = [
      Tonal.Chord.getChord("maj", scale[0]).symbol, // C
      Tonal.Chord.getChord("maj", scale[4]).symbol, // G
      Tonal.Chord.getChord("min", scale[5]).symbol, // Am
      Tonal.Chord.getChord("maj", scale[3]).symbol  // F
    ];
  } else if (genre === "jazz") {        // ii7 – V7 – Imaj7 – vi7
    baseProgression = [
      scale[1] + "m7",  // Dm7
      scale[4] + "7",   // G7
      scale[0] + "maj7",// Cmaj7
      scale[5] + "m7"   // Am7
    ];
  } else if (genre === "rock") {        // I – ♭VII – IV – I
    baseProgression = [
      scale[0],   // C
      "Bb",       // ♭VII
      scale[3],   // F
      scale[0]    // C
    ];
  }

  // adjust progression to match number of chords and randomly pick them
  let progression = [];
for (let i = 0; i < numChords; i++) {
    const randomChord = baseProgression[Math.floor(Math.random() * baseProgression.length)];
    progression.push(randomChord); 
}

//if all chords are the same, regenerate
const allSame = progression.every(chord => chord === progression [0]);
if (allSame && baseProgression.length > 1) {
    // Rebuild progression
    progression = [];
    for (let i = 0; i < numChords; i++) {
      const randomChord = baseProgression[Math.floor(Math.random() * baseProgression.length)];
      progression.push(randomChord);
    }
  }

  // show progression
  output.innerHTML = "";

  const keyDisplay = document.createElement("h3");
  keyDisplay.textContent = `Key: ${key} Major`;
  output.appendChild(keyDisplay);
  
  //chord blocks
  progression.forEach((chord) => {
    const chordBlock = document.createElement("div");
    chordBlock.className = "chord-block";

    const chordText = document.createElement("span");
    chordText.textContent = chord;

    const playBtn = document.createElement("button");
    playBtn.textContent = "Play";
    playBtn.onclick = async () => {
      const synth = new Tone.PolySynth().toDestination();
      await Tone.start(); // unlock audio
      const notes = Tonal.Chord.get(chord).notes.map(n => n + "4");
      synth.triggerAttackRelease(notes, "1n");
    };

    chordBlock.appendChild(chordText);
    chordBlock.appendChild(playBtn);
    output.appendChild(chordBlock);
  });

  //play all button!
  const playAllBtn = document.createElement("button");
  playAllBtn.textContent = "Play All";
  playAllBtn.style.marginTop = "20px";
  playAllBtn.onclick = async () => {
    const synth = new Tone.PolySynth().toDestination();
    await Tone.start();

    for (const chord of progression) {
      const notes = Tonal.Chord.get(chord).notes.map(n => n + "4");
      synth.triggerAttackRelease(notes, "1n");
      await new Promise(resolve => setTimeout(resolve, 2000)); // 0.8 sec between chords
    }
  };
  output.appendChild(playAllBtn);
};
