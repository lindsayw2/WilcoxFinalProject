<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Simple Chord Generator</title>
  <script type="module">
    import * as Tonal from 'https://cdn.skypack.dev/@tonaljs/tonal';
    import * as Tone from 'https://cdn.skypack.dev/tone';

    const output = document.getElementById("output");

    document.getElementById("generate").onclick = () => {
      const scale = Tonal.Scale.get("C major").notes;
      const progression = [];

      for (let i = 0; i < 4; i++) {
        const root = scale[Math.floor(Math.random() * scale.length)];
        const chord = root + "maj7";
        progression.push(chord);
      }

      output.innerHTML = "";

      const text = document.createElement("div");
      text.textContent = "Chords: " + progression.join(" | ");
      output.appendChild(text);

      const playButton = document.createElement("button");
      playButton.textContent = "Play All";

      playButton.onclick = async () => {
        const synth = new Tone.PolySynth().toDestination();
        await Tone.start(); // required by browser security

        for (const chord of progression) {
          const notes = Tonal.Chord.get(chord).notes.map(n => n + "4");
          synth.triggerAttackRelease(notes, "1n");
          await new Promise(r => setTimeout(r, 700));
        }
      };

      output.appendChild(playButton);
    };
  </script>
</head>
<body>
  <h2>Simple Chord Generator</h2>
  <button id="generate">Generate Chords</button>
  <div id="output" style="margin-top:20px;"></div>
</body>
</html>
