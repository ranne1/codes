# 기타 코드 마스터 앱 설계서

## 1. 프로젝트 개요

### 1.1 앱 소개
- **앱명**: 기타 코드 마스터 (Guitar Chord Master)
- **목적**: 게임 형태로 기타 코드를 학습할 수 있는 모바일 친화적 웹 애플리케이션
- **타겟**: 기타 초보자부터 중급자까지

### 1.2 핵심 기능
1. **짝짖기 (지판)**: 기타 지판 다이어그램과 코드명 매칭 게임 ✅ 구현완료
2. **짝짖기 (음표)**: 음표와 코드명 매칭 게임
3. **짝짖기 (지판-음표)**: 지판 위치와 음표 연결 게임
4. **코드 입력**: 직접 코드를 입력하며 연습
5. **코드 정보 보기**: 다양한 기타 코드 정보와 해설

## 2. 화면 설계

### 2.1 메인 화면 (Main Screen)
**파일**: `/App.tsx`

#### 레이아웃 구조
```
┌─────────────────────────────┐
│         헤더 영역           │
│    🎸 기타 코드 마스터      │
│    게임으로 배우는 기타 코드  │
├─────────────────────────────┤
│      게임 모드 카드들       │
│  🎸 짝짖기 (지판)          │
│  🎵 짝짖기 (음표)          │
│  ▶️ 짝짖기 (지판-음표)      │
│  📝 코드 입력              │
│  📖 코드 정보 보기         │
└─────────────────────────────┘
```

#### 디자인 특징
- **배경**: 파란색에서 보라색으로 그라디언트 (`bg-gradient-to-br from-blue-50 to-purple-50`)
- **최대 너비**: 448px (`max-w-md`) - 모바일 최적화
- **카드 스타일**: 각 모드별 고유 색상과 아이콘
- **인터랙션**: 호버 효과, 클릭 애니메이션

#### 색상 시스템
- 짝짖기 (지판): 파란색 (`bg-blue-500`)
- 짝짖기 (음표): 초록색 (`bg-green-500`)
- 짝짖기 (지판-음표): 보라색 (`bg-purple-500`)
- 코드 입력: 주황색 (`bg-orange-500`)
- 코드 정보 보기: 청록색 (`bg-teal-500`)

### 2.2 짝짖기 (지판) 게임 화면
**파일**: `/components/FretboardMatchGame.tsx`

#### 레이아웃 구조
```
┌─────────────────────────────────────────┐
│ ← 돌아가기    짝짖기(지판)    🔄 다시하기 │
│              점수: 50                   │
├─────────────────┬───────────────────────┤
│   기타 코드 지판  │       코드명          │
│ ┌─────────────┐ │  ┌─────────────────┐  │
│ │   C Major   │ │  │    C Major      │  │
│ │  지판도표시   │ │  │                 │  │
│ └─────────────┘ │  └─────────────────┘  │
│ ┌─────────────┐ │  ┌─────────────────┐  │
│ │   G Major   │ │  │    G Major      │  │
│ └─────────────┘ │  └─────────────────┘  │
│       ...       │         ...         │
└─────────────────┴───────────────────────┘
```

#### 게임 로직
1. **매칭 시스템**: 좌측 지판 카드와 우측 코드명 카드 선택
2. **점수 시스템**: 정답 시 10점 획득
3. **완료 조건**: 모든 코드 매칭 완료
4. **피드백**: 시각적 선택 상태, 매칭 완료 표시

## 3. 컴포넌트 구조

### 3.1 컴포넌트 계층구조
```
App.tsx
├── GameModeCard.tsx (×5)
└── FretboardMatchGame.tsx
    ├── GuitarChordCard.tsx (×5)
    └── ChordNameCard.tsx (×5)
```

### 3.2 주요 컴포넌트 명세

#### GameModeCard 컴포넌트
**파일**: `/components/GameModeCard.tsx`
- **용도**: 메인 화면의 게임 모드 선택 카드
- **Props**: title, description, icon, color, onClick
- **특징**: 호버 애니메이션, 클릭 효과

