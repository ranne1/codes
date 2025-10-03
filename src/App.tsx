import { useState, useEffect } from "react";
import { GameModeCard } from "./components/GameModeCard";
import { FretboardMatchGame } from "./components/FretboardMatchGame";
import { ChordInputGame } from "./components/ChordInputGame";
import { ChordInfoView } from "./components/ChordInfoView";
import { ScaleInfoView } from "./components/ScaleInfoView";
import { UserProfileSetup } from "./components/UserProfileSetup";
import { ProfileView } from "./components/ProfileView";
import { DifficultySelector } from "./components/DifficultySelector";
import { Guitar, FileText, BookOpen, Music, User, Trophy } from "lucide-react";
import UserProfileManager from "./components/UserProfileSystem";

type GameMode = "main" | "fretboard-match" | "chord-input" | "chord-info" | "scale-info" | "profile" | "setup" | "difficulty-fretboard" | "difficulty-chord";
type Difficulty = "beginner" | "intermediate" | "advanced";

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>("main");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("beginner");
  const [hasProfile, setHasProfile] = useState(false);
  const profileManager = UserProfileManager.getInstance();

  useEffect(() => {
    const profile = profileManager.getProfile();
    if (profile) {
      setHasProfile(true);
    } else {
      setCurrentMode("setup");
    }
  }, []);

  const handleGameMode = (mode: string) => {
    console.log(`${mode} 모드 선택됨`);
    switch (mode) {
      case "지판 짝짓기":
        setCurrentMode("difficulty-fretboard");
        break;
      case "코드 입력":
        setCurrentMode("difficulty-chord");
        break;
      case "코드 정보":
        setCurrentMode("chord-info");
        break;
      case "음계 정보":
        setCurrentMode("scale-info");
        break;
      case "프로필":
        setCurrentMode("profile");
        break;
      default:
        setCurrentMode("main");
    }
  };

  const handleProfileCreated = (nickname: string) => {
    profileManager.createProfile(nickname);
    setHasProfile(true);
    setCurrentMode("main");
  };

  const handleDifficultySelect = (gameType: 'fretboard-match' | 'chord-input', difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentMode(gameType);
  };

  if (currentMode === "setup") {
    return <UserProfileSetup onProfileCreated={handleProfileCreated} />;
  }

  if (currentMode === "profile") {
    return <ProfileView onBack={() => setCurrentMode("main")} />;
  }

  if (currentMode === "difficulty-fretboard") {
    return (
      <DifficultySelector
        gameType="fretboard-match"
        onBack={() => setCurrentMode("main")}
        onDifficultySelect={(difficulty) => handleDifficultySelect("fretboard-match", difficulty)}
      />
    );
  }

  if (currentMode === "difficulty-chord") {
    return (
      <DifficultySelector
        gameType="chord-input"
        onBack={() => setCurrentMode("main")}
        onDifficultySelect={(difficulty) => handleDifficultySelect("chord-input", difficulty)}
      />
    );
  }

  if (currentMode === "fretboard-match") {
    return (
      <FretboardMatchGame 
        onBack={() => setCurrentMode("difficulty-fretboard")} 
        difficulty={selectedDifficulty}
      />
    );
  }

  if (currentMode === "chord-input") {
    return (
      <ChordInputGame 
        onBack={() => setCurrentMode("difficulty-chord")} 
        difficulty={selectedDifficulty}
      />
    );
  }

  if (currentMode === "chord-info") {
    return <ChordInfoView onBack={() => setCurrentMode("main")} />;
  }

  if (currentMode === "scale-info") {
    return <ScaleInfoView onBack={() => setCurrentMode("main")} />;
  }



  // 메인 화면 렌더링
  const profile = profileManager.getProfile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Guitar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">기타 코드 마스터</h1>
          <p className="text-gray-600">게임으로 배우는 기타 코드</p>
        </div>

        {/* 프로필 요약 카드 */}
        {profile && (
          <div className="mb-6 p-4 bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{profile.nickname}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span>배지 {profile.badges.length}/6개 수집</span>
                    {profile.badges.length === 6 && (
                      <span className="text-yellow-600 ml-1">🎉</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleGameMode("프로필")}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Trophy className="w-5 h-5" />
              </button>
            </div>
            {profile.badges.length > 0 && (
              <div className="mt-3 flex gap-1">
                {profile.badges.slice(0, 6).map((badge, index) => (
                  <span key={badge.id} className="text-lg">{badge.icon}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 게임 모드 카드들 */}
        <div className="space-y-6">
          <GameModeCard
            title="짝짓기 게임"
            description="레벨별 모든 기타 코드를 매칭하고 배지를 획득하세요"
            icon={Guitar}
            color="bg-blue-500"
            onClick={() => handleGameMode("지판 짝짓기")}
          />
          
          <GameModeCard
            title="코드 입력 게임"
            description="레벨별 모든 코드를 지판에 직접 입력하고 배지를 획득하세요"
            icon={FileText}
            color="bg-orange-500"
            onClick={() => handleGameMode("코드 입력")}
          />
          
          <GameModeCard
            title="코드 정보 보기"
            description="60+ 기타 코드의 상세 정보와 실제 음을 확인하세요"
            icon={BookOpen}
            color="bg-teal-500"
            onClick={() => handleGameMode("코드 정보")}
          />
          
          <GameModeCard
            title="음계 정보"
            description="각 조별 음계를 클래식 기타 사운드로 들으며 학습하세요"
            icon={Music}
            color="bg-purple-500"
            onClick={() => handleGameMode("음계 정보")}
          />
        </div>

        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}