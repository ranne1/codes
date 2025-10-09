import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, Trophy, Check, X, Play, Volume2, Star, Gift, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useScoreSystem, ScoreDisplay, ResultDisplay } from "./ScoreSystem";
import { allChordPatterns, type ChordPattern } from "./ChordDatabase";
import { AudioManager } from "./AudioManager";
import UserProfileManager, { CHORD_LEVELS, Badge as BadgeType, ALL_BADGES } from "./UserProfileSystem";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface FretPosition {
  string: number; // 1-6 (6번줄이 가장 두꺼운 줄)
  fret: number;   // 0-4 (0은 개방현)
}

interface ChordInputGameProps {
  onBack: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 확장된 코드 패턴 사용


export function ChordInputGame({ onBack, difficulty }: ChordInputGameProps) {
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [playerInput, setPlayerInput] = useState<FretPosition[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameChords, setGameChords] = useState<ChordPattern[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const [claimedBadge, setClaimedBadge] = useState<BadgeType | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  
  const scoreSystem = useScoreSystem("chord-input", 15); // 코드 입력은 조금 더 긴 시간
  const profileManager = UserProfileManager.getInstance();

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
  }, []);

  // 난이도별 코드 필터링
  const availableChords = CHORD_LEVELS[difficulty];
  const filteredChordPatterns = allChordPatterns.filter(pattern => 
    availableChords.includes(pattern.name)
  );

