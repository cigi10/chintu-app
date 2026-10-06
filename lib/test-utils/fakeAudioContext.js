// A minimal stand-in for the Web Audio API that records what the timer
// sounds schedule: every oscillator's start/stop time and every gain ramp.
export class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = "suspended";
    this.destination = { kind: "destination" };
    this.oscillators = [];
    this.resumeCalls = 0;
  }
  resume() { this.resumeCalls++; this.state = "running"; return Promise.resolve(); }
  createGain() {
    const ramps = [];
    return {
      ramps,
      gain: {
        value: 1,
        setValueAtTime: (v, t) => ramps.push({ v, t }),
        exponentialRampToValueAtTime: (v, t) => ramps.push({ v, t }),
      },
      connect() {}, disconnect() { this.disconnected = true; },
    };
  }
  createOscillator() {
    const osc = {
      type: "sine", startAt: null, stopAt: null, stopCalls: 0,
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {},
      start(t) { osc.startAt = t; },
      stop(t) { osc.stopCalls++; osc.stopAt = t ?? 0; },
    };
    this.oscillators.push(osc);
    return osc;
  }
}
