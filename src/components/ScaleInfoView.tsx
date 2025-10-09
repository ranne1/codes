import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Music, Volume2, Play, Guitar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AudioManager } from "./AudioManager";

interface ScaleInfoViewProps {
  onBack: () => void;
}

const KEYS = [
  "C", "C#/Db", "D", "D#/Eb", "E", "F", 
  "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"
];

const SCALE_FORMULAS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  melodicMinorDescending: [0, 2, 3, 5, 7, 8, 10] // 하행 가락단음계 (자연단음계와 동일)
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const getScaleNotes = (rootIndex: number, formula: number[]) => {
  return formula.map(interval => NOTE_NAMES[(rootIndex + interval) % 12]);
};

const getKeyIndex = (key: string) => {
  const keyMap: { [key: string]: number } = {
    "C": 0, "C#/Db": 1, "D": 2, "D#/Eb": 3, "E": 4, "F": 5,
    "F#/Gb": 6, "G": 7, "G#/Ab": 8, "A": 9, "A#/Bb": 10, "B": 11
  };
  return keyMap[key] || 0;
};

// 각 음계별 코드 정보
const getScaleChords = (rootIndex: number, scaleType: 'major' | 'harmonicMinor' | 'melodicMinor') => {
  const chordQuality = {
    major: ['', 'm', 'm', '', '7', 'm', 'dim'],
    harmonicMinor: ['m', 'dim', '+', 'm', '7', '', 'dim'],
    melodicMinor: ['m', 'm', '+', '', '7', 'dim', 'dim']
  };
  
  const romanNumerals = {
    major: ['I', 'ii', 'iii', 'IV', 'V7', 'vi', 'vii°'],
    harmonicMinor: ['i', 'ii°', 'III+', 'iv', 'V7', 'VI', 'vii°'],
    melodicMinor: ['i', 'ii', 'III+', 'IV', 'V7', 'vi°', 'vii°']
  };
  
  const scaleFormula = SCALE_FORMULAS[scaleType === 'major' ? 'major' : scaleType === 'harmonicMinor' ? 'harmonicMinor' : 'melodicMinor'];
  const qualities = chordQuality[scaleType];
  const numerals = romanNumerals[scaleType];
  
  return scaleFormula.map((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const quality = qualities[index];
    const numeral = numerals[index];
    
    return {
      note: noteName,
      chord: noteName + quality,
      numeral: numeral,
      degree: index + 1
    };
  });
};