  // 게임 초기화 - 해당 난이도의 모든 코드 사용
  const initializeGame = () => {
    const shuffledChords = [...filteredChordPatterns].sort(() => Math.random() - 0.5);
    setGameChords(shuffledChords); // 해당 레벨의 모든 코드 사용
    setCurrentChordIndex(0);
    setPlayerInput([]);
    setShowResult(false);
    setIsCorrect(false);
    setGameCompleted(false);
    setNewBadge(null);
    setIsNewHighScore(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const currentChord = gameChords[currentChordIndex];

  const resetGame = () => {
    initializeGame();
    scoreSystem.resetGame();
  };

  const checkAndClaimBadge = () => {
    const profileManager = UserProfileManager.getInstance();
    
    // 배지 ID 생성 (claimBadge와 일치하도록 수정)
    const badgeId = `input-${difficulty}`;
    
    // 이미 배지가 있는지 확인
    const profile = profileManager.getProfile();
    const existingBadge = profile?.badges.find(b => b.id === badgeId);
    if (existingBadge) {
      // 이미 배지가 있으면 표시하지 않음
      return;
    }

    // 배지 획득 (올바른 gameType 사용)
    const result = profileManager.claimBadge('chord-input', difficulty);
    setBadgeMessage(result.message);
    
    if (result.success && result.badge) {
      setClaimedBadge(result.badge);
    } else {
      setClaimedBadge(null);
    }
    
    setShowBadgeModal(true);
  };

  // 지판 클릭 시 음 재생
  const playFretSound = async (string: number, fret: number) => {
    if (!audioManagerRef.current) return;
    
    try {
      await audioManagerRef.current.playFret(string, fret, 600);
    } catch (error) {
      console.error('프렛 음 재생 오류:', error);
    }
  };

  // 코드 안내 재생
  const playCurrentChord = async () => {
    if (isPlaying || !audioManagerRef.current || !currentChord) return;
    
    setIsPlaying(true);
    try {
      // 코드 패턴을 frets 배열로 변환
      const frets: (number | null)[] = [null, null, null, null, null, null];
      currentChord.positions.forEach(pos => {
        frets[pos.string - 1] = pos.fret;
      });
      
      await audioManagerRef.current.playChordFromFrets(frets, 1800);
    } catch (error) {
      console.error('코드 재생 오류:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1800);
    }
  };

  const handleFretClick = (string: number, fret: number) => {
    if (showResult) return;

    // 첫 클릭 시 타이머 시작
    if (playerInput.length === 0) {
      scoreSystem.startTimer();
    }

    // 지판 클릭 시 음 재생
    playFretSound(string, fret);

    const position = { string, fret };
    
    // 같은 줄에 이미 입력된 위치가 있으면 제거하고 새로 추가
    const newInput = playerInput.filter(p => p.string !== string);
    
    // 0프렛(개방현)이 아닌 경우에만 추가
    if (fret > 0) {
      newInput.push(position);
    }
    
    setPlayerInput(newInput);
  };

  const checkAnswer = () => {
    const correctPositions = currentChord.positions;
    
    // 입력된 위치와 정답 위치가 정확히 일치하는지 확인
    const isMatch = correctPositions.length === playerInput.length &&
      correctPositions.every(correct => 
        playerInput.some(input => 
          input.string === correct.string && input.fret === correct.fret
        )
      );

    setIsCorrect(isMatch);
    setShowResult(true);
    
    if (isMatch) {
      scoreSystem.handleCorrectAnswer();
    } else {
      scoreSystem.handleWrongAnswer();
    }
  };

  const nextChord = () => {
    if (currentChordIndex < gameChords.length - 1) {
      setCurrentChordIndex(prev => prev + 1);
      setPlayerInput([]);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setGameCompleted(true);
      scoreSystem.completeRound(scoreSystem.totalScore);
      
      // 프로필 업데이트
      const profile = profileManager.getProfile();
      if (profile) {
        console.log('코드 입력 게임 완료! 점수:', scoreSystem.totalScore);
        
        // 최고점수 체크
        const isNewHigh = profileManager.updateHighScore('chordInput', difficulty, scoreSystem.totalScore);
        setIsNewHighScore(isNewHigh);
        console.log('최고점수 업데이트:', isNewHigh);
        
        // 리더보드에 점수 저장
        profileManager.saveScoreEntry('chordInput', difficulty, scoreSystem.totalScore);
        
        // 마지막 플레이 시간 업데이트
        profileManager.updateLastPlayed();

        // 게임 진행도 증가 (배지 획득을 위한 카운트)
        const newBadge = profileManager.incrementGameProgress('chordInput', difficulty);
        if (newBadge) {
          setNewBadge(newBadge);
          console.log('자동 배지 획득:', newBadge.name);
        }

        // 배지 자동 획득 체크 (수동 배지 획득용)
        setTimeout(() => {
          checkAndClaimBadge();
        }, 1000); // 결과 표시 후 1초 뒤에 배지 체크
      }
    }
  };

  const tryAgain = () => {
    setPlayerInput([]);
    setShowResult(false);
    setIsCorrect(false);
  };

  // 기타 지판 렌더링
  const renderFretboard = () => {
    const strings = 6;
    const frets = 4;
    const stringNames = ['E', 'B', 'G', 'D', 'A', 'E']; // 1번줄부터 6번줄까지

    return (
      <div className="bg-amber-100 rounded-lg p-6 border-2 border-amber-200">
        {/* 프렛 번호 표시 */}
        <div className="flex mb-4">
          <div className="w-12"></div> {/* 줄 이름 공간 */}
          {Array.from({ length: frets + 1 }, (_, fretIndex) => (
            <div key={fretIndex} className="flex-1 text-center text-sm font-medium text-amber-700">
              {fretIndex}
            </div>
          ))}
        </div>
        
        {/* 기타 지판 */}
        <div className="relative">
          {/* 각 줄별로 가로로 배치 */}
          {stringNames.map((stringName, stringIndex) => {
            const stringNumber = stringIndex + 1;
            const stringThickness = stringNumber === 6 ? 3 : stringNumber === 5 ? 2.5 : 2; // 굵은 줄일수록 두껍게
            
            return (
              <div key={stringIndex} className="flex items-center mb-4 relative">
                {/* 줄 이름 */}
                <div className="w-12 text-right pr-2 text-sm font-medium text-amber-800">
                  {stringName}
                </div>
                
                {/* 기타 줄 (가로선) */}
                <div 
                  className="absolute bg-amber-800 opacity-50"
                  style={{
                    left: '48px',
                    right: '0',
                    height: `${stringThickness}px`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                
                {/* 프렛 위치 버튼들 */}
                {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                  const isPressed = playerInput.some(
                    p => p.string === stringNumber && p.fret === fretIndex
                  );
                  
                  return (
                    <button
                      key={fretIndex}
                      onClick={() => handleFretClick(stringNumber, fretIndex)}
                      disabled={showResult}
                      className={`flex-1 h-10 mx-1 rounded-lg border-2 transition-all duration-200 relative z-10 ${
                        isPressed
                          ? 'bg-orange-500 border-orange-600 text-white shadow-lg'
                          : fretIndex === 0
                            ? 'bg-amber-200/60 border-amber-400 hover:border-amber-500 hover:bg-amber-200/80'
                            : 'bg-white/80 border-amber-300 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md'
                      } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isPressed && (
                        <div className="w-6 h-6 bg-orange-600 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white text-xs">●</span>
                        </div>
                      )}
                    </button>
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
                  left: `${48 + (fretIndex * (100 - 12) / frets)}%`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto">
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {difficulty === 'beginner' ? '초급' : difficulty === 'intermediate' ? '중급' : '고급'}
              </Badge>
              <Badge variant="secondary">
                {gameChords.length}개 코드
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-800">코드 입력</h1>
            <p className="text-sm text-gray-600">빠르게 정답을 맞춰 높은 점수를 얻어보세요!</p>
            {isPlaying && (
              <div className="flex items-center justify-center gap-1 text-green-600 text-xs mt-1">
                <Volume2 className="w-3 h-3" />
                <span>재생 중</span>
              </div>
            )}
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

        {/* 배지 상태 표시 */}
        {(() => {
          const profile = profileManager.getProfile();
          if (profile) {
            const badgeId = `chord-${difficulty}`;
            const hasBadge = profile.badges.some(b => b.id === badgeId);
            
            if (hasBadge) {
              const badge = profile.badges.find(b => b.id === badgeId);
              return (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-2xl">{badge?.icon}</span>
                      <div>
                        <div className="font-medium text-yellow-600">배지 획득 완료!</div>
                        <div className="text-xs text-gray-500">{badge?.name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        모든 코드를 완료하면 배지를 획득할 수 있습니다!
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          }
          return null;
        })()}

        {/* 점수 표시 */}
        <ScoreDisplay
          currentScore={scoreSystem.currentScore}
          totalScore={scoreSystem.totalScore}
          bestScore={scoreSystem.bestScore}
          timeLeft={scoreSystem.timeLeft}
          isActive={scoreSystem.isActive}
          isNewRecord={scoreSystem.isNewRecord}
        />

        {!gameCompleted && currentChord && (
          <>
            {/* 현재 코드 정보 */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentChord.name}</h2>
                <p className="text-gray-600 mb-3">{currentChord.description}</p>
                
                {/* 코드 재생 버튼 */}
                <div className="mb-3">
                  <Button
                    onClick={playCurrentChord}
                    disabled={isPlaying}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    {isPlaying ? (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        재생 중...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        코드 듣기
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">클래식 기타 사운드로 들어보세요</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  진행률: {currentChordIndex + 1} / {gameChords.length}
                </div>
              </div>
            </div>

            {/* 기타 지판 */}
            <div className="mb-6">
              {renderFretboard()}
            </div>

            {/* 결과 표시 */}
            {showResult && (
              <div className={`rounded-lg p-4 mb-4 border-2 ${
                isCorrect 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-red-100 border-red-300'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {isCorrect ? (
                    <>
                      <Check className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-green-800">정답입니다!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 text-red-600" />
                      <span className="font-bold text-red-800">틀렸습니다!</span>
                    </>
                  )}
                </div>
                
                <div className="text-center">
                  {isCorrect ? (
                    <Button onClick={nextChord} className="bg-green-600 hover:bg-green-700">
                      {currentChordIndex < gameChords.length - 1 ? '다음 코드' : '게임 완료'}
                    </Button>
                  ) : (
                    <Button onClick={tryAgain} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                      다시 시도
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 확인 버튼 */}
            {!showResult && (
              <div className="text-center">
                <Button 
                  onClick={checkAnswer}
                  disabled={playerInput.length === 0}
                  className="bg-orange-500 hover:bg-orange-600 px-8 py-2"
                >
                  확인
                </Button>
              </div>
            )}

            {/* 게임 설명 */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">게임 방법</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {gameChords.length}개의 코드를 순서대로 지판에 입력하세요.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>🎵 '코드 듣기' 버튼으로 목표 코드를 미리 들어보세요</p>
                <p>🎸 지판 클릭 시 해당 음이 클래식 기타 사운드로 재생됩니다</p>
                <p>✅ 모든 코드를 맞추면 {difficulty === 'beginner' ? '초급' : difficulty === 'intermediate' ? '중급' : '고급'} 배지를 획득할 수 있습니다!</p>
              </div>
            </div>
          </>
        )}



        {/* 배지 획득 모달 */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
              {claimedBadge ? (
                <>
                  <div className="text-6xl mb-4">{claimedBadge.icon}</div>
                  <h3 className="text-2xl font-bold text-yellow-600 mb-2">배지 획득!</h3>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{claimedBadge.name}</h4>
                  <p className="text-gray-600 mb-4">{claimedBadge.description}</p>
                  
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 mb-6">
                    <div className="text-sm text-gray-600 mb-2">🎉 축하합니다!</div>
                    <div className="text-lg font-bold text-orange-600">
                      {difficulty === 'beginner' ? '초급' : difficulty === 'intermediate' ? '중급' : '고급'} 레벨 완료!
                    </div>
                    <div className="text-sm text-gray-500">
                      {gameChords.length}개 코드를 모두 마스터했습니다!
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">배지 획득 실패</h3>
                  <p className="text-gray-600 mb-4">{badgeMessage}</p>
                </>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowBadgeModal(false);
                    onBack();
                  }}
                  className="flex-1"
                >
                  메인으로
                </Button>
                <Button 
                  onClick={() => {
                    setShowBadgeModal(false);
                    if (claimedBadge) {
                      resetGame();
                    }
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {claimedBadge ? '다시 도전' : '확인'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 일반 결과 모달 (배지가 없는 경우) */}
        {/* 게임 완료 시 배지 획득 버튼 */}
        {gameCompleted && !newBadge && !showBadgeModal && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">게임 완료!</h3>
              <p className="text-gray-700 mb-4">
                {gameChords.length}개 코드를 모두 완료했습니다!<br/>
                배지를 획득해보세요!
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={checkAndClaimBadge}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  배지 획득하기
                </Button>
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  다시 도전
                </Button>
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  메인으로
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 일반 결과 모달 (배지 모달이 없는 경우) */}
        {gameCompleted && !newBadge && !showBadgeModal && (
          <ResultDisplay
            totalScore={scoreSystem.totalScore}
            bestScore={scoreSystem.bestScore}
            isNewRecord={scoreSystem.isNewRecord}
            onRestart={resetGame}
            onBack={onBack}
            isNewHighScore={isNewHighScore}
          />
        )}
      </div>
    </div>
  );
}