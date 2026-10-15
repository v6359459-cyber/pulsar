// Synthesized sound design: deep, reverberant, no audio files.
const Sound = (() => {
  let A = null;
  let volume = 0.8;
  function init() {
    if (A) return A;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.connect(ctx.destination);
      const master = ctx.createGain(); master.gain.value = volume; master.connect(comp);
      const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      const rev = ctx.createConvolver(); rev.buffer = ir; const wet = ctx.createGain(); wet.gain.value = .45; rev.connect(wet); wet.connect(master);
      const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0); for (let j = 0; j < nd.length; j++) nd[j] = Math.random() * 2 - 1;
      A = { ctx, master, rev, noise: nb };
    } catch (e) { A = null; }
    return A;
  }
  const out = (n, send) => { n.connect(A.master); if (send) n.connect(A.rev); };
  const env = (g, t, a, p, d) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(p, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); };
  function osc(t, type, f0, f1, dur, peak, a, send, filt) {
    const o = A.ctx.createOscillator(), g = A.ctx.createGain(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a || .01, peak, dur); let n = o;
    if (filt) { const f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filt; o.connect(f); n = f; }
    n.connect(g); out(g, send); o.start(t); o.stop(t + dur + .1);
  }
  function nz(t, type, f0, f1, q, dur, peak, a, send) {
    const s = A.ctx.createBufferSource(), f = A.ctx.createBiquadFilter(), g = A.ctx.createGain();
    s.buffer = A.noise; f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a || .005, peak, dur); s.connect(f); f.connect(g); out(g, send); s.start(t); s.stop(t + dur + .1);
  }
  const boom = (t, v) => { osc(t, 'sine', 62, 26, 1.8, .9 * v, .015, true); osc(t, 'triangle', 124, 40, .5, .25 * v, .01); nz(t, 'lowpass', 180, 60, .7, .6, .5 * v, .005, true); };
  const whoosh = (t, up) => nz(t, 'bandpass', up ? 300 : 2400, up ? 2600 : 260, 1.4, .75, .35, .35, true);
  const servo = t => { osc(t, 'sawtooth', 90, 180, .42, .07, .04, false, 700); osc(t, 'triangle', 360, 720, .38, .03, .05, true); nz(t, 'highpass', 4000, 4000, .7, .03, .18, .002); };
  const clunk = t => { nz(t, 'lowpass', 700, 140, .8, .18, .6, .003, true); osc(t, 'sine', 95, 42, .32, .6, .004); nz(t + .07, 'highpass', 3500, 3500, .7, .025, .22, .002, true); };
  function hum(t, dur) {
    const o = A.ctx.createOscillator(), f = A.ctx.createBiquadFilter(), g = A.ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(28, t); o.frequency.exponentialRampToValueAtTime(92, t + 2.4);
    f.type = 'lowpass'; f.frequency.value = 260;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.06, t + 1.5); g.gain.setValueAtTime(.06, t + dur - 1.2); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(f); f.connect(g); out(g); o.start(t); o.stop(t + dur + .1);
  }
  const pad = t => { [55, 82.4, 110, 164.8, 220, 329.6].forEach((f, i) => osc(t + i * .05, i % 2 ? 'triangle' : 'sine', f, f * 1.002, 3.6, .07, 1.1, true)); osc(t + .6, 'sine', 1318, 1320, 2.4, .02, .4, true); };
  const tickAt = (t, f) => osc(t, 'sine', f || 1600, (f || 1600) * 1.01, .09, .06, .003, true);
  const now = () => A.ctx.currentTime + .05;
  return {
    setVolume(v) { volume = v; if (A) A.master.gain.value = v; },
    intro() {
      if (!init()) return; const n = now();
      boom(n, 1); hum(n + .2, 9.4); whoosh(n + 1, true); clunk(n + 1.05);
      [1.8, 2.15, 2.5, 2.85, 3.2].forEach((d, i) => { servo(n + d); tickAt(n + d + .8, 900 + i * 180); servo(n + d + 4.2); clunk(n + d + 4.95); });
      osc(n + 4.6, 'sine', 700, 2600, 1.3, .05, .2, true);
      whoosh(n + 8.5, false); clunk(n + 9); boom(n + 9, .8); pad(n + 9);
    },
    stopAll() { if (A) { try { A.ctx.close(); } catch {} A = null; } },
    scan() {
      if (!init()) return; const n = now();
      for (let i = 0; i < 5; i++) { osc(n + .4 + i * .5, 'sine', 300, 600, .9, .025, .3, true); tickAt(n + 1.4 + i * .5, 1200 + i * 120); }
      osc(n + 3.4, 'sine', 660, 662, 1.6, .05, .05, true); osc(n + 3.45, 'sine', 990, 992, 1.8, .04, .05, true); boom(n + 3.4, .4);
    },
    tick(f) { if (init()) tickAt(now(), f); },
    done() { if (init()) { const n = now(); tickAt(n, 1320); tickAt(n + .12, 1980); } },
    soft() { if (init()) osc(now(), 'sine', 520, 540, .25, .03, .02, true); }
  };
})();
