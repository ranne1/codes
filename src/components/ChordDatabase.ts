// 4프렛 안에서 가능한 모든 기타 코드 데이터베이스

export interface FretPosition {
  string: number; // 1-6 (6번줄이 가장 두꺼운 줄)
  fret: number;   // 0-4 (0은 개방현)
}

export interface ChordData {
  id: string;
  name: string;
  frets: (number | null)[]; // 6개 현, null은 뮤트, 0은 개방현
  fingers: (number | null)[]; // 6개 현에 대응하는 손가락 번호 (1-4), null은 뮤트나 개방현
  startFret?: number; // 시작 프렛 번호 (기본값: 1)
}

export interface ChordPattern {
  name: string;
  positions: FretPosition[];
  description: string;
}

export interface ChordInfo {
  name: string;
  fullName: string;
  positions: FretPosition[];
  difficulty: "초급" | "중급" | "고급";
  notes: string[];
  description: string;
  tips: string[];
  category: "메이저" | "마이너" | "세븐스" | "마이너7" | "메이저7" | "서스펜디드" | "디미니쉬드" | "어그멘티드" | "식스" | "애드나인" | "바레";
}

// 기본 메이저 코드 (7개)
export const majorChords: ChordData[] = [
  { 
    id: "C", 
    name: "C", 
    frets: [0, 1, 0, 2, 3, null], 
    fingers: [null, 1, null, 2, 3, null] 
  },
  { 
    id: "D", 
    name: "D", 
    frets: [2, 3, 2, 0, null, null], 
    fingers: [1, 3, 2, null, null, null] 
  },
  { 
    id: "E", 
    name: "E", 
    frets: [0, 0, 1, 2, 2, 0], 
    fingers: [null, null, 1, 2, 3, null] 
  },
  { 
    id: "F", 
    name: "F", 
    frets: [1, 1, 2, 3, 3, 1], 
    fingers: [1, 1, 2, 4, 3, 1] 
  },
  { 
    id: "G", 
    name: "G", 
    frets: [3, 0, 0, 0, 2, 3], 
    fingers: [3, null, null, null, 2, 4] 
  },
  { 
    id: "A", 
    name: "A", 
    frets: [0, 2, 2, 2, 0, null], 
    fingers: [null, 1, 2, 3, null, null] 
  },
  { 
    id: "B", 
    name: "B", 
    frets: [2, 4, 4, 4, 2, null], 
    fingers: [1, 4, 3, 2, 1, null] 
  },
];

// 마이너 코드 (7개)
export const minorChords: ChordData[] = [
  { 
    id: "Cm", 
    name: "Cm", 
    frets: [4, 1, 0, 1, 3, null], 
    fingers: [4, 2, 0, 1, 3, null] 
  },
  { 
    id: "Dm", 
    name: "Dm", 
    frets: [1, 3, 2, 0, null, null], 
    fingers: [1, 4, 2, null, null, null] 
  },
  { 
    id: "Em", 
    name: "Em", 
    frets: [0, 0, 0, 2, 2, 0], 
    fingers: [null, null, null, 2, 3, null] 
  },
  { 
    id: "Fm", 
    name: "Fm", 
    frets: [1, 1, 1, 3, 3, 1], 
    fingers: [1, 1, 1, 4, 3, 1] 
  },
  { 
    id: "Gm", 
    name: "Gm", 
    frets: [2, 2, 2, 4, 4, 2], 
    fingers: [1, 1, 1, 4, 3, 1],
    startFret: 2
  },
  { 
    id: "Am", 
    name: "Am", 
    frets: [0, 1, 2, 2, 0, null], 
    fingers: [null, 1, 2, 3, null, null] 
  },
  { 
    id: "Bm", 
    name: "Bm", 
    frets: [2, 3, 4, 4, 2, null], 
    fingers: [1, 2, 4, 3, 1, null] 
  },
];