export function ScaleInfoView({ onBack }: ScaleInfoViewProps) {
  const [selectedKey, setSelectedKey] = useState("C");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingNote, setPlayingNote] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const rootIndex = getKeyIndex(selectedKey);

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
  }, []);

  const majorNotes = getScaleNotes(rootIndex, SCALE_FORMULAS.major);
  const harmonicMinorNotes = getScaleNotes(rootIndex, SCALE_FORMULAS.harmonicMinor);
  const melodicMinorNotes = getScaleNotes(rootIndex, SCALE_FORMULAS.melodicMinor);
  const melodicMinorDescendingNotes = getScaleNotes(rootIndex, SCALE_FORMULAS.melodicMinorDescending);

  // 각 음계별 코드 정보
  const majorChords = getScaleChords(rootIndex, 'major');
  const harmonicMinorChords = getScaleChords(rootIndex, 'harmonicMinor');
  const melodicMinorChords = getScaleChords(rootIndex, 'melodicMinor');

  // 음계에서 특정 음의 옥타브 계산 함수
  const getNoteOctave = (notes: string[], noteIndex: number, isDescending: boolean = false): number => {
    let currentOctave = 4; // 시작 옥타브
    
    console.log(`=== 옥타브 계산 디버깅 ===`);
    console.log(`음계: [${notes.join(', ')}]`);
    console.log(`계산할 인덱스: ${noteIndex}`);
    console.log(`하행 여부: ${isDescending}`);
    
    for (let i = 0; i <= noteIndex; i++) {
      if (i > 0) {
        const currentNote = notes[i];
        const previousNote = notes[i-1];
        
        // 알파벳 순서 정의 (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
        const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        const currentIndex = noteOrder.indexOf(currentNote);
        const previousIndex = noteOrder.indexOf(previousNote);
        
        console.log(`${i}: ${previousNote}(${previousIndex}) → ${currentNote}(${currentIndex}), 현재 옥타브: ${currentOctave}`);
        
        if (isDescending) {
          // 하행 음계: 알파벳이 증가하는 경우 옥타브 감소
          if (currentIndex > previousIndex) {
            currentOctave--;
            console.log(`  → 하행: 옥타브 감소! ${currentOctave+1} → ${currentOctave}`);
          } else {
            console.log(`  → 하행: 옥타브 유지: ${currentOctave}`);
          }
        } else {
          // 상행 음계: 알파벳이 감소하는 경우 옥타브 증가
          if (currentIndex < previousIndex) {
            currentOctave++;
            console.log(`  → 상행: 옥타브 증가! ${currentOctave-1} → ${currentOctave}`);
          } else {
            console.log(`  → 상행: 옥타브 유지: ${currentOctave}`);
          }
        }
      } else {
        console.log(`${i}: ${notes[i]} (첫 번째 음), 옥타브: ${currentOctave}`);
      }
    }
    
    console.log(`최종 결과: ${notes[noteIndex]}${currentOctave}`);
    console.log(`========================`);
    
    return currentOctave;
  };

  // 개별 음 재생 함수
  const playNote = async (note: string, octave: number = 4) => {
    if (isPlaying || !audioManagerRef.current) return;
    
    setIsPlaying(true);
    setPlayingNote(note);
    try {
      await audioManagerRef.current.playNote(note, 1000, octave);
    } catch (error) {
      console.error('음 재생 오류:', error);
    } finally {
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingNote(null);
      }, 1000);
    }
  };

  // 전체 음계 재생 함수
  const playScale = async (notes: string[]) => {
    if (isPlaying || !audioManagerRef.current) return;
    
    setIsPlaying(true);
    try {
      let currentOctave = 4; // 시작 옥타브
      
      for (let i = 0; i < notes.length; i++) {
        setPlayingNote(notes[i]);
        
        if (i > 0) {
          const currentNote = notes[i];
          const previousNote = notes[i-1];
          
          // 알파벳 순서 정의 (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
          const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          
          const currentIndex = noteOrder.indexOf(currentNote);
          const previousIndex = noteOrder.indexOf(previousNote);
          
          // 알파벳이 감소하는 경우 (예: A# → C) 옥타브 증가
          if (currentIndex < previousIndex) {
            currentOctave++;
          }
          // 알파벳이 증가하는 경우는 이전 옥타브 유지
        }
        
        await audioManagerRef.current.playNote(notes[i], 600, currentOctave);
        await new Promise(resolve => setTimeout(resolve, 700)); // 각 음 사이 간격
      }
    } catch (error) {
      console.error('음계 재생 오류:', error);
    } finally {
      setIsPlaying(false);
      setPlayingNote(null);
    }
  };

  const ScaleCard = ({ 
    title, 
    notes, 
    description, 
    formula,
    descendingNotes,
    descendingFormula,
    chords
  }: { 
    title: string; 
    notes: string[]; 
    description: string;
    formula: string;
    descendingNotes?: string[];
    descendingFormula?: string;
    chords?: Array<{note: string, chord: string, numeral: string, degree: number}>;
  }) => (
    <Card className="p-6 mb-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {/* 전체 음계 재생 버튼 */}
          <Button
            onClick={() => playScale(notes)}
            disabled={isPlaying}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3 h-3 mr-1" />
                재생중
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
{descendingNotes ? '상행 재생' : '전체 재생'}
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="text-xs text-gray-500 mb-4">
          <span className="font-medium">{descendingNotes ? '상행 음정 공식:' : '음정 공식:'}</span> {formula}
          {descendingFormula && (
            <>
              <br />
              <span className="font-medium">하행 음정 공식:</span> {descendingFormula}
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {notes.map((note, index) => {
          const isCurrentlyPlaying = playingNote === note;
          return (
            <button
              key={index}
              onClick={() => playNote(note, getNoteOctave(notes, index))}
              disabled={isPlaying}
              className={`
                transition-all duration-200 transform
                ${isCurrentlyPlaying 
                  ? 'bg-gradient-to-br from-green-200 to-green-300 border-green-400 scale-105 shadow-lg' 
                  : 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 hover:from-purple-200 hover:to-purple-300 hover:scale-105'
                }
                ${isPlaying && !isCurrentlyPlaying ? 'opacity-50' : ''}
                border rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-purple-400
              `}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentlyPlaying ? 'text-green-800' : 'text-purple-800'
              }`}>
                {index + 1}
              </div>
              <div className={`font-semibold ${
                isCurrentlyPlaying ? 'text-green-900' : 'text-purple-900'
              }`}>
                {note}
              </div>
              {isCurrentlyPlaying && (
                <div className="text-xs text-green-700 mt-1">
                  <Volume2 className="w-3 h-3 mx-auto" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 하행 음계 (가락단음계인 경우에만 표시) */}
      {descendingNotes && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">하행 (Descending)</h4>
              <Button
                onClick={() => playScale([...descendingNotes].reverse())}
                disabled={isPlaying}
                variant="outline"
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3 h-3 mr-1" />
                    재생중
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    하행 재생
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {descendingNotes.map((note, index) => {
              const isCurrentlyPlaying = playingNote === note;
              return (
                <button
                  key={`desc-${index}`}
                  onClick={() => playNote(note, getNoteOctave(descendingNotes, index, true))}
                  disabled={isPlaying}
                  className={`
                    transition-all duration-200 transform
                    ${isCurrentlyPlaying 
                      ? 'bg-gradient-to-br from-green-200 to-green-300 border-green-400 scale-105 shadow-lg' 
                      : 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 hover:from-orange-200 hover:to-orange-300 hover:scale-105'
                    }
                    ${isPlaying && !isCurrentlyPlaying ? 'opacity-50' : ''}
                    border rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-orange-400
                  `}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentlyPlaying ? 'text-green-800' : 'text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className={`font-semibold ${
                    isCurrentlyPlaying ? 'text-green-900' : 'text-orange-900'
                  }`}>
                    {note}
                  </div>
                  {isCurrentlyPlaying && (
                    <div className="text-xs text-green-700 mt-1">
                      <Volume2 className="w-3 h-3 mx-auto" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
      
      {/* 코드 정보 섹션 */}
      {chords && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center mb-3">
            <Guitar className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-800">해당 음계의 코드</h4>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {chords.map((chord, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border rounded-lg p-2 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">{chord.degree}도</div>
                  <div className="font-medium text-gray-800 text-sm">{chord.chord}</div>
                  <div className="text-xs text-purple-600 mt-1">{chord.numeral}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">코드진행:</span>
            <div className="mt-1">
              {[chords[0], chords[4], chords[5], chords[3]].map(chord => chord.chord).join(' - ')}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-4">
        <span className="font-medium">도레미:</span> 도 레 {descendingNotes ? '미(♭) 파 솔 라(♭) 시(♭)' : '미 파 솔 라 시'}
        <br />
        <span className="font-medium text-purple-600">💡 팁:</span> 각 음을 클릭하면 해당 음을 들을 수 있습니다
        {descendingNotes && (
          <>
            <br />
            <span className="font-medium text-orange-600">📝 참고:</span> 가락단음계는 상행과 하행이 다릅니다
          </>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-full mr-3">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">음계 정보</h1>
              <p className="text-sm text-gray-600">조별 음계 구성음 안내</p>
              {isPlaying && (
                <div className="flex items-center gap-1 text-purple-600 text-xs mt-1">
                  <Volume2 className="w-3 h-3" />
                  <span>재생 중: {playingNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 조 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            조 선택
          </label>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="조를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {KEYS.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}조
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 음계 탭 */}
        <Tabs defaultValue="major" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="major">장음계</TabsTrigger>
            <TabsTrigger value="harmonic">화성단음계</TabsTrigger>
            <TabsTrigger value="melodic">가락단음계</TabsTrigger>
          </TabsList>
          
          <TabsContent value="major" className="mt-4">
            <ScaleCard
              title={`${selectedKey} 장음계 (Major Scale)`}
              notes={majorNotes}
              description="가장 기본적인 음계로, 밝고 명랑한 느낌을 주는 음계입니다."
              formula="장2-장2-단2-장2-장2-장2-단2"
              chords={majorChords}
            />
          </TabsContent>
          
          <TabsContent value="harmonic" className="mt-4">
            <ScaleCard
              title={`${selectedKey}m 화성단음계 (Harmonic Minor)`}
              notes={harmonicMinorNotes}
              description="자연단음계의 7음을 반음 올린 음계로, 동양적이고 신비로운 느낌을 줍니다."
              formula="장2-단2-장2-장2-단2-증2-단2"
              chords={harmonicMinorChords}
            />
          </TabsContent>
          
          <TabsContent value="melodic" className="mt-4">
            <ScaleCard
              title={`${selectedKey}m 가락단음계 (Melodic Minor)`}
              notes={melodicMinorNotes}
              description="상행 시 6, 7음을 반음 올리고, 하행 시 자연단음계와 같아지는 음계입니다."
              formula="장2-단2-장2-장2-장2-장2-단2"
              descendingNotes={melodicMinorDescendingNotes}
              descendingFormula="장2-단2-장2-장2-단2-장2-장2"
              chords={melodicMinorChords}
            />
          </TabsContent>
        </Tabs>

        {/* 하단 정보 */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 음계 학습 가이드</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div>
              <span className="font-medium">🎵 음향 기능:</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• 개별 음 클릭: 해당 음을 클래식 기타 사운드로 재생</li>
                <li>• 전체 재생: 음계 전체를 순서대로 재생</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">🎼 음계 특징:</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• 장음계: 밝은 느낌의 곡에 주로 사용</li>
                <li>• 화성단음계: 어두운 느낌의 곡에 주로 사용</li>
                <li>• 가락단음계: 상행↗️과 하행↘️이 다른 특별한 음계</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">🎸 코드 정보:</span>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• 각 음계마다 고유한 7개 코드가 만들어집니다</li>
                <li>• 로마숫자 표기법으로 코드 기능을 나타냅니다</li>
                <li>• 코드 진행 예시로 음계의 특성을 파악할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}