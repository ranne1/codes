import { Card, CardContent } from "./ui/card";

interface ChordData {
  id: string;
  name: string;
  frets: (number | null)[]; // 6개 현, null은 뮤트, 0은 개방현
  fingers: (number | null)[]; // 6개 현에 대응하는 손가락 번호 (1-4), null은 뮤트나 개방현
}

interface GuitarChordCardProps {
  chord: ChordData;
  isSelected: boolean;
  onClick: () => void;
  showName?: boolean;
}

export function GuitarChordCard({ chord, isSelected, onClick, showName = false }: GuitarChordCardProps) {
  const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // 1번줄부터 6번줄까지
  
  const renderFretboard = () => {
    return (
      <div className="relative mx-auto max-w-[280px] h-24 bg-amber-100 rounded border border-gray-200">
        {/* 줄 이름 표시 */}
        <div className="absolute -left-6 top-0 h-full flex flex-col text-xs text-gray-600">
          {stringNames.map((name, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center h-full"
              style={{ 
                position: 'absolute',
                top: `${index * 14 + 8}%`,
                width: '16px',
                height: '16px'
              }}
            >
              <span className="leading-none">{name}</span>
            </div>
          ))}
        </div>
        
        {/* 프렛 라인들 - 4개 */}
        {[1, 2, 3, 4].map((fret) => (
          <div
            key={fret}
            className="absolute w-px h-full bg-gray-400"
            style={{ left: `${fret * 22.5}%` }}
          />
        ))}
        
        {/* 6개 현들 (줄 두께 차별화) */}
        {[0, 1, 2, 3, 4, 5].map((stringIndex) => {
          const thickness = stringIndex >= 4 ? 2 : 1; // 5, 6번줄은 더 두껍게
          return (
            <div
              key={stringIndex}
              className="absolute w-full bg-gray-600"
              style={{ 
                top: `${stringIndex * 14 + 10}%`,
                height: `${thickness}px`
              }}
            />
          );
        })}
        
        {/* 프렛 번호 표시 */}
        <div className="absolute -bottom-6 left-0 w-full flex text-xs text-gray-600">
          {(() => {
            const startFret = chord.startFret || 1;
            const fretNumbers = [startFret, startFret + 1, startFret + 2, startFret + 3, startFret + 4];
            return fretNumbers.map((fretNum, index) => (
              <div key={index} className={`${index < 4 ? 'w-[22.5%]' : 'w-[10%]'} flex justify-center`}>
                {fretNum}
              </div>
            ));
          })()}
        </div>

        {/* 손가락 위치 점들 */}
        {chord.frets.map((fret, stringIndex) => {
          const topPosition = stringIndex * 14 + 10; // 줄 선과 정확히 맞춤
          
          if (fret === null) {
            // 뮤트된 현 (X 표시)
            return (
              <div
                key={stringIndex}
                className="absolute w-4 h-4 flex items-center justify-center text-red-500 font-bold"
                style={{
                  top: `${topPosition}%`,
                  left: "-10px",
                  transform: "translateY(-50%)" // 정확히 줄 가운데 맞춤
                }}
              >
                ×
              </div>
            );
          }
          
          if (fret === 0) {
            // 개방현 (O 표시)
            return (
              <div
                key={stringIndex}
                className="absolute w-4 h-4 flex items-center justify-center text-green-600 border-2 border-green-600 rounded-full bg-white"
                style={{
                  top: `${topPosition}%`,
                  left: "-10px",
                  transform: "translateY(-50%)" // 정확히 줄 가운데 맞춤
                }}
              >
              </div>
            );
          }
          
          // 프렛 위치 (검은 점에 손가락 번호)
          const fingerNumber = chord.fingers[stringIndex];
          const startFret = chord.startFret || 1;
          const relativeFret = fret; // 상대적 프렛 위치 (1-5)
          return (
            <div
              key={stringIndex}
              className="absolute w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center"
              style={{
                top: `${topPosition}%`,
                left: `${(relativeFret * 22.5) - 8}%`,
                transform: "translateY(-50%)" // 정확히 줄 가운데 맞춤
              }}
            >
              {fingerNumber && (
                <span className="text-white text-[10px] font-bold">
                  {fingerNumber}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md h-[140px] ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {renderFretboard()}
        {showName && (
          <div className="mt-2 text-center">
            <span className="font-medium">{chord.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}