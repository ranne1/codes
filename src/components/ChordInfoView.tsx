import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Music, Search, BookOpen, Info, Play, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { allChordInfo, type ChordInfo } from "./ChordDatabase";
import { AudioManager } from "./AudioManager";

interface ChordInfoViewProps {
  onBack: () => void;
}



// 확장된 코드 데이터베이스
const chordDatabase: ChordInfo[] = allChordInfo;


export function ChordInfoView({ onBack }: ChordInfoViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedChord, setSelectedChord] = useState<ChordInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioManagerRef = useRef<AudioManager | null>(null);

  const categories = ["전체", "메이저", "마이너", "세븐스", "마이너7", "메이저7", "서스펜디드", "디미니쉬드", "애드나인", "식스", "바레"];
  const difficulties = ["초급", "중급", "고급"];

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
  }, []);

  // 필터링된 코드 목록
  const filteredChords = chordDatabase.filter(chord => {
    const matchesSearch = chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chord.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || chord.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 코드 재생 함수
  const playChord = async (chord: ChordInfo) => {
    if (isPlaying || !audioManagerRef.current) return;
    
    setIsPlaying(true);
    try {
      await audioManagerRef.current.playChord(chord.notes, 3000);
    } catch (error) {
      console.error('오디오 재생 오류:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  // 단일 음 재생 함수
  const playNote = async (note: string) => {
    if (isPlaying || !audioManagerRef.current) return;
    
    setIsPlaying(true);
    try {
      await audioManagerRef.current.playNote(note, 1500);
    } catch (error) {
      console.error('오디오 재생 오류:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  // 기타 지판 렌더링
  const renderChordDiagram = (chord: ChordInfo) => {
    const strings = 6;
    const frets = 4;
    const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // 1번줄부터 6번줄까지

    return (
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h4 className="text-center font-medium text-amber-800 mb-3">{chord.name} 코드</h4>
        
        {/* 프렛 번호 표시 */}
        <div className="flex mb-2">
          <div className="w-10"></div> {/* 줄 이름 공간 */}
          {Array.from({ length: frets + 1 }, (_, fretIndex) => (
            <div key={fretIndex} className="flex-1 text-center text-xs text-amber-700">
              {fretIndex}
            </div>
          ))}
        </div>
        
        {/* 기타 지판 */}
        <div className="relative">
          {stringNames.map((stringName, stringIndex) => {
            const stringNumber = stringIndex + 1;
            const stringThickness = stringNumber === 6 ? 2.5 : stringNumber === 5 ? 2 : 1.5;
            
            return (
              <div key={stringIndex} className="flex items-center mb-3 relative">
                {/* 줄 이름 */}
                <div className="w-10 text-right pr-2 text-xs font-medium text-amber-800">
                  {stringName}
                </div>
                
                {/* 기타 줄 (가로선) */}
                <div 
                  className="absolute bg-amber-600 opacity-40"
                  style={{
                    left: '40px',
                    right: '0',
                    height: `${stringThickness}px`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* 프렛 위치 표시 */}
                {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                  const hasPosition = chord.positions.some(
                    p => p.string === stringNumber && p.fret === fretIndex
                  );
                  
                  return (
                    <div
                      key={fretIndex}
                      className={`flex-1 h-8 mx-1 flex items-center justify-center relative z-10 ${
                        fretIndex === 0 ? 'bg-amber-100/60' : ''
                      }`}
                    >
                      {hasPosition && (
                        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-red-600 flex items-center justify-center">
                          <span className="text-white text-xs">●</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          {/* 프렛 구분선 */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: frets + 1 }, (_, fretIndex) => (
              <div
                key={fretIndex}
                className="absolute bg-gray-400 opacity-30"
                style={{
                  left: `${40 + (fretIndex * (100 - 10) / frets)}%`,
                  top: '0',
                  width: '1px',
                  height: '100%'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 코드 상세 정보 모달
  const renderChordDetail = (chord: ChordInfo) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{chord.name}</h3>
              <p className="text-gray-600">{chord.fullName}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedChord(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* 코드 다이어그램 */}
          <div className="mb-6">
            {renderChordDiagram(chord)}
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">구성음</h4>
              <div className="flex gap-2 flex-wrap">
                {chord.notes.map((note, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    onClick={() => playNote(note)}
                    disabled={isPlaying}
                    className="h-8 px-3 text-xs cursor-pointer hover:bg-blue-100"
                  >
                    {note}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">클릭하면 음을 들을 수 있습니다</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">난이도</h4>
              <Badge variant={
                chord.difficulty === "초급" ? "default" : 
                chord.difficulty === "중급" ? "secondary" : "destructive"
              }>
                {chord.difficulty}
              </Badge>
            </div>
          </div>

          {/* 코드 재생 버튼 */}
          <div className="mb-6">
            <Button
              onClick={() => playChord(chord)}
              disabled={isPlaying}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  재생 중...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  코드 재생
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-1">클래식 기타 사운드로 아르페지오 재생</p>
          </div>

          {/* 설명 */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-2">설명</h4>
            <p className="text-gray-600 leading-relaxed">{chord.description}</p>
          </div>

          {/* 연주 팁 */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">연주 팁</h4>
            <ul className="space-y-2">
              {chord.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
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
            <h1 className="text-xl font-bold text-gray-800">코드 정보 보기</h1>
            <p className="text-sm text-gray-600">기타 코드 상세 정보</p>
          </div>
          
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-600">
              {filteredChords.length}개 코드
            </span>
            {isPlaying && (
              <div className="flex items-center gap-1 text-green-600">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs">재생 중</span>
              </div>
            )}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="코드명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 카테고리 필터 */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 코드 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChords.map((chord, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedChord(chord)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{chord.name}</CardTitle>
                  <Badge variant={
                    chord.difficulty === "초급" ? "default" : 
                    chord.difficulty === "중급" ? "secondary" : "destructive"
                  } className="text-xs">
                    {chord.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{chord.fullName}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex gap-1 mb-2">
                    {chord.notes.map((note, noteIndex) => (
                      <Badge key={noteIndex} variant="outline" className="text-xs">
                        {note}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {chord.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {chord.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-teal-600">
                    <Info className="w-4 h-4" />
                    <span className="text-xs">자세히 보기</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      playChord(chord);
                    }}
                    disabled={isPlaying}
                    className="h-8 w-8 p-0 hover:bg-green-100"
                  >
                    {isPlaying ? (
                      <Volume2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Play className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredChords.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어나 카테고리를 시도해보세요
            </p>
          </div>
        )}

        {/* 코드 상세 정보 모달 */}
        {selectedChord && renderChordDetail(selectedChord)}
      </div>
    </div>
  );
}