import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { User, Trophy, Target, Crown } from "lucide-react";

interface UserProfileSetupProps {
  onProfileCreated: (nickname: string) => void;
}

export function UserProfileSetup({ onProfileCreated }: UserProfileSetupProps) {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < 2) return;

    setIsLoading(true);
    
    // 짧은 로딩 효과
    setTimeout(() => {
      onProfileCreated(nickname.trim());
      setIsLoading(false);
    }, 500);
  };

  const isValidNickname = nickname.trim().length >= 2 && nickname.trim().length <= 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">프로필 생성</CardTitle>
            <CardDescription className="text-gray-600">
              기타 코드 마스터 여정을 시작하세요!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="2-20자의 닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {nickname.length}/20자
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={!isValidNickname || isLoading}
              >
                {isLoading ? "생성 중..." : "시작하기"}
              </Button>
            </form>

            {/* 게임 소개 */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-gray-800 text-center">게임 특징</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">3단계 난이도</div>
                    <div>초급 → 중급 → 고급</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">배지 수집</div>
                    <div>5세트 클리어 보상</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">리더보드</div>
                    <div>최고 점수 경쟁</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}