#### GuitarChordCard 컴포넌트  
**파일**: `/components/GuitarChordCard.tsx`
- **용도**: 기타 지판 다이어그램 표시
- **핵심 기능**:
  - 6현 기타 지판 시각화
  - 프렛 위치 표시 (1-4프렛)
  - 손가락 번호 표시 (1-4)
  - 개방현 (O), 뮤트현 (X) 표시
- **데이터 구조**:
  ```typescript
  interface ChordData {
    id: string;
    name: string;
    frets: (number | null)[]; // 6개 현, null=뮤트, 0=개방현
    fingers: (number | null)[]; // 손가락 번호 (1-4)
  }
  ```

#### ChordNameCard 컴포넌트
**파일**: `/components/ChordNameCard.tsx`
- **용도**: 코드명 표시 카드
- **상태**: 선택됨, 매칭됨, 기본 상태
- **시각적 피드백**: 색상 변화로 상태 표시

## 4. 데이터 구조

### 4.1 코드 데이터 예시
```typescript
const chords: ChordData[] = [
  { 
    id: "C", 
    name: "C Major", 
    frets: [null, 3, 2, 0, 1, 0], 
    fingers: [null, 3, 2, null, 1, null] 
  },
  { 
    id: "G", 
    name: "G Major", 
    frets: [3, 2, 0, 0, 3, 3], 
    fingers: [2, 1, null, null, 3, 4] 
  },
  // ... 추가 코드들
];
```

### 4.2 게임 상태 관리
```typescript
type GameMode = "main" | "fretboard-match" | "note-match" | 
                "fretboard-note-match" | "chord-input" | "chord-info";

// 게임 상태
const [currentMode, setCurrentMode] = useState<GameMode>("main");
const [selectedChord, setSelectedChord] = useState<string | null>(null);
const [selectedName, setSelectedName] = useState<string | null>(null);
const [matches, setMatches] = useState<Set<string>>(new Set());
const [score, setScore] = useState(0);
```

## 5. 기술 스택

### 5.1 프론트엔드
- **React 18**: 함수형 컴포넌트, Hooks
- **TypeScript**: 타입 안전성
- **Tailwind CSS v4**: 스타일링
- **Lucide React**: 아이콘 라이브러리

### 5.2 UI 라이브러리
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트
  - Card, Button, Badge 등 활용

### 5.3 개발 환경
- **Vite**: 빌드 도구
- **ESLint**: 코드 품질 관리

## 6. 반응형 디자인

### 6.1 모바일 우선 설계
- **기본 너비**: 최대 448px (모바일 최적화)
- **태블릿**: 중간 화면에서 2컬럼 레이아웃
- **데스크톱**: 더 넓은 화면에서도 중앙 정렬 유지

### 6.2 브레이크포인트
- **모바일**: `<md` (1컬럼)
- **태블릿+**: `md:` (2컬럼)

## 7. 향후 개발 계획

### 7.1 미구현 기능
1. **짝짖기 (음표)** 게임 모드
2. **짝짖기 (지판-음표)** 게임 모드  
3. **코드 입력** 연습 모드
4. **코드 정보 보기** 참고 자료

### 7.2 추가 고려사항
- 진행률 저장 (로컬 스토리지)
- 난이도 선택 기능
- 소리/음성 피드백
- 더 많은 코드 데이터베이스
- 성취/배지 시스템

## 8. 파일 구조

```
├── App.tsx                    # 메인 앱 컴포넌트
├── components/
│   ├── GameModeCard.tsx       # 게임 모드 선택 카드
│   ├── FretboardMatchGame.tsx # 짝짖기(지판) 게임
│   ├── GuitarChordCard.tsx    # 기타 코드 지판 카드
│   ├── ChordNameCard.tsx      # 코드명 카드
│   └── ui/                    # shadcn/ui 컴포넌트들
├── styles/
│   └── globals.css            # 전역 스타일 및 테마
└── docs/
    └── app-design-specification.md # 이 설계서
```

---

**최종 업데이트**: 2025년 1월 16일  
**현재 구현 상태**: 메인 화면 + 짝짖기(지판) 게임 완료  
**다음 단계**: 짝짖기(음표) 게임 모드 구현