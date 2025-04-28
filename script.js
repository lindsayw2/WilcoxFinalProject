
    import * as Tonal from 'https://cdn.skypack.dev/@tonaljs/tonal';
    import * as Tone from 'https://cdn.skypack.dev/tone';

    const output = document.getElementById("output");
    const genreSelect = document.getElementById("genre");
    const numChordsSelect = document.getElementById("numChords");
    const generateBtn = document.getElementById("generate");

    //main event handler
    generateBtn.onclick = () => {
      const genre = genreSelect.value;
      const numChords = parseInt (numChordsSelect.value);
      const key = "C";
      const scale = Tonal.Scale.get(`${key} major`) .notes;
     
      let baseProgression = [];
    

//genre specifc chords
if (genre === "pop") {               // I – V – vi – IV
  progression = [
    Tonal.Chord.getChord("maj", scale[0]).symbol, // C
    Tonal.Chord.getChord("maj", scale[4]).symbol, // G
    Tonal.Chord.getChord("min", scale[5]).symbol, // Am
    Tonal.Chord.getChord("maj", scale[3]).symbol  // F
  ];
} else if (genre === "jazz") {       // ii7 – V7 – Imaj7 – vi7
  progression = [
    scale[1] + "m7",   // Dm7
    scale[4] + "7",    // G7
    scale[0] + "maj7", // Cmaj7
    scale[5] + "m7"    // Am7
  ];
} else if (genre === "rock") {       // I – ♭VII – IV – I
  progression = [
    scale[0],          // C
    "Bb",              // ♭VII
    scale[3],          // F
    scale[0]           // C
  ];
};

//adjust progression to match number of chords
let progression = [];
while (progression.length < numChords) {
  progression.push(baseProgression[progression.length % baseProgression.length]);
}

//show progression
output.innerHTML = "";
progression.forEach((chord, index) => {
  const chordBlock = document.createElement("div");
  chordBlock.className = "chord-block";

  const chordText = document.createElement("span");
  chordText.textContent = chord;

  const playBtn = document.createElement("button");
  playBtn.textContent = "Play";
  playBtn.onclick = async () => {
    const synth = new Tone.PolySynth().toDestination();
    await Tone.start(); // audio

    const notes = Tonal.Chord.get(chord).notes.map(n => n + "4");
    synth.triggerAttackRelease(notes, "1n");
  };

  chordBlock.appendChild(chordText);
  chordBlock.appendChild(playBtn);
  output.appendChild(chordBlock);
});
    };