// 도미넌트 7th 코드 (7개)
export const dominant7Chords: ChordData[] = [
  { 
    id: "C7", 
    name: "C7", 
    frets: [0, 1, 3, 2, 3, null], 
    fingers: [null, 1, 4, 2, 3, null] 
  },
  { 
    id: "D7", 
    name: "D7", 
    frets: [2, 1, 2, 0, null, null], 
    fingers: [2, 1, 3, null, null, null] 
  },
  { 
    id: "E7", 
    name: "E7", 
    frets: [0, 0, 1, 0, 2, 0], 
    fingers: [null, null, 1, null, 2, null] 
  },
  { 
    id: "F7", 
    name: "F7", 
    frets: [1, 1, 2, 1, 3, 1], 
    fingers: [1, 1, 2, 1, 3, 1] 
  },
  { 
    id: "G7", 
    name: "G7", 
    frets: [1, 0, 0, 0, 2, 3], 
    fingers: [1, null, null, null, 2, 3] 
  },
  { 
    id: "A7", 
    name: "A7", 
    frets: [0, 2, 0, 2, 0, null], 
    fingers: [null, 2, null, 3, null, null] 
  },
  { 
    id: "B7", 
    name: "B7", 
    frets: [2, 1, 2, 0, 2, null], 
    fingers: [2, 1, 3, null, 4, null] 
  }
];

// 마이너 7th 코드 (7개)
export const minor7Chords: ChordData[] = [
  { 
    id: "Cm7", 
    name: "Cm7", 
    frets: [null, 1, 3, 1, 3, null], 
    fingers: [null, 1, 4, 1, 3, null] 
  },
  { 
    id: "Dm7", 
    name: "Dm7", 
    frets: [1, 1, 2, 0, null, null], 
    fingers: [1, 1, 2, null, null, null] 
  },
  { 
    id: "Em7", 
    name: "Em7", 
    frets: [0, 0, 0, 0, 2, 0], 
    fingers: [null, null, null, null, 2, null] 
  },
  { 
    id: "Fm7", 
    name: "Fm7", 
    frets: [1, 1, 1, 1, 3, 1], 
    fingers: [1, 1, 1, 1, 3, 1] 
  },
  { 
    id: "Gm7", 
    name: "Gm7", 
    frets: [2, 2, 2, 2, 4, 2], 
    fingers: [1, 1, 1, 1, 3, 1],
    startFret: 2
  },
  { 
    id: "Am7", 
    name: "Am7", 
    frets: [0, 1, 0, 2, 0, null], 
    fingers: [null, 1, null, 2, null, null] 
  },
  { 
    id: "Bm7", 
    name: "Bm7", 
    frets: [2, 0, 2, 0, 2, null], 
    fingers: [1, null, 2, null, 3, null] 
  }
];

// 메이저 7th 코드 (7개)
export const major7Chords: ChordData[] = [
  { 
    id: "Cmaj7", 
    name: "Cmaj7", 
    frets: [0, 0, 0, 2, 3, null], 
    fingers: [null, null, null, 1, 2, null] 
  },
  { 
    id: "Dmaj7", 
    name: "Dmaj7", 
    frets: [2, 2, 2, 0, null, null], 
    fingers: [1, 1, 1, null, null, null] 
  },
  { 
    id: "Emaj7", 
    name: "Emaj7", 
    frets: [0, 0, 1, 1, 2, 0], 
    fingers: [null, null, 1, 2, 3, null] 
  },
  { 
    id: "Fmaj7", 
    name: "Fmaj7", 
    frets: [0, 1, 2, 3, null, null], 
    fingers: [0, 1, 2, 3, null, null] 
  },
  { 
    id: "Gmaj7", 
    name: "Gmaj7", 
    frets: [2, 0, 0, 0, 2, 3], 
    fingers: [1, null, null, null, 2, 3] 
  },
  { 
    id: "Amaj7", 
    name: "Amaj7", 
    frets: [0, 2, 1, 2, 0, null], 
    fingers: [null, 2, 1, 3, null, null] 
  },
  { 
    id: "Bmaj7", 
    name: "Bmaj7", 
    frets: [2, 0, 3, 1, null, null], 
    fingers: [3, 0, 4, 1, null, null] 
  }
];

