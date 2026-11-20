/**
 * Web Audio API luxury melodic chime synthesizer.
 * Synthesizes a delicate, upscale 2-tone melodic chime (520Hz -> 659.25Hz: C5 to E5).
 * Zero external audio file dependency.
 */
export function playSalonChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Play tone 1 (523.25 Hz - C5)
    playTone(ctx, 523.25, 0.0, 0.6);

    // Play tone 2 (659.25 Hz - E5) slightly delayed
    playTone(ctx, 659.25, 0.2, 0.9);
  } catch (err) {
    console.warn("Web Audio chime could not play due to user gesture requirement:", err);
  }
}

function playTone(ctx: AudioContext, freq: number, startTimeOffset: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

  // Soft attack and luxury exponential decay
  gain.gain.setValueAtTime(0.001, ctx.currentTime + startTimeOffset);
  gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + startTimeOffset + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTimeOffset + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTimeOffset);
  osc.stop(ctx.currentTime + startTimeOffset + duration + 0.1);
}
