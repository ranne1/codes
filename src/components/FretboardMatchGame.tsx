import React, { useState, useEffect, useRef } from "react";
import { GuitarChordCard } from "./GuitarChordCard";
import { ChordNameCard } from "./ChordNameCard";
import { Button } from "./ui/button";
import { ArrowLeft, RotateCcw, Volume2, Trophy, Star, Gift, CheckCircle2 } from "lucide-react";
import { useScoreSystem, ScoreDisplay, ResultDisplay } from "./ScoreSystem";
import { allChords, type ChordData } from "./ChordDatabase";
import { AudioManager } from "./AudioManager";
import UserProfileManager, { CHORD_LEVELS, Badge as BadgeType, ALL_BADGES } from "./UserProfileSystem";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface FretboardMatchGameProps {
  onBack: () => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function FretboardMatchGame({ onBack, difficulty }: FretboardMatchGameProps) {
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [gameChords, setGameChords] = useState<ChordData[]>([]);
  const [gameChordNames, setGameChordNames] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const [claimedBadge, setClaimedBadge] = useState<BadgeType | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  
  const scoreSystem = useScoreSystem("fretboard-match", 10);
  const profileManager = UserProfileManager.getInstance();

  useEffect(() => {
    audioManagerRef.current = new AudioManager();
  }, []);

  // 난이도별 코드 필터링
  const availableChords = CHORD_LEVELS[difficulty];
  const chords: ChordData[] = allChords.filter(chord => 
    availableChords.includes(chord.name)
  );

  // 게임 시작 시 해당 난이도의 모든 코드 사용
  const initializeGame = () => {
    const selectedNames = chords.map(chord => chord.name).sort(() => Math.random() - 0.5);
    
    setGameChords(chords); // 해당 레벨의 모든 코드 사용
    setGameChordNames(selectedNames);
    setMatches(new Set());
    setSelectedChord(null);
    setSelectedName(null);
    setIsGameCompleted(false);
    setNewBadge(null);
    setIsNewHighScore(false);
  };

  // 컴포넌트 마운트 시 게임 초기화
  useEffect(() => {
    initializeGame();
  }, []);

  // 코드 재생 함수
  const playChordFromFrets = async (frets: (number | null)[]) => {
    if (isPlaying || !audioManagerRef.current) return;
    
    setIsPlaying(true);
    try {
      await audioManagerRef.current.playChordFromFrets(frets, 1500);
    } catch (error) {
      console.error('오디오 재생 오류:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const handleChordSelect = (chordId: string) => {
    if (matches.has(chordId)) return;
    setSelectedChord(selectedChord === chordId ? null : chordId);
    
    // 새로운 선택이면 타이머 시작 및 코드 재생
    if (selectedChord !== chordId && !selectedName) {
      scoreSystem.startTimer();
    }
    
    // 선택된 코드 재생 (새로 선택하는 경우에만)
    if (selectedChord !== chordId) {
      const selectedChordData = gameChords.find(chord => chord.id === chordId);
      if (selectedChordData) {
        playChordFromFrets(selectedChordData.frets);
      }
    }
  };

  const handleNameSelect = (chordName: string) => {
    if (matches.has(chordName)) return;
    setSelectedName(selectedName === chordName ? null : chordName);
    
    // 새로운 선택이면 타이머 시작 및 코드 재생
    if (selectedName !== chordName && !selectedChord) {
      scoreSystem.startTimer();
    }
    
    // 선택된 코드명에 해당하는 코드 재생 (새로 선택하는 경우에만)
    if (selectedName !== chordName) {
      const selectedChordData = gameChords.find(chord => chord.name === chordName);
      if (selectedChordData) {
        playChordFromFrets(selectedChordData.frets);
      }
    }
  };

  const resetGame = () => {
    initializeGame();
    scoreSystem.resetGame();
  };

  const checkAndClaimBadge = () => {
    const profileManager = UserProfileManager.getInstance();
    
    // 배지 ID 생성 (claimBadge와 일치하도록 수정)
    const badgeId = `fretboard-${difficulty}`;
    
    // 이미 배지가 있는지 확인
    const profile = profileManager.getProfile();
    const existingBadge = profile?.badges.find(b => b.id === badgeId);
    if (existingBadge) {
      // 이미 배지가 있으면 표시하지 않음
      return;
    }

    // 배지 획득 (올바른 gameType 사용)
    const result = profileManager.claimBadge('fretboard-match', difficulty);
    setBadgeMessage(result.message);
    
    if (result.success && result.badge) {
      setClaimedBadge(result.badge);
    } else {
      setClaimedBadge(null);
    }
    
    setShowBadgeModal(true);
  };

  useEffect(() => {
    if (selectedChord && selectedName) {
      const chord = gameChords.find(c => c.id === selectedChord);
      if (chord && chord.name === selectedName) {
        // 정답!
        const earnedScore = scoreSystem.handleCorrectAnswer();
        setTimeout(() => {
          // 고유한 매치 키를 사용하여 중복 방지
          const matchKey = `${selectedChord}-${selectedName}`;
          setMatches(prev => new Set([...prev, matchKey]));
          setSelectedChord(null);
          setSelectedName(null);
        }, 500);
      } else {
        // 틀렸을 때
        scoreSystem.handleWrongAnswer();
        setTimeout(() => {
          setSelectedChord(null);
          setSelectedName(null);
        }, 1000);
      }
    }
  }, [selectedChord, selectedName, gameChords]);

  // 게임 완료 체크 및 배지 획득
  useEffect(() => {
    // 매치된 코드 개수 계산 (새로운 매치 키 형식 사용)
    const matchedCount = matches.size;
    const isAllMatched = matchedCount === gameChords.length;
    
    console.log(`매치 상태: ${matchedCount}/${gameChords.length}, matches.size: ${matches.size}`);
    console.log('매치된 항목들:', Array.from(matches));
    
    if (gameChords.length > 0 && isAllMatched && !isGameCompleted) {
      console.log(`${difficulty} 레벨 완료! 매치된 코드:`, matchedCount, '총 코드:', gameChords.length);
      setIsGameCompleted(true);
      scoreSystem.completeRound(scoreSystem.totalScore);
      
      // 프로필 업데이트
      const profile = profileManager.getProfile();
      if (profile) {
        console.log('프로필 업데이트 시작, 현재 점수:', scoreSystem.totalScore);
        
        // 최고점수 체크
        const isNewHigh = profileManager.updateHighScore('fretboardMatch', difficulty, scoreSystem.totalScore);
        setIsNewHighScore(isNewHigh);
        console.log('최고점수 업데이트:', isNewHigh);
        
        // 리더보드에 점수 저장
        profileManager.saveScoreEntry('fretboardMatch', difficulty, scoreSystem.totalScore);
        
        // 마지막 플레이 시간 업데이트
        profileManager.updateLastPlayed();

        // 게임 진행도 증가 (배지 획득을 위한 카운트)
        const newBadge = profileManager.incrementGameProgress('fretboardMatch', difficulty);
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
  }, [matches.size, gameChords.length, isGameCompleted, scoreSystem.totalScore, difficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            돌아가기
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
            <h1 className="text-xl font-bold">짝짓기 (지판)</h1>
            <p className="text-sm text-muted-foreground">코드를 정확히 매칭해서 점수를 얻어보세요!</p>
            {isPlaying && (
              <div className="flex items-center justify-center gap-1 text-green-600 text-xs mt-1">
                <Volume2 className="w-3 h-3" />
                <span>재생 중</span>
              </div>
            )}
          </div>
          
          <Button variant="outline" onClick={resetGame} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            다시하기
          </Button>
        </div>

        {/* 배지 진행도 표시 */}
        {(() => {
          const profile = profileManager.getProfile();
          if (profile) {
            const progress = profileManager.getBadgeProgress('fretboardMatch', difficulty);
            const badgeId = `fretboard-${difficulty}`;
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

        {/* 게임 영역 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 왼쪽: 기타 코드 지판들 */}
          <div className="flex flex-col">
            <h2 className="text-lg font-medium mb-4 text-center h-7">기타 코드 지판</h2>
            <div className="space-y-4 w-full">
              {gameChords.map((chord) => (
                <GuitarChordCard
                  key={chord.id}
                  chord={chord}
                  isSelected={selectedChord === chord.id}
                  onClick={() => handleChordSelect(chord.id)}
                />
              ))}
            </div>
          </div>

          {/* 오른쪽: 코드명들 */}
          <div className="flex flex-col">
            <h2 className="text-lg font-medium mb-4 text-center h-7">코드명</h2>
            <div className="space-y-4 w-full">
              {gameChordNames.map((chordName) => {
                // 해당 코드명과 매치된 코드 ID가 있는지 확인
                const isMatched = gameChords.some(chord => 
                  chord.name === chordName && matches.has(`${chord.id}-${chordName}`)
                );
                
                return (
                  <ChordNameCard
                    key={chordName}
                    chordName={chordName}
                    isSelected={selectedName === chordName}
                    isMatched={isMatched}
                    onClick={() => handleNameSelect(chordName)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 설명 및 진행률 */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="font-medium mb-2">게임 방법</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {gameChords.length}개의 기타 코드 지판과 코드명을 매치하세요.
          </p>
          
          {/* 진행률 표시 */}
          {(() => {
            const matchedCount = matches.size;
            const progress = (matchedCount / gameChords.length) * 100;
            
            return (
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">진행률</span>
                  <span className="text-sm text-gray-600">{matchedCount}/{gameChords.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {matchedCount === gameChords.length && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    🎉 모든 코드를 맞췄습니다! 배지를 획득하세요!
                  </p>
                )}
              </div>
            );
          })()}
          
          <p className="text-xs text-gray-500">
            ✅ 모든 코드를 맞추면 {difficulty === 'beginner' ? '초급' : difficulty === 'intermediate' ? '중급' : '고급'} 배지를 획득할 수 있습니다!
          </p>
        </div>

        {/* 게임 완료 시 배지 획득 버튼 */}
        {isGameCompleted && !showBadgeModal && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">게임 완료!</h3>
              <p className="text-gray-700 mb-4">
                {gameChords.length}개 코드를 모두 맞췄습니다!<br/>
                배지를 획득해보세요!
              </p>
              <Button 
                onClick={checkAndClaimBadge}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                배지 획득하기
              </Button>
            </div>
          </div>
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
                    <div className="text-lg font-bold text-purple-600">
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
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  {claimedBadge ? '다시 도전' : '확인'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 일반 결과 모달 (배지 모달이 없는 경우) */}
        {isGameCompleted && !showBadgeModal && (
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