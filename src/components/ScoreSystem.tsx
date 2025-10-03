import { useState, useEffect } from "react";
import { Trophy, Clock, Star } from "lucide-react";
import { Badge } from "./ui/badge";

export interface ScoreSystemProps {
  isActive: boolean;
  onTimeUp?: () => void;
  maxTime?: number;
  gameMode: string;
}

export interface ScoreData {
  currentScore: number;
  totalScore: number;
  bestScore: number;
  timeLeft: number;
  isNewRecord: boolean;
}

export function useScoreSystem(gameMode: string, maxTime: number = 10) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // localStorage에서 최고점 가져오기
  const getBestScore = () => {
    const saved = localStorage.getItem(`guitarApp_bestScore_${gameMode}`);
    return saved ? parseInt(saved) : 0;
  };

  const [bestScore, setBestScore] = useState(getBestScore());

  // 타이머 시작
  const startTimer = () => {
    setStartTime(Date.now());
    setTimeLeft(maxTime);
    setIsActive(true);
  };

  // 타이머 정지
  const stopTimer = () => {
    setIsActive(false);
    setStartTime(null);
  };

  // 정답 처리 (고정 점수)
  const handleCorrectAnswer = () => {
    const score = 100; // 정답당 고정 100점
    
    setCurrentScore(score);
    setTotalScore(prev => prev + score);
    setIsActive(false);
    
    return score;
  };

  // 틀린 답 처리
  const handleWrongAnswer = () => {
    setCurrentScore(0);
    setIsActive(false);
    return 0;
  };

  // 라운드 완료 처리
  const completeRound = (finalScore: number) => {
    const newRecord = finalScore > bestScore;
    if (newRecord) {
      setBestScore(finalScore);
      localStorage.setItem(`guitarApp_bestScore_${gameMode}`, finalScore.toString());
      setIsNewRecord(true);
    } else {
      setIsNewRecord(false);
    }
    return newRecord;
  };

  // 게임 초기화
  const resetGame = () => {
    setCurrentScore(0);
    setTotalScore(0);
    setTimeLeft(maxTime);
    setIsActive(false);
    setStartTime(null);
    setIsNewRecord(false);
  };

  const resetRound = () => {
    setCurrentScore(0);
    setTimeLeft(maxTime);
    setIsActive(false);
    setStartTime(null);
    // totalScore와 bestScore는 유지
  };

  // 타이머 업데이트
  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, maxTime - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsActive(false);
        setCurrentScore(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime, maxTime]);

  return {
    startTimer,
    stopTimer,
    handleCorrectAnswer,
    handleWrongAnswer,
    completeRound,
    resetGame,
    resetRound,
    currentScore,
    totalScore,
    bestScore,
    timeLeft,
    isActive,
    isNewRecord
  };
}

// 점수 표시 컴포넌트
interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
  bestScore: number;
  timeLeft: number;
  isActive: boolean;
  isNewRecord?: boolean;
}

export function ScoreDisplay({ 
  currentScore, 
  totalScore, 
  bestScore, 
  timeLeft, 
  isActive,
  isNewRecord 
}: ScoreDisplayProps) {
  const getTimeColor = () => {
    if (timeLeft > 7) return "text-green-600";
    if (timeLeft > 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColor = () => {
    if (currentScore >= 80) return "bg-green-500";
    if (currentScore >= 50) return "bg-yellow-500";
    if (currentScore >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          {/* 타이머 */}
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${getTimeColor()}`} />
            <span className={`font-mono text-lg ${getTimeColor()}`}>
              {timeLeft.toFixed(1)}s
            </span>
          </div>
          
          {/* 현재 점수 */}
          {isActive && currentScore > 0 && (
            <Badge className={`${getScoreColor()} text-white`}>
              +{currentScore}
            </Badge>
          )}
        </div>
        
        {/* 최고점 */}
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-gray-700">
            최고: {bestScore}
          </span>
          {isNewRecord && (
            <Badge className="bg-yellow-500 text-white animate-pulse">
              NEW!
            </Badge>
          )}
        </div>
      </div>
      
      {/* 총점 */}
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-purple-600" />
        <span className="font-medium text-gray-700">
          총점: <span className="text-lg font-bold text-purple-600">{totalScore}</span>
        </span>
      </div>
    </div>
  );
}

// 최종 결과 표시 컴포넌트
interface ResultDisplayProps {
  totalScore: number;
  bestScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onBack: () => void;
  newBadge?: any; // Badge 타입
  isNewHighScore?: boolean;
}

export function ResultDisplay({ 
  totalScore, 
  bestScore, 
  isNewRecord, 
  onRestart, 
  onBack,
  newBadge,
  isNewHighScore
}: ResultDisplayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        {/* 배지 획득 알림 */}
        {newBadge && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
            <div className="text-4xl mb-2">{newBadge.icon}</div>
            <h3 className="text-xl font-bold text-yellow-600 mb-1">배지 획득!</h3>
            <p className="font-medium text-gray-800">{newBadge.name}</p>
            <p className="text-sm text-gray-600">{newBadge.description}</p>
          </div>
        )}

        {/* 최고점수 알림 */}
        {isNewHighScore && !newBadge && (
          <div className="mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-yellow-600 mb-1">최고점수!</h3>
            <p className="text-gray-600">새로운 기록을 달성했습니다!</p>
          </div>
        )}

        {/* 기존 신기록 알림 */}
        {isNewRecord && !isNewHighScore && !newBadge && (
          <div className="mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-yellow-600 mb-1">신기록!</h3>
            <p className="text-gray-600">축하합니다!</p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">게임 완료</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">이번 점수</span>
              <span className="text-xl font-bold text-purple-600">{totalScore}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">최고 점수</span>
              <span className="text-xl font-bold text-yellow-600">{bestScore}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            다시 하기
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  );
}