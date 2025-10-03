import { ArrowLeft, Target, Zap, Crown, Star, Gift } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import UserProfileManager, { CHORD_LEVELS, Badge as BadgeType } from "./UserProfileSystem";

interface DifficultySelectorProps {
  gameType: 'fretboard-match' | 'chord-input';
  onBack: () => void;
  onDifficultySelect: (level: 'beginner' | 'intermediate' | 'advanced') => void;
}

export function DifficultySelector({ gameType, onBack, onDifficultySelect }: DifficultySelectorProps) {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const [claimedBadge, setClaimedBadge] = useState<BadgeType | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const profileManager = UserProfileManager.getInstance();
  const profile = profileManager.getProfile();


  
  const gameTypeKey = gameType === 'fretboard-match' ? 'fretboardMatch' : 'chordInput';
  
  const levels = [
    {
      id: 'beginner' as const,
      name: '초급',
      description: '기본 코드 8개',
      icon: Target,
      color: 'bg-green-500',
      chords: CHORD_LEVELS.beginner,
      requirement: null
    },
    {
      id: 'intermediate' as const,
      name: '중급',
      description: '7th 코드와 바레 코드 12개',
      icon: Zap,
      color: 'bg-blue-500', 
      chords: CHORD_LEVELS.intermediate,
      requirement: '초급 배지 필요'
    },
    {
      id: 'advanced' as const,
      name: '고급',
      description: '모든 확장 코드',
      icon: Crown,
      color: 'bg-purple-500',
      chords: CHORD_LEVELS.advanced,
      requirement: '중급 배지 필요'
    }
  ];



  const getHighScore = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!profile) return 0;
    return profile.highScores[gameTypeKey][level] || 0;
  };

  const hasBadge = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!profile) return false;
    const badgeId = gameType === 'fretboard-match' 
      ? `fretboard-${level}` 
      : `input-${level}`;
    return profile.badges.some(badge => badge.id === badgeId);
  };

  const isUnlocked = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') return hasBadge('beginner');
    if (level === 'advanced') return hasBadge('intermediate');
    return false;
  };

  const getGameTitle = () => {
    return gameType === 'fretboard-match' ? '짝짓기 게임' : '코드 입력 게임';
  };

  const handleClaimBadge = (level: 'beginner' | 'intermediate' | 'advanced') => {
    // 먼저 해당 레벨의 모든 코드를 완료했는지 직접 체크
    const levelData = levels.find(l => l.id === level);
    if (!levelData) {
      setBadgeMessage('레벨 정보를 찾을 수 없습니다.');
      setClaimedBadge(null);
      setShowBadgeModal(true);
      return;
    }

    // 모든 코드가 완료되었는지 확인 (실제 게임에서 한 번이라도 성공했는지)
    const allCompleted = levelData.chords.every(chordName => {
      // 여기서 실제로 해당 코드를 완료했는지 체크하는 로직
      // 간단하게 하이스코어가 있으면 완료한 것으로 간주
      const highScore = getHighScore(level);
      return highScore > 0;
    });

    if (!allCompleted) {
      setBadgeMessage(`${level === 'beginner' ? '초급' : level === 'intermediate' ? '중급' : '고급'} 레벨의 모든 코드를 먼저 완료해주세요!`);
      setClaimedBadge(null);
      setShowBadgeModal(true);
      return;
    }

    // 배지 획득 시도
    const result = profileManager.claimBadge(gameType, level);
    setBadgeMessage(result.message);
    
    if (result.success && result.badge) {
      setClaimedBadge(result.badge);
    } else {
      setClaimedBadge(null);
    }
    
    setShowBadgeModal(true);
    setForceUpdate(prev => prev + 1); // 컴포넌트 재렌더링 강제
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </Button>
          <h1 className="text-xl font-bold text-gray-800">{getGameTitle()}</h1>
        </div>

        {/* 설명 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">난이도를 선택하세요. 각 레벨의 모든 코드를 완료하면 배지를 획득할 수 있습니다!</p>
              <div className="flex items-center gap-2 text-xs">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>배지를 모아서 다음 레벨을 잠금 해제하세요</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 난이도 선택 카드들 */}
        <div className="space-y-4">
          {levels.map((level) => {
            const highScore = getHighScore(level.id);
            const unlocked = isUnlocked(level.id);
            const completed = hasBadge(level.id);
            const Icon = level.icon;

            return (
              <Card 
                key={level.id}
                className={`transition-all cursor-pointer ${
                  unlocked 
                    ? 'hover:shadow-lg border-2 hover:border-purple-300' 
                    : 'opacity-60 cursor-not-allowed bg-gray-100'
                }`}
                onClick={() => unlocked && onDifficultySelect(level.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{level.name}</CardTitle>
                        <CardDescription>{level.description}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      {completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ✅ 완료
                        </Badge>
                      )}
                      {highScore > 0 && (
                        <Badge variant="outline" className="text-xs">
                          최고: {highScore}점
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* 코드 목록 미리보기 */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">포함 코드:</div>
                    <div className="flex flex-wrap gap-1">
                      {level.chords.slice(0, 6).map((chord, index) => (
                        <span key={chord} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {chord}
                        </span>
                      ))}
                      {level.chords.length > 6 && (
                        <span className="text-xs text-gray-500">
                          +{level.chords.length - 6}개
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 게임 정보 */}
                  {unlocked ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">총 코드 수</span>
                        <span className="font-medium">{level.chords.length}개</span>
                      </div>
                      
                      {completed ? (
                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                          🏆 배지 획득 완료!
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-purple-600 font-medium">
                            게임을 완료하고 배지를 받아보세요!
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimBadge(level.id);
                            }}
                            className="w-full h-8 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                          >
                            <Gift className="w-3 h-3 mr-1" />
                            배지 받기
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      🔒 {level.requirement}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 하단 여백 */}
        <div className="h-8"></div>

        {/* 배지 획득 모달 */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center">
              {claimedBadge ? (
                <>
                  <div className="text-6xl mb-4">{claimedBadge.icon}</div>
                  <h3 className="text-xl font-bold text-yellow-600 mb-2">축하합니다!</h3>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{claimedBadge.name}</h4>
                  <p className="text-gray-600 mb-4">{claimedBadge.description}</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">배지 획득 실패</h3>
                </>
              )}
              
              <p className="text-sm text-gray-600 mb-4">{badgeMessage}</p>
              
              <Button 
                onClick={() => setShowBadgeModal(false)}
                className="w-full"
              >
                확인
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}