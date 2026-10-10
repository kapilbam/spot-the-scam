/* audio.js
 * Tiny synthesized sound effects (Web Audio API). No audio files needed.
 * `muted` is toggled from the account bar in app.js.
 */

// Global state for sound muting preference and the Web Audio Context
let muted = false, AC; // the saved preference is restored by boot() in app.js

// Synthesizes a single audio tone with frequency (f), duration (d), and delay/wait time (w)
function tone(f, d = .12, w = 0) {
  if (muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle';
    o.frequency.value = f;
    g.gain.value = .06;
    o.connect(g);
    g.connect(AC.destination);
    const t = AC.currentTime + w;
    o.start(t);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.stop(t + d);
  } catch (e) {}
}

// Convenience wrapper functions for positive (success/correct) and negative (error/incorrect) feedback sounds
const ok = () => { tone(660); tone(880, .15, .1); },
      no = () => tone(220, .25);