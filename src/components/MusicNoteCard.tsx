import { useState } from "react";

interface Note {
  note: string;
  octave: number;
  position: number; // 오선지에서의 위치 (0이 중앙선)
}

interface MusicNoteCardProps {
  id: string;
  chordName: string;
  notes: Note[];
  isFlipped: boolean;
  isSelected: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
}

export function MusicNoteCard({ 
  id, 
  chordName, 
  notes, 
  isFlipped, 
  isSelected, 
  isMatched, 
  onClick 
}: MusicNoteCardProps) {
  const handleClick = () => {
    if (!isMatched) {
      onClick(id);
    }
  };

  // 오선지 렌더링
  const renderStaff = () => {
    const staffLines = [];
    // 오선 5줄
    for (let i = 0; i < 5; i++) {
      staffLines.push(
        <line
          key={i}
          x1="20"
          y1={40 + i * 10}
          x2="180"
          y2={40 + i * 10}
          stroke="#333"
          strokeWidth="1"
        />
      );
    }
    return staffLines;
  };

  // 음표 렌더링 (크기 50% 축소)
  const renderNotes = () => {
    return notes.map((note, index) => {
      // 위치 계산 (0이 중앙선, 양수는 위쪽, 음수는 아래쪽)
      const yPosition = 80 - (note.position * 5); // 80은 중앙선 위치
      
      return (
        <g key={index}>
          {/* 음표 머리 (50% 축소) */}
          <ellipse
            cx={50 + index * 20}
            cy={yPosition}
            rx="3"
            ry="2"
            fill="#333"
          />
          {/* 음표 줄기 (50% 축소) */}
          <line
            x1={53 + index * 20}
            y1={yPosition}
            x2={53 + index * 20}
            y2={yPosition - 12}
            stroke="#333"
            strokeWidth="1"
          />
          {/* 보조선이 필요한 경우 (50% 축소) */}
          {(note.position < -4 || note.position > 4) && (
            <line
              x1={44 + index * 20}
              y1={yPosition}
              x2={59 + index * 20}
              y2={yPosition}
              stroke="#333"
              strokeWidth="0.8"
            />
          )}
        </g>
      );
    });
  };

  return (
    <div
      className={`relative w-full h-28 cursor-pointer transition-all duration-300 ${
        isMatched ? 'opacity-50' : ''
      }`}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* 카드 앞면 (뒷면) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-lg border-2 backface-hidden transition-colors ${
            isSelected
              ? 'border-green-400 bg-green-50'
              : isMatched
              ? 'border-green-500 bg-green-100'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 카드 뒷면 (앞면) - 오선지와 음표 */}
        <div
          className={`absolute inset-0 w-full h-full rounded-lg border-2 backface-hidden rotate-y-180 transition-colors ${
            isSelected
              ? 'border-green-400 bg-green-50'
              : isMatched
              ? 'border-green-500 bg-green-100'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <div className="p-2">
            <div className="text-xs font-medium text-gray-600 mb-1 text-center">
              {chordName}
            </div>
            <svg
              width="200"
              height="100"
              viewBox="0 0 200 100"
              className="w-full h-full"
            >
              {/* 높은음자리표 (30% 확대) */}
              <text x="22" y="65" fontSize="31" fill="#333">
                𝄞
              </text>
              {/* 오선 */}
              {renderStaff()}
              {/* 음표들 */}
              {renderNotes()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}