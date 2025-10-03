import { useState, useEffect } from "react";
import { MusicNoteCard } from "./MusicNoteCard";
import { ChordNameCard } from "./ChordNameCard";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { useScoreSystem, ScoreDisplay, ResultDisplay } from "./ScoreSystem";

interface Note {
  note: string;
  octave: number;
  position: number; // 오선지에서의 위치
}

interface ChordData {
  id: string;
  name: string;
  notes: Note[];
}

interface NoteMatchGameProps {
  onBack: () => void;
}

// 기본코드 21개의 음표 데이터 (메이저 7개, 마이너 7개, 7th 7개)
const chordData: ChordData[] = [
  // 메이저 코드 (7개)
  {
    id: "C",
    name: "C",
    notes: [
      { note: "C", octave: 3, position: -3 },
      { note: "E", octave: 3, position: -1 },
      { note: "G", octave: 3, position: 1 }
    ]
  },
  {
    id: "D",
    name: "D",
    notes: [
      { note: "D", octave: 3, position: -2 },
      { note: "F#", octave: 3, position: 0 },
      { note: "A", octave: 3, position: 2 }
    ]
  },
  {
    id: "E",
    name: "E",
    notes: [
      { note: "E", octave: 3, position: -1 },
      { note: "G#", octave: 3, position: 1.5 },
      { note: "B", octave: 3, position: 3 }
    ]
  },
  {
    id: "F",
    name: "F",
    notes: [
      { note: "F", octave: 3, position: 0 },
      { note: "A", octave: 3, position: 2 },
      { note: "C", octave: 4, position: 5 }
    ]
  },
  {
    id: "G",
    name: "G",
    notes: [
      { note: "G", octave: 3, position: 1 },
      { note: "B", octave: 3, position: 3 },
      { note: "D", octave: 4, position: 6 }
    ]
  },
  {
    id: "A",
    name: "A",
    notes: [
      { note: "A", octave: 3, position: 2 },
      { note: "C#", octave: 4, position: 4.5 },
      { note: "E", octave: 4, position: 7 }
    ]
  },
  {
    id: "B",
    name: "B",
    notes: [
      { note: "B", octave: 3, position: 3 },
      { note: "D#", octave: 4, position: 6.5 },
      { note: "F#", octave: 4, position: 8 }
    ]
  },

  // 마이너 코드 (7개)
  {
    id: "Cm",
    name: "Cm",
    notes: [
      { note: "C", octave: 3, position: -3 },
      { note: "Eb", octave: 3, position: -0.5 },
      { note: "G", octave: 3, position: 1 }
    ]
  },
  {
    id: "Dm",
    name: "Dm",
    notes: [
      { note: "D", octave: 3, position: -2 },
      { note: "F", octave: 3, position: 0 },
      { note: "A", octave: 3, position: 2 }
    ]
  },
  {
    id: "Em",
    name: "Em",
    notes: [
      { note: "E", octave: 3, position: -1 },
      { note: "G", octave: 3, position: 1 },
      { note: "B", octave: 3, position: 3 }
    ]
  },
  {
    id: "Fm",
    name: "Fm",
    notes: [
      { note: "F", octave: 3, position: 0 },
      { note: "Ab", octave: 3, position: 1.5 },
      { note: "C", octave: 4, position: 5 }
    ]
  },
  {
    id: "Gm",
    name: "Gm",
    notes: [
      { note: "G", octave: 3, position: 1 },
      { note: "Bb", octave: 3, position: 2.5 },
      { note: "D", octave: 4, position: 6 }
    ]
  },
  {
    id: "Am",
    name: "Am",
    notes: [
      { note: "A", octave: 3, position: 2 },
      { note: "C", octave: 4, position: 5 },
      { note: "E", octave: 4, position: 7 }
    ]
  },
  {
    id: "Bm",
    name: "Bm",
    notes: [
      { note: "B", octave: 3, position: 3 },
      { note: "D", octave: 4, position: 6 },
      { note: "F#", octave: 4, position: 8 }
    ]
  },

  // 7th 코드 (7개)
  {
    id: "C7",
    name: "C7",
    notes: [
      { note: "C", octave: 3, position: -3 },
      { note: "E", octave: 3, position: -1 },
      { note: "G", octave: 3, position: 1 },
      { note: "Bb", octave: 3, position: 2.5 }
    ]
  },
  {
    id: "D7",
    name: "D7",
    notes: [
      { note: "D", octave: 3, position: -2 },
      { note: "F#", octave: 3, position: 0 },
      { note: "A", octave: 3, position: 2 },
      { note: "C", octave: 4, position: 5 }
    ]
  },
  {
    id: "E7",
    name: "E7",
    notes: [
      { note: "E", octave: 3, position: -1 },
      { note: "G#", octave: 3, position: 1.5 },
      { note: "B", octave: 3, position: 3 },
      { note: "D", octave: 4, position: 6 }
    ]
  },
  {
    id: "F7",
    name: "F7",
    notes: [
      { note: "F", octave: 3, position: 0 },
      { note: "A", octave: 3, position: 2 },
      { note: "C", octave: 4, position: 5 },
      { note: "Eb", octave: 4, position: 6.5 }
    ]
  },
  {
    id: "G7",
    name: "G7",
    notes: [
      { note: "G", octave: 3, position: 1 },
      { note: "B", octave: 3, position: 3 },
      { note: "D", octave: 4, position: 6 },
      { note: "F", octave: 4, position: 8 }
    ]
  },
  {
    id: "A7",
    name: "A7",
    notes: [
      { note: "A", octave: 3, position: 2 },
      { note: "C#", octave: 4, position: 4.5 },
      { note: "E", octave: 4, position: 7 },
      { note: "G", octave: 4, position: 9 }
    ]
  },
  {
    id: "B7",
    name: "B7",
    notes: [
      { note: "B", octave: 3, position: 3 },
      { note: "D#", octave: 4, position: 6.5 },
      { note: "F#", octave: 4, position: 8 },
      { note: "A", octave: 4, position: 10 }
    ]
  }
];