// 서스펜디드 코드 (sus2, sus4)
export const suspendedChords: ChordData[] = [
  { 
    id: "Csus2", 
    name: "Csus2", 
    frets: [0, 1, 0, 0, 3, null], 
    fingers: [null, 1, null, null, 3, null] 
  },
  { 
    id: "Csus4", 
    name: "Csus4", 
    frets: [0, 1, 1, 3, 3, null], 
    fingers: [null, 1, 1, 3, 4, null] 
  },
  { 
    id: "Dsus2", 
    name: "Dsus2", 
    frets: [0, 3, 2, 0, null, null], 
    fingers: [null, 3, 2, null, null, null] 
  },
  { 
    id: "Dsus4", 
    name: "Dsus4", 
    frets: [3, 3, 2, 0, null, null], 
    fingers: [3, 2, 1, 0, null, null] 
  },
  { 
    id: "Esus2", 
    name: "Esus2", 
    frets: [0, 0, 2, 2, 0, 0], 
    fingers: [null, null, 1, 2, null, null] 
  },
  { 
    id: "Esus4", 
    name: "Esus4", 
    frets: [0, 0, 2, 2, 0, 0], 
    fingers: [null, null, 1, 2, null, null] 
  },
  { 
    id: "Asus2", 
    name: "Asus2", 
    frets: [0, 0, 2, 2, 0, null], 
    fingers: [null, null, 1, 2, null, null] 
  },
  { 
    id: "Asus4", 
    name: "Asus4", 
    frets: [0, 3, 2, 2, 0, null], 
    fingers: [null, 3, 1, 2, null, null] 
  }
];

// 디미니쉬드 코드
export const diminishedChords: ChordData[] = [
  { 
    id: "Cdim", 
    name: "Cdim", 
    frets: [null, 1, 2, 0, 2, null], 
    fingers: [null, 1, 3, null, 4, null] 
  },
  { 
    id: "Ddim", 
    name: "Ddim", 
    frets: [null, null, 0, 1, 0, 1], 
    fingers: [null, null, null, 1, null, 2] 
  },
  { 
    id: "Edim", 
    name: "Edim", 
    frets: [null, 1, 2, 0, 2, 0], 
    fingers: [null, 1, 3, null, 4, null] 
  },
  { 
    id: "Gdim", 
    name: "Gdim", 
    frets: [null, 1, 2, 0, 2, 0], 
    fingers: [null, 1, 3, null, 4, null] 
  },
  { 
    id: "Adim", 
    name: "Adim", 
    frets: [null, 0, 1, 2, 1, null], 
    fingers: [null, null, 1, 3, 2, null] 
  },
  { 
    id: "Bdim", 
    name: "Bdim", 
    frets: [null, 2, 0, 1, 0, null], 
    fingers: [null, 2, null, 1, null, null] 
  }
];

// Add9 코드
export const add9Chords: ChordData[] = [
  { 
    id: "Cadd9", 
    name: "Cadd9", 
    frets: [0, 3, 0, 2, 3, null], 
    fingers: [null, 2, null, 1, 3, null] 
  },
  { 
    id: "Dadd9", 
    name: "Dadd9", 
    frets: [0, 3, 2, 0, null, null], 
    fingers: [null, 3, 2, null, null, null] 
  },
  { 
    id: "Gadd9", 
    name: "Gadd9", 
    frets: [3, 0, 0, 2, 0, 3], 
    fingers: [3, null, null, 2, null, 4] 
  },
  { 
    id: "Aadd9", 
    name: "Aadd9", 
    frets: [0, 0, 2, 2, 0, null], 
    fingers: [null, null, 1, 2, null, null] 
  }
];

// 6th 코드
export const sixthChords: ChordData[] = [
  { 
    id: "C6", 
    name: "C6", 
    frets: [0, 1, 2, 2, 3, null], 
    fingers: [null, 1, 2, 3, 4, null] 
  },
  { 
    id: "D6", 
    name: "D6", 
    frets: [2, 0, 2, 0, null, null], 
    fingers: [1, null, 2, null, null, null] 
  },
  { 
    id: "G6", 
    name: "G6", 
    frets: [3, 0, 0, 0, 0, 3], 
    fingers: [3, null, null, null, null, 4] 
  },
  { 
    id: "A6", 
    name: "A6", 
    frets: [0, 0, 2, 2, 2, null], 
    fingers: [null, null, 1, 2, 3, null] 
  }
];

