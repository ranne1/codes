// Web Audio API를 위한 오디오 컨텍스트 관리 - 클래식 기타 사운드
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverb: ConvolverNode | null = null;

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // 마스터 게인 노드
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3; // 전체 볼륨
      
      // 리버브 효과를 위한 컨볼버 노드
      this.reverb = this.audioContext.createConvolver();
      await this.createReverbImpulse();
      
      // 오디오 체인: 각 노트 → 리버브 → 마스터 게인 → 출력
      this.reverb.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // 리버브를 위한 임펄스 응답 생성
  private async createReverbImpulse() {
    if (!this.audioContext || !this.reverb) return;
    
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * 1.5; // 1.5초 리버브
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
      }
    }
    
    this.reverb.buffer = impulse;
  }

  // 음표를 주파수로 변환 (옥타브 정보 포함)
  noteToFrequency(note: string, octave: number = 4): number {
    const baseFrequencies: { [key: string]: number } = {
      'C': 261.63,   // C4
      'C#': 277.18, 'Db': 277.18,
      'D': 293.66,
      'D#': 311.13, 'Eb': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99, 'Gb': 369.99,
      'G': 392.00,
      'G#': 415.30, 'Ab': 415.30,
      'A': 440.00,
      'A#': 466.16, 'Bb': 466.16,
      'B': 493.88
    };
    
    const baseFreq = baseFrequencies[note] || 440;
    // 옥타브에 따라 주파수 조정 (각 옥타브마다 2배씩)
    return baseFreq * Math.pow(2, octave - 4);
  }

  // 기타 줄별 개방현 주파수 (4프렛까지의 주파수 계산용)
  getStringFrequency(stringNumber: number, fret: number): number {
    // 기타 줄 번호: 1(High E), 2(B), 3(G), 4(D), 5(A), 6(Low E)
    const openStringFrequencies: { [key: number]: number } = {
      1: 329.63, // High E
      2: 246.94, // B
      3: 196.00, // G
      4: 146.83, // D
      5: 110.00, // A
      6: 82.41   // Low E
    };
    
    const openFreq = openStringFrequencies[stringNumber] || 440;
    // 각 프렛마다 주파수는 2^(1/12) 배씩 증가
    return openFreq * Math.pow(2, fret / 12);
  }

  // 기타 사운드 생성 (하모닉 추가)
  private createGuitarSound(frequency: number, startTime: number, duration: number) {
    if (!this.audioContext || !this.reverb) return;

    // 기본 주파수와 하모닉들
    const harmonics = [
      { freq: frequency, gain: 0.8 },          // 기본 주파수
      { freq: frequency * 2, gain: 0.3 },      // 2차 하모닉
      { freq: frequency * 3, gain: 0.15 },     // 3차 하모닉
      { freq: frequency * 4, gain: 0.1 },      // 4차 하모닉
      { freq: frequency * 5, gain: 0.05 },     // 5차 하모닉
    ];

    harmonics.forEach((harmonic) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();
      
      // 기타 사운드를 위한 필터 (고주파 약간 차단)
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 1;
      
      // 연결: 오실레이터 → 필터 → 게인 → 리버브
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.reverb!);
      
      // 주파수 설정
      oscillator.frequency.value = harmonic.freq;
      oscillator.type = 'sawtooth'; // 기타와 유사한 파형
      
      // ADSR 엔벨로프 (어택, 디케이, 서스테인, 릴리즈)
      const attackTime = 0.02;   // 빠른 어택
      const decayTime = 0.1;     // 짧은 디케이
      const sustainLevel = harmonic.gain * 0.6; // 서스테인 레벨
      const releaseTime = duration * 0.8; // 긴 릴리즈
      
      gainNode.gain.setValueAtTime(0, startTime);
      // 어택
      gainNode.gain.linearRampToValueAtTime(harmonic.gain, startTime + attackTime);
      // 디케이
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
      // 릴리즈
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  // 코드 재생 (아르페지오 스타일)
  async playChord(notes: string[], duration: number = 2500) {
    await this.initialize();
    
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    const noteDelay = 0.25; // 각 음 사이의 간격
    const noteDuration = 2.0; // 각 음의 지속 시간

    notes.forEach((note, index) => {
      const frequency = this.noteToFrequency(note);
      const noteStartTime = startTime + (index * noteDelay);
      this.createGuitarSound(frequency, noteStartTime, noteDuration);
    });
  }

  // 단일 음 재생
  async playNote(note: string, duration: number = 1500, octave: number = 4) {
    await this.initialize();
    
    if (!this.audioContext) return;

    const frequency = this.noteToFrequency(note, octave);
    const startTime = this.audioContext.currentTime;
    this.createGuitarSound(frequency, startTime, duration / 1000);
  }

  // 지판 프렛 재생 (줄 번호와 프렛 번호로)
  async playFret(stringNumber: number, fret: number, duration: number = 800) {
    await this.initialize();
    
    if (!this.audioContext) return;

    const frequency = this.getStringFrequency(stringNumber, fret);
    const startTime = this.audioContext.currentTime;
    this.createGuitarSound(frequency, startTime, duration / 1000);
  }

  // 코드 데이터로부터 코드 재생 (frets 배열 사용)
  async playChordFromFrets(frets: (number | null)[], duration: number = 2500) {
    await this.initialize();
    
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    const noteDelay = 0.25; // 각 음 사이의 간격
    const noteDuration = 2.0; // 각 음의 지속 시간

    let noteIndex = 0;
    frets.forEach((fret, stringIndex) => {
      if (fret !== null) {
        const stringNumber = stringIndex + 1; // 배열 인덱스를 줄 번호로 변환
        const frequency = this.getStringFrequency(stringNumber, fret);
        const noteStartTime = startTime + (noteIndex * noteDelay);
        this.createGuitarSound(frequency, noteStartTime, noteDuration);
        noteIndex++;
      }
    });
  }
}