import { useState } from "react";
import { ArrowLeft, Share2, Download, Trophy, Star, Target, Crown, User, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import UserProfileManager, { Badge as BadgeType, ScoreEntry, ALL_BADGES } from "./UserProfileSystem";

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const profileManager = UserProfileManager.getInstance();
  const profile = profileManager.getProfile();
  const leaderboard = profileManager.getLeaderboard();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>프로필을 찾을 수 없습니다.</p>
            <Button onClick={onBack} className="mt-4">돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unlockedBadges = profile.badges;
  const totalBadges = ALL_BADGES.length;
  const completionRate = Math.round((unlockedBadges.length / totalBadges) * 100);

  const myScores = leaderboard.filter(entry => entry.nickname === profile.nickname);
  const globalRankings = leaderboard
    .reduce((acc, entry) => {
      const key = `${entry.gameType}-${entry.level}`;
      if (!acc[key] || acc[key].score < entry.score) {
        acc[key] = entry;
      }
      return acc;
    }, {} as Record<string, ScoreEntry>);

  const getMyRank = (gameType: string, level: string): number => {
    const entries = leaderboard
      .filter(entry => entry.gameType === gameType && entry.level === level)
      .sort((a, b) => b.score - a.score);
    
    const myBest = myScores
      .filter(score => score.gameType === gameType && score.level === level)
      .sort((a, b) => b.score - a.score)[0];
    
    if (!myBest) return 0;
    return entries.findIndex(entry => 
      entry.nickname === profile.nickname && entry.score === myBest.score
    ) + 1;
  };

  const generateShareData = () => {
    const data = {
      nickname: profile.nickname,
      badges: unlockedBadges.length,
      completionRate,
      highScores: Object.values(profile.highScores.fretboardMatch).concat(
        Object.values(profile.highScores.chordInput)
      ).filter(score => score > 0),
      joinedAt: profile.createdAt
    };
    
    return `🎸 기타 코드 마스터 성과 🎸

🎯 플레이어: ${data.nickname}
🏆 획득 배지: ${data.badges}/${totalBadges}개 (${completionRate}%)
⭐ 최고 점수들: ${data.highScores.join(', ')}점
📅 시작일: ${data.joinedAt.toLocaleDateString()}

#기타코드마스터 #기타연습 #게임으로배우기`;
  };

  const handleShare = async () => {
    const shareText = generateShareData();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '기타 코드 마스터 - 나의 성과',
          text: shareText
        });
      } catch (err) {
        console.log('공유가 취소되었습니다.');
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(shareText);
      alert('성과 데이터가 클립보드에 복사되었습니다!');
    }
  };

  const handleExportData = () => {
    const data = profileManager.exportProfileData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guitar-master-${profile.nickname}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateQRData = () => {
    return JSON.stringify({
      nickname: profile.nickname,
      badges: unlockedBadges.length,
      completionRate,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            메인으로
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              공유
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              데이터
            </Button>
          </div>
        </div>

        {/* 프로필 헤더 */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">{profile.nickname}</CardTitle>
            <CardDescription>
              {profile.createdAt.toLocaleDateString()}부터 연주 중
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">{unlockedBadges.length}/{totalBadges}</div>
              <div className="text-sm text-gray-600">배지 수집률</div>
              <Progress value={completionRate} className="w-full" />
              <div className="text-xs text-gray-500">{completionRate}% 완료</div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">배지</TabsTrigger>
            <TabsTrigger value="scores">점수</TabsTrigger>
            <TabsTrigger value="leaderboard">리더보드</TabsTrigger>
          </TabsList>

          {/* 배지 탭 */}
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  획득한 배지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {ALL_BADGES.map((badge) => {
                    const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
                    const unlockedBadge = unlockedBadges.find(b => b.id === badge.id);
                    
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isUnlocked 
                            ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center space-y-2">
                          <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                            {badge.icon}
                          </div>
                          <div className={`font-medium text-sm ${isUnlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-600">{badge.description}</div>
                          
                          {isUnlocked ? (
                            <div className="space-y-1">
                              <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                                ✨ 획득 완료!
                              </Badge>
                              {unlockedBadge && (
                                <div className="text-xs text-gray-500">
                                  {unlockedBadge.unlockedAt.toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              {badge.level === 'beginner' ? '초급' : badge.level === 'intermediate' ? '중급' : '고급'} 게임을 완료하면 획득
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 점수 탭 */}
          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  최고 점수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">짝짓기 게임</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner', 'intermediate', 'advanced'].map(level => (
                        <div key={level} className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 capitalize">{level}</div>
                          <div className="text-xl font-bold text-blue-600">
                            {profile.highScores.fretboardMatch[level] || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            순위: {getMyRank('fretboardMatch', level) || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">코드 입력 게임</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner', 'intermediate', 'advanced'].map(level => (
                        <div key={level} className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-sm text-gray-600 capitalize">{level}</div>
                          <div className="text-xl font-bold text-orange-600">
                            {profile.highScores.chordInput[level] || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            순위: {getMyRank('chordInput', level) || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 리더보드 탭 */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  전체 리더보드
                </CardTitle>
                <CardDescription>
                  각 게임별 최고 점수 상위 10명
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 짝짓기 게임 리더보드 */}
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">🎸 짝짓기 게임</h4>
                    {['beginner', 'intermediate', 'advanced'].map(level => {
                      const levelScores = leaderboard
                        .filter(entry => entry.gameType === 'fretboardMatch' && entry.level === level)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5);
                      
                      return (
                        <div key={level} className="mb-4">
                          <div className="text-sm font-medium text-gray-600 capitalize mb-2">{level}</div>
                          <div className="space-y-1">
                            {levelScores.length > 0 ? levelScores.map((entry, index) => (
                              <div 
                                key={index}
                                className={`flex justify-between items-center p-2 rounded text-sm ${
                                  entry.nickname === profile.nickname 
                                    ? 'bg-blue-100 border border-blue-300' 
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="font-mono text-xs w-6">#{index + 1}</span>
                                  <span>{entry.nickname}</span>
                                  {entry.nickname === profile.nickname && <Crown className="w-3 h-3 text-yellow-500" />}
                                </span>
                                <span className="font-medium">{entry.score}점</span>
                              </div>
                            )) : (
                              <div className="text-xs text-gray-500 text-center py-2">아직 기록이 없습니다</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 코드 입력 게임 리더보드 */}
                  <div>
                    <h4 className="font-medium mb-3 text-orange-600">🎯 코드 입력 게임</h4>
                    {['beginner', 'intermediate', 'advanced'].map(level => {
                      const levelScores = leaderboard
                        .filter(entry => entry.gameType === 'chordInput' && entry.level === level)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5);
                      
                      return (
                        <div key={level} className="mb-4">
                          <div className="text-sm font-medium text-gray-600 capitalize mb-2">{level}</div>
                          <div className="space-y-1">
                            {levelScores.length > 0 ? levelScores.map((entry, index) => (
                              <div 
                                key={index}
                                className={`flex justify-between items-center p-2 rounded text-sm ${
                                  entry.nickname === profile.nickname 
                                    ? 'bg-orange-100 border border-orange-300' 
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="font-mono text-xs w-6">#{index + 1}</span>
                                  <span>{entry.nickname}</span>
                                  {entry.nickname === profile.nickname && <Crown className="w-3 h-3 text-yellow-500" />}
                                </span>
                                <span className="font-medium">{entry.score}점</span>
                              </div>
                            )) : (
                              <div className="text-xs text-gray-500 text-center py-2">아직 기록이 없습니다</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}