export function NoteMatchGame({ onBack }: NoteMatchGameProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const scoreSystem = useScoreSystem("note-match", 10);

  // 셔플된 카드 데이터
  const [shuffledChords, setShuffledChords] = useState<ChordData[]>([]);
  const [shuffledNames, setShuffledNames] = useState<string[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (matchedPairs.size === chordData.length * 2 && !gameCompleted) {
      setGameCompleted(true);
      scoreSystem.completeRound(scoreSystem.totalScore);
    }
  }, [matchedPairs, gameCompleted]);

  const resetGame = () => {
    setSelectedCards([]);
    setFlippedCards(new Set());
    setMatchedPairs(new Set());
    setGameCompleted(false);
    scoreSystem.resetGame();
    
    // 카드들을 셔플
    const shuffled = [...chordData].sort(() => Math.random() - 0.5);
    const shuffledNameList = shuffled.map(chord => chord.name).sort(() => Math.random() - 0.5);
    
    setShuffledChords(shuffled);
    setShuffledNames(shuffledNameList);
  };

  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2 || selectedCards.includes(cardId) || matchedPairs.has(cardId)) {
      return;
    }

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);
    
    // 카드 뒤집기
    setFlippedCards(prev => new Set([...prev, cardId]));

    // 첫 번째 카드 선택 시 타이머 시작
    if (selectedCards.length === 0) {
      scoreSystem.startTimer();
    }

    if (newSelectedCards.length === 2) {
      // 두 카드가 선택되었을 때 매칭 검사
      setTimeout(() => {
        checkMatch(newSelectedCards);
      }, 1000);
    }
  };

  const checkMatch = (cards: string[]) => {
    const [card1, card2] = cards;
    
    // 음표 카드와 이름 카드가 매칭되는지 확인
    const noteCard = shuffledChords.find(chord => chord.id === card1);
    const nameCard = card2;
    
    const isNoteToName = noteCard && noteCard.name === nameCard;
    
    // 반대 경우도 확인
    const nameCardFirst = card1;
    const noteCardSecond = shuffledChords.find(chord => chord.id === card2);
    const isNameToNote = noteCardSecond && noteCardSecond.name === nameCardFirst;

    if (isNoteToName || isNameToNote) {
      // 매칭 성공
      const earnedScore = scoreSystem.handleCorrectAnswer();
      setMatchedPairs(prev => new Set([...prev, card1, card2]));
    } else {
      // 매칭 실패
      scoreSystem.handleWrongAnswer();
      setTimeout(() => {
        setFlippedCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(card1);
          newSet.delete(card2);
          return newSet;
        });
      }, 500);
    }

    setSelectedCards([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">짝짖기 (음표)</h1>
            <p className="text-sm text-gray-600">빠르게 정답을 맞춰 높은 점수를 얻어보세요!</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            다시하기
          </Button>
        </div>

        {/* 점수 표시 */}
        <ScoreDisplay
          currentScore={scoreSystem.currentScore}
          totalScore={scoreSystem.totalScore}
          bestScore={scoreSystem.bestScore}
          timeLeft={scoreSystem.timeLeft}
          isActive={scoreSystem.isActive}
          isNewRecord={scoreSystem.isNewRecord}
        />

        {/* 게임 보드 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 왼쪽: 음표 카드들 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
              🎵 음표 카드
            </h2>
            <div className="space-y-3">
              {shuffledChords.map((chord) => (
                <MusicNoteCard
                  key={chord.id}
                  id={chord.id}
                  chordName={chord.name}
                  notes={chord.notes}
                  isFlipped={flippedCards.has(chord.id)}
                  isSelected={selectedCards.includes(chord.id)}
                  isMatched={matchedPairs.has(chord.id)}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          {/* 오른쪽: 코드명 카드들 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
              🎸 코드명 카드
            </h2>
            <div className="space-y-3">
              {shuffledNames.map((chordName, index) => (
                <ChordNameCard
                  key={`name-${index}`}
                  id={chordName}
                  chordName={chordName}
                  isFlipped={flippedCards.has(chordName)}
                  isSelected={selectedCards.includes(chordName)}
                  isMatched={matchedPairs.has(chordName)}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 게임 설명 */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="font-medium mb-2">게임 방법</h3>
          <p className="text-sm text-muted-foreground mb-2">
            왼쪽의 음표 카드와 오른쪽의 코드명 카드를 매칭해보세요!
          </p>
          <p className="text-xs text-gray-500">
            ✅ 정답 시 100점씩 획득! 5개를 모두 맞춰 최고 점수를 달성해보세요.
          </p>
        </div>

        {/* 결과 모달 */}
        {gameCompleted && (
          <ResultDisplay
            totalScore={scoreSystem.totalScore}
            bestScore={scoreSystem.bestScore}
            isNewRecord={scoreSystem.isNewRecord}
            onRestart={resetGame}
            onBack={onBack}
          />
        )}
      </div>
    </div>
  );
}