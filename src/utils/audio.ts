class MagicForestAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private noiseNode: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private chimeInterval: number | null = null;

  start() {
    if (this.isPlaying) return;
    
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3; // Low volume
    this.masterGain.connect(this.ctx.destination);
    
    this.isPlaying = true;
    this.playWind();
    this.scheduleChimes();
  }
  
  stop() {
    this.isPlaying = false;
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
    }
    if (this.lfo) {
      this.lfo.stop();
      this.lfo.disconnect();
    }
    if (this.chimeInterval) {
      window.clearInterval(this.chimeInterval);
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
        setTimeout(() => {
          this.masterGain?.disconnect();
        }, 1000);
      } catch (e) {
        this.masterGain.disconnect();
      }
    }
  }

  private playWind() {
    if (!this.ctx || !this.masterGain) return;
    
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate pink-ish noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.value = 400; // Base frequency
    this.windFilter.Q.value = 1;

    // LFO for howling wind effect
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.15; // Slow changing wind
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300; // Frequency variation amount
    
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    
    const windVolume = this.ctx.createGain();
    windVolume.gain.value = 0.4;
    
    this.noiseNode.connect(this.windFilter);
    this.windFilter.connect(windVolume);
    windVolume.connect(this.masterGain);
    
    this.lfo.start();
    this.noiseNode.start();
  }

  private scheduleChimes() {
    this.chimeInterval = window.setInterval(() => {
      if (!this.isPlaying || Math.random() > 0.4) return; // 40% chance every 2.5 seconds to play a chime
      this.playChime();
    }, 2500);
  }

  private playChime() {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    // High pitch chime frequency
    const freqs = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32]; // Pentatonic notes
    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Envelope for chime (sharp attack, long decay)
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5); // Decay
    
    osc.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 3);
  }
}

export const magicAudio = new MagicForestAudio();