// 모든 코드 통합
export const allChords: ChordData[] = [
  ...majorChords,
  ...minorChords,
  ...dominant7Chords,
  ...minor7Chords,
  ...major7Chords,
  ...suspendedChords,
  ...diminishedChords,
  ...add9Chords,
  ...sixthChords
];

// 코드 패턴 (게임용)
export const allChordPatterns: ChordPattern[] = allChords.map(chord => ({
  name: chord.name,
  positions: chord.frets.map((fret, index) => 
    fret !== null && fret > 0 
      ? { string: index + 1, fret } 
      : null
  ).filter(Boolean) as FretPosition[],
  description: `${chord.name} 코드`
}));

// 코드 정보 (상세 정보용)
export const allChordInfo: ChordInfo[] = [
  // 메이저 코드
  {
    name: "C",
    fullName: "C Major",
    positions: [
      { string: 2, fret: 1 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }
    ],
    difficulty: "초급",
    notes: ["C", "E", "G"],
    description: "가장 기본적인 메이저 코드로, 많은 곡에서 사용됩니다.",
    tips: ["손가락을 세워서 정확히 누르세요", "1, 3, 6번줄은 개방현입니다"],
    category: "메이저"
  },
  {
    name: "D",
    fullName: "D Major",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A"],
    description: "밝고 화사한 느낌의 메이저 코드입니다.",
    tips: ["4, 5, 6번줄은 치지 마세요", "손가락들이 서로 겹치지 않게 하세요"],
    category: "메이저"
  },
  {
    name: "E",
    fullName: "E Major",
    positions: [
      { string: 3, fret: 1 }, { string: 4, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "G#", "B"],
    description: "파워풀한 소리의 메이저 코드입니다.",
    tips: ["1, 2, 6번줄은 개방현입니다", "모든 줄을 힘차게 연주하세요"],
    category: "메이저"
  },
  {
    name: "F",
    fullName: "F Major",
    positions: [
      { string: 1, fret: 1 }, { string: 2, fret: 1 }, { string: 3, fret: 2 },
      { string: 4, fret: 3 }, { string: 5, fret: 3 }, { string: 6, fret: 1 }
    ],
    difficulty: "중급",
    notes: ["F", "A", "C"],
    description: "첫 번째 바레 코드로, 검지로 여러 줄을 눌러야 합니다.",
    tips: ["검지로 1, 2, 6번줄을 바레하세요", "꾸준한 연습이 필요한 코드입니다"],
    category: "바레"
  },
  {
    name: "G",
    fullName: "G Major",
    positions: [
      { string: 1, fret: 3 }, { string: 5, fret: 2 }, { string: 6, fret: 3 }
    ],
    difficulty: "초급",
    notes: ["G", "B", "D"],
    description: "밝고 명랑한 느낌의 메이저 코드입니다.",
    tips: ["1번과 6번줄을 3프렛으로 누르세요", "2, 3, 4번줄은 개방현입니다"],
    category: "메이저"
  },
  {
    name: "A",
    fullName: "A Major",
    positions: [
      { string: 2, fret: 2 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E"],
    description: "세 손가락으로 2프렛을 누르는 코드입니다.",
    tips: ["2, 3, 4번줄을 2프렛으로 누르세요", "1, 5번줄은 개방현입니다"],
    category: "메이저"
  },
  {
    name: "B",
    fullName: "B Major",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 4 }, { string: 3, fret: 4 },
      { string: 4, fret: 4 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["B", "D#", "F#"],
    description: "바레 코드 형태의 메이저 코드입니다.",
    tips: ["2프렛에서 바레를 하세요", "4프렛에서 여러 줄을 누르세요"],
    category: "바레"
  },
  
  // 마이너 코드
  {
    name: "Cm",
    fullName: "C Minor",
    positions: [
      { string: 2, fret: 4 }, { string: 3, fret: 3 }, { string: 4, fret: 3 },
      { string: 5, fret: 1 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["C", "Eb", "G"],
    description: "슬픈 느낌의 마이너 코드입니다.",
    tips: ["바레 코드 형태입니다", "정확한 손가락 위치가 중요합니다"],
    category: "마이너"
  },
  {
    name: "Dm",
    fullName: "D Minor",
    positions: [
      { string: 1, fret: 1 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F", "A"],
    description: "서정적인 느낌의 마이너 코드입니다.",
    tips: ["D메이저와 비슷하지만 1번줄이 1프렛입니다", "4, 5, 6번줄은 치지 마세요"],
    category: "마이너"
  },
  {
    name: "Em",
    fullName: "E Minor",
    positions: [
      { string: 4, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "G", "B"],
    description: "가장 쉬운 기타 코드입니다.",
    tips: ["두 개의 손가락만 사용합니다", "나머지 줄들은 모두 개방현입니다"],
    category: "마이너"
  },
  {
    name: "Fm",
    fullName: "F Minor",
    positions: [
      { string: 1, fret: 1 }, { string: 2, fret: 1 }, { string: 3, fret: 1 },
      { string: 4, fret: 3 }, { string: 5, fret: 3 }, { string: 6, fret: 1 }
    ],
    difficulty: "중급",
    notes: ["F", "Ab", "C"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: ["1프렛에서 바레를 하세요", "F메이저와 비슷하지만 3번줄도 1프렛입니다"],
    category: "바레"
  },
  {
    name: "Gm",
    fullName: "G Minor",
    positions: [
      { string: 1, fret: 3 }, { string: 2, fret: 3 }, { string: 3, fret: 3 },
      { string: 4, fret: 3 }, { string: 5, fret: 1 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "Bb", "D"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: ["3프렛에서 바레를 하세요", "복잡한 손가락 배치가 필요합니다"],
    category: "바레"
  },
  {
    name: "Am",
    fullName: "A Minor",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C", "E"],
    description: "가장 쉬운 마이너 코드입니다.",
    tips: ["2번과 3번 손가락으로 2프렛을 누르세요", "1, 5, 6번줄은 개방현입니다"],
    category: "마이너"
  },
  {
    name: "Bm",
    fullName: "B Minor",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 4 },
      { string: 4, fret: 4 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["B", "D", "F#"],
    description: "바레 코드 형태의 마이너 코드입니다.",
    tips: ["2프렛에서 바레를 하세요", "4프렛까지 사용하는 코드입니다"],
    category: "바레"
  },

  // 7th 코드들
  {
    name: "C7",
    fullName: "C Dominant 7th",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 3 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["C", "E", "G", "Bb"],
    description: "긴장감 있는 7th 코드입니다.",
    tips: ["C코드에서 변형된 형태입니다", "블루스에서 자주 사용됩니다"],
    category: "세븐스"
  },
  {
    name: "D7",
    fullName: "D Dominant 7th",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 1 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A", "C"],
    description: "밝은 느낌의 7th 코드입니다.",
    tips: ["D코드에서 2번줄만 1프렛으로 바꾸세요", "4, 5, 6번줄은 치지 마세요"],
    category: "세븐스"
  },
  {
    name: "E7",
    fullName: "E Dominant 7th",
    positions: [
      { string: 3, fret: 1 }, { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "G#", "B", "D"],
    description: "강력한 7th 코드입니다.",
    tips: ["E코드에서 4번줄을 빼면 됩니다", "블루스와 록에서 많이 사용됩니다"],
    category: "세븐스"
  },
  {
    name: "G7",
    fullName: "G Dominant 7th",
    positions: [
      { string: 1, fret: 1 }, { string: 5, fret: 2 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "B", "D", "F"],
    description: "진행감을 만드는 7th 코드입니다.",
    tips: ["G코드에서 1번줄을 1프렛으로 바꾸세요", "다음 코드로의 연결이 중요합니다"],
    category: "세븐스"
  },
  {
    name: "A7",
    fullName: "A Dominant 7th",
    positions: [
      { string: 2, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E", "G"],
    description: "간단한 7th 코드입니다.",
    tips: ["A코드에서 3번줄을 빼면 됩니다", "손가락 두 개만 사용합니다"],
    category: "세븐스"
  },
  {
    name: "B7",
    fullName: "B Dominant 7th",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["B", "D#", "F#", "A"],
    description: "복잡한 손가락 배치의 7th 코드입니다.",
    tips: ["4프렛 이하로 조정된 코드입니다", "정확한 손가락 위치가 중요합니다"],
    category: "세븐스"
  },

  // 마이너 7th 코드들
  {
    name: "Am7",
    fullName: "A Minor 7th",
    positions: [
      { string: 2, fret: 1 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C", "E", "G"],
    description: "부드러운 느낌의 마이너 7th 코드입니다.",
    tips: ["Am 코드에서 3번줄을 빼면 됩니다", "재즈에서 자주 사용됩니다"],
    category: "마이너7"
  },
  {
    name: "Em7",
    fullName: "E Minor 7th",
    positions: [
      { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "G", "B", "D"],
    description: "가장 쉬운 7th 코드입니다.",
    tips: ["Em 코드에서 4번줄을 빼면 됩니다", "한 손가락만 사용합니다"],
    category: "마이너7"
  },
  {
    name: "Dm7",
    fullName: "D Minor 7th",
    positions: [
      { string: 1, fret: 1 }, { string: 2, fret: 1 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F", "A", "C"],
    description: "멜로디컬한 마이너 7th 코드입니다.",
    tips: ["Dm 코드에서 2번줄을 1프렛으로 바꾸세요", "바레를 사용할 수 있습니다"],
    category: "마이너7"
  },

  // 메이저 7th 코드들
  {
    name: "Cmaj7",
    fullName: "C Major 7th",
    positions: [
      { string: 4, fret: 2 }, { string: 5, fret: 3 }
    ],
    difficulty: "초급",
    notes: ["C", "E", "G", "B"],
    description: "화려하고 세련된 메이저 7th 코드입니다.",
    tips: ["C 코드에서 2번줄을 빼면 됩니다", "재즈와 발라드에서 사용됩니다"],
    category: "메이저7"
  },
  {
    name: "Dmaj7",
    fullName: "D Major 7th",
    positions: [
      { string: 1, fret: 2 }, { string: 2, fret: 2 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A", "C#"],
    description: "밝고 화려한 메이저 7th 코드입니다.",
    tips: ["D 코드에서 2번줄을 2프렛으로 바꾸세요", "바레를 사용할 수 있습니다"],
    category: "메이저7"
  },
  {
    name: "Emaj7",
    fullName: "E Major 7th",
    positions: [
      { string: 3, fret: 1 }, { string: 4, fret: 1 }, { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "G#", "B", "D#"],
    description: "드리미한 느낌의 메이저 7th 코드입니다.",
    tips: ["E 코드에서 4번줄을 1프렛으로 바꾸세요", "깨끗한 음색이 특징입니다"],
    category: "메이저7"
  },
  {
    name: "Gmaj7",
    fullName: "G Major 7th",
    positions: [
      { string: 1, fret: 2 }, { string: 5, fret: 2 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "B", "D", "F#"],
    description: "밝고 화려한 메이저 7th 코드입니다.",
    tips: ["G 코드에서 1번줄을 2프렛으로 바꾸세요", "고급스러운 화성감을 만듭니다"],
    category: "메이저7"
  },
  {
    name: "Amaj7",
    fullName: "A Major 7th",
    positions: [
      { string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["A", "C#", "E", "G#"],
    description: "세련된 메이저 7th 코드입니다.",
    tips: ["A 코드에서 3번줄을 1프렛으로 바꾸세요", "재즈에서 자주 사용됩니다"],
    category: "메이저7"
  },

  // 서스펜디드 코드들
  {
    name: "Csus2",
    fullName: "C Suspended 2nd",
    positions: [
      { string: 2, fret: 1 }, { string: 5, fret: 3 }
    ],
    difficulty: "초급",
    notes: ["C", "D", "G"],
    description: "부유하는 느낌의 서스펜디드 코드입니다.",
    tips: ["C 코드에서 4번줄을 빼고 연주하세요", "해결감을 기다리는 느낌입니다"],
    category: "서스펜디드"
  },
  {
    name: "Csus4",
    fullName: "C Suspended 4th",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 1 }, { string: 4, fret: 3 }, { string: 5, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["C", "F", "G"],
    description: "긴장감 있는 서스펜디드 코드입니다.",
    tips: ["C 코드에서 변형된 형태입니다", "메이저 코드로 해결하면 좋습니다"],
    category: "서스펜디드"
  },
  {
    name: "Dsus2",
    fullName: "D Suspended 2nd",
    positions: [
      { string: 2, fret: 3 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "E", "A"],
    description: "깔끔한 서스펜디드 코드입니다.",
    tips: ["D 코드에서 1번줄을 빼고 연주하세요", "포크 기타에서 자주 사용됩니다"],
    category: "서스펜디드"
  },
  {
    name: "Dsus4",
    fullName: "D Suspended 4th",
    positions: [
      { string: 1, fret: 3 }, { string: 2, fret: 3 }, { string: 3, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["D", "G", "A"],
    description: "힘찬 느낌의 서스펜디드 코드입니다.",
    tips: ["D 코드에서 1번줄을 3프렛으로 바꾸세요", "록 음악에서 자주 사용됩니다"],
    category: "서스펜디드"
  },
  {
    name: "Esus2",
    fullName: "E Suspended 2nd",
    positions: [
      { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "F#", "B"],
    description: "밝은 서스펜디드 코드입니다.",
    tips: ["E 코드에서 5번줄을 빼고 연주하세요", "매우 간단한 코드입니다"],
    category: "서스펜디드"
  },
  {
    name: "Esus4",
    fullName: "E Suspended 4th",
    positions: [
      { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["E", "A", "B"],
    description: "파워풀한 서스펜디드 코드입니다.",
    tips: ["E 코드에서 3번줄을 빼고 연주하세요", "록에서 자주 사용됩니다"],
    category: "서스펜디드"
  },
  {
    name: "Gsus2",
    fullName: "G Suspended 2nd",
    positions: [
      { string: 1, fret: 3 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "A", "D"],
    description: "풍성한 서스펜디드 코드입니다.",
    tips: ["G 코드에서 변형된 형태입니다", "4번줄을 추가로 누르세요"],
    category: "서스펜디드"
  },
  {
    name: "Gsus4",
    fullName: "G Suspended 4th",
    positions: [
      { string: 1, fret: 3 }, { string: 2, fret: 1 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "C", "D"],
    description: "클래식한 서스펜디드 코드입니다.",
    tips: ["G 코드에서 2번줄을 1프렛으로 바꾸세요", "컨트리 음악에서 자주 사용됩니다"],
    category: "서스펜디드"
  },
  {
    name: "Asus2",
    fullName: "A Suspended 2nd",
    positions: [
      { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "B", "E"],
    description: "개방적인 서스펜디드 코드입니다.",
    tips: ["A 코드에서 2번줄을 빼고 연주하세요", "많은 개방현을 활용합니다"],
    category: "서스펜디드"
  },
  {
    name: "Asus4",
    fullName: "A Suspended 4th",
    positions: [
      { string: 2, fret: 3 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["A", "D", "E"],
    description: "강력한 서스펜디드 코드입니다.",
    tips: ["A 코드에서 2번줄을 3프렛으로 바꾸세요", "해결감이 강한 코드입니다"],
    category: "서스펜디드"
  },

  // Add9 코드들
  {
    name: "Cadd9",
    fullName: "C Add 9th",
    positions: [
      { string: 2, fret: 3 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["C", "E", "G", "D"],
    description: "현대적인 느낌의 애드나인 코드입니다.",
    tips: ["C 코드에서 2번줄을 3프렛으로 바꾸세요", "팝과 록에서 자주 사용됩니다"],
    category: "애드나인"
  },
  {
    name: "Dadd9",
    fullName: "D Add 9th",
    positions: [
      { string: 2, fret: 3 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A", "E"],
    description: "밝은 애드나인 코드입니다.",
    tips: ["D 코드에서 1번줄을 빼고 연주하세요", "포크와 컨트리에서 인기입니다"],
    category: "애드나인"
  },
  {
    name: "Eadd9",
    fullName: "E Add 9th",
    positions: [
      { string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["E", "G#", "B", "F#"],
    description: "드라마틱한 애드나인 코드입니다.",
    tips: ["E 코드에서 변형된 형태입니다", "록 발라드에서 효과적입니다"],
    category: "애드나인"
  },
  {
    name: "Gadd9",
    fullName: "G Add 9th",
    positions: [
      { string: 1, fret: 3 }, { string: 4, fret: 2 }, { string: 6, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["G", "B", "D", "A"],
    description: "풍성한 애드나인 코드입니다.",
    tips: ["G 코드에서 4번줄을 추가로 누르세요", "어쿠스틱 기타에 잘 어울립니다"],
    category: "애드나인"
  },
  {
    name: "Aadd9",
    fullName: "A Add 9th",
    positions: [
      { string: 3, fret: 2 }, { string: 4, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E", "B"],
    description: "깔끔한 애드나인 코드입니다.",
    tips: ["A 코드에서 2번줄을 빼고 연주하세요", "간단하지만 효과적입니다"],
    category: "애드나인"
  },

  // 디미니쉬드 코드들
  {
    name: "Cdim",
    fullName: "C Diminished",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["C", "Eb", "Gb"],
    description: "긴장감 넘치는 디미니쉬드 코드입니다.",
    tips: ["모든 음정이 단3도입니다", "경과음으로 자주 사용됩니다"],
    category: "디미니쉬드"
  },
  {
    name: "Ddim",
    fullName: "D Diminished",
    positions: [
      { string: 4, fret: 1 }, { string: 6, fret: 1 }
    ],
    difficulty: "초급",
    notes: ["D", "F", "Ab"],
    description: "어둡고 신비한 디미니쉬드 코드입니다.",
    tips: ["두 손가락만 사용하는 간단한 형태입니다", "재즈에서 자주 사용됩니다"],
    category: "디미니쉬드"
  },
  {
    name: "Edim",
    fullName: "E Diminished",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["E", "G", "Bb"],
    description: "드라마틱한 디미니쉬드 코드입니다.",
    tips: ["불안정한 느낌을 만들어냅니다", "해결을 원하는 코드입니다"],
    category: "디미니쉬드"
  },

  // 6th 코드들
  {
    name: "C6",
    fullName: "C Major 6th",
    positions: [
      { string: 2, fret: 1 }, { string: 3, fret: 2 }, { string: 4, fret: 2 }, { string: 5, fret: 3 }
    ],
    difficulty: "중급",
    notes: ["C", "E", "G", "A"],
    description: "달콤한 느낌의 6th 코드입니다.",
    tips: ["C 코드에서 변형된 형태입니다", "재즈와 스윙에서 인기입니다"],
    category: "식스"
  },
  {
    name: "D6",
    fullName: "D Major 6th",
    positions: [
      { string: 1, fret: 2 }, { string: 3, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["D", "F#", "A", "B"],
    description: "밝은 6th 코드입니다.",
    tips: ["D 코드에서 2번줄을 빼고 연주하세요", "컨트리 음악에서 자주 사용됩니다"],
    category: "식스"
  },
  {
    name: "E6",
    fullName: "E Major 6th",
    positions: [
      { string: 2, fret: 2 }, { string: 3, fret: 1 }, { string: 4, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "중급",
    notes: ["E", "G#", "B", "C#"],
    description: "화려한 6th 코드입니다.",
    tips: ["E 코드에서 변형된 형태입니다", "블루스와 재즈에서 사용됩니다"],
    category: "식스"
  },
  {
    name: "G6",
    fullName: "G Major 6th",
    positions: [
      { string: 1, fret: 3 }, { string: 6, fret: 3 }
    ],
    difficulty: "초급",
    notes: ["G", "B", "D", "E"],
    description: "개방적인 6th 코드입니다.",
    tips: ["G 코드에서 5번줄을 빼고 연주하세요", "많은 개방현을 활용합니다"],
    category: "식스"
  },
  {
    name: "A6",
    fullName: "A Major 6th",
    positions: [
      { string: 3, fret: 2 }, { string: 4, fret: 2 }, { string: 5, fret: 2 }
    ],
    difficulty: "초급",
    notes: ["A", "C#", "E", "F#"],
    description: "풍성한 6th 코드입니다.",
    tips: ["A 코드에서 2번줄을 빼고 연주하세요", "바레로도 연주할 수 있습니다"],
    category: "식스"
  }
];