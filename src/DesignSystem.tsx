import { useState } from "react";
import { GameModeCard } from "./components/GameModeCard";
import { GuitarChordCard } from "./components/GuitarChordCard";
import { ChordNameCard } from "./components/ChordNameCard";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { 
  Music, 
  Guitar, 
  FileText, 
  Play, 
  BookOpen,
  Palette,
  Type,
  Square,
  Smartphone,
  Monitor,
  ArrowLeft
} from "lucide-react";

interface DesignSystemProps {
  onBack?: () => void;
}

interface ChordData {
  id: string;
  name: string;
  frets: (number | null)[];
  fingers: (number | null)[];
}

export default function DesignSystem({ onBack }: DesignSystemProps) {
  const [selectedComponent, setSelectedComponent] = useState<string>("overview");

  // 샘플 코드 데이터
  const sampleChords: ChordData[] = [
    { 
      id: "C", 
      name: "C Major", 
      frets: [null, 3, 2, 0, 1, 0], 
      fingers: [null, 3, 2, null, 1, null] 
    },
    { 
      id: "G", 
      name: "G Major", 
      frets: [3, 2, 0, 0, 3, 3], 
      fingers: [2, 1, null, null, 3, 4] 
    },
  ];

  const colorPalette = [
    { name: "Blue", class: "bg-blue-500", hex: "#3B82F6", usage: "짝짖기 (지판)" },
    { name: "Green", class: "bg-green-500", hex: "#10B981", usage: "짝짖기 (음표)" },
    { name: "Purple", class: "bg-purple-500", hex: "#8B5CF6", usage: "짝짖기 (지판-음표)" },
    { name: "Orange", class: "bg-orange-500", hex: "#F97316", usage: "코드 입력" },
    { name: "Teal", class: "bg-teal-500", hex: "#14B8A6", usage: "코드 정보 보기" },
  ];

  const navigation = [
    { id: "overview", label: "Overview", icon: Monitor },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "components", label: "Components", icon: Square },
    { id: "layouts", label: "Layouts", icon: Smartphone },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* 프로젝트 소개 */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-purple-600 rounded-full">
            <Guitar className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">기타 코드 마스터</h1>
        <p className="text-xl text-muted-foreground mb-6">Design System</p>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          게임으로 기타 코드를 학습할 수 있는 모바일 친화적 웹 애플리케이션의 디자인 시스템입니다.
          React와 Tailwind CSS를 기반으로 구축되었으며, shadcn/ui 컴포넌트를 활용합니다.
        </p>
      </div>

      {/* 주요 특징 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Smartphone className="w-8 h-8 mx-auto mb-4 text-blue-500" />
            <h3 className="font-medium mb-2">모바일 우선</h3>
            <p className="text-sm text-muted-foreground">
              최대 너비 448px로 모바일 경험에 최적화
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Palette className="w-8 h-8 mx-auto mb-4 text-green-500" />
            <h3 className="font-medium mb-2">일관된 색상</h3>
            <p className="text-sm text-muted-foreground">
              각 게임 모드별 고유 색상으로 직관적 구분
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Play className="w-8 h-8 mx-auto mb-4 text-purple-500" />
            <h3 className="font-medium mb-2">인터랙티브</h3>
            <p className="text-sm text-muted-foreground">
              게임형 인터랙션과 실시간 피드백
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderColors = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
        <p className="text-muted-foreground mb-6">
          각 게임 모드별로 고유한 색상을 사용하여 사용자가 쉽게 구분할 수 있도록 설계되었습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colorPalette.map((color) => (
          <Card key={color.name}>
            <CardContent className="p-4">
              <div className={`w-full h-20 rounded-lg mb-4 ${color.class}`}></div>
              <h3 className="font-medium mb-1">{color.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{color.hex}</p>
              <Badge variant="secondary" className="text-xs">{color.usage}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 그라디언트 배경 */}
      <Card>
        <CardHeader>
          <CardTitle>Background Gradient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 mb-4"></div>
          <p className="text-sm text-muted-foreground">
            <code>bg-gradient-to-br from-blue-50 to-purple-50</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <p className="text-muted-foreground mb-6">
          시스템 폰트를 기반으로 한 깔끔하고 읽기 쉬운 타이포그래피입니다.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="mb-2">Heading 1 - 기타 코드 마스터</h1>
            <code className="text-sm text-muted-foreground">text-2xl font-bold</code>
          </div>
          
          <div>
            <h2 className="mb-2">Heading 2 - 게임 모드 선택</h2>
            <code className="text-sm text-muted-foreground">text-xl font-medium</code>
          </div>
          
          <div>
            <h3 className="mb-2">Heading 3 - 짝짖기</h3>
            <code className="text-sm text-muted-foreground">text-lg font-medium</code>
          </div>
          
          <div>
            <p className="mb-2">Body Text - 기타 지판에서 코드 위치 맞추기</p>
            <code className="text-sm text-muted-foreground">text-base font-normal</code>
          </div>
          
          <div>
            <p className="text-sm mb-2">Small Text - 점수: 50</p>
            <code className="text-sm text-muted-foreground">text-sm</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComponents = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Components</h2>
        <p className="text-muted-foreground mb-6">
          앱에서 사용되는 핵심 컴포넌트들의 다양한 상태를 보여줍니다.
        </p>
      </div>

      {/* Game Mode Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Game Mode Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GameModeCard
            title="짝짖기"
            description="기타 지판에서 코드 위치 맞추기"
            icon={Guitar}
            color="bg-blue-500"
            onClick={() => {}}
          />
          
          <GameModeCard
            title="짝짖기 (음표)"
            description="음표와 코드명 맞추기"
            icon={Music}
            color="bg-green-500"
            onClick={() => {}}
          />
        </CardContent>
      </Card>

      {/* Guitar Chord Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Guitar Chord Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Default State</p>
              <GuitarChordCard
                chord={sampleChords[0]}
                isSelected={false}
                onClick={() => {}}
                showName={true}
              />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Selected State</p>
              <GuitarChordCard
                chord={sampleChords[1]}
                isSelected={true}
                onClick={() => {}}
                showName={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chord Name Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Chord Name Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Default</p>
              <ChordNameCard
                chordName="C Major"
                isSelected={false}
                onClick={() => {}}
              />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Selected</p>
              <ChordNameCard
                chordName="G Major"
                isSelected={true}
                onClick={() => {}}
              />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Matched</p>
              <ChordNameCard
                chordName="A Minor"
                isSelected={false}
                isMatched={true}
                onClick={() => {}}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLayouts = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Layout Examples</h2>
        <p className="text-muted-foreground mb-6">
          다양한 화면 크기에서의 레이아웃 예시입니다.
        </p>
      </div>

      {/* 모바일 레이아웃 */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Layout (max-w-md)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Guitar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium">기타 코드 마스터</h3>
              <p className="text-sm text-muted-foreground">게임으로 배우는 기타 코드</p>
            </div>
            
            <div className="space-y-2">
              {colorPalette.slice(0, 3).map((color) => (
                <div key={color.name} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className={`w-8 h-8 rounded ${color.class} mr-3`}></div>
                  <div>
                    <p className="font-medium text-sm">{color.usage}</p>
                    <p className="text-xs text-muted-foreground">게임 설명</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 데스크톱 레이아웃 */}
      <Card>
        <CardHeader>
          <CardTitle>Desktop Game Layout (2-column)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="sm">← 돌아가기</Button>
              <div className="text-center">
                <h3 className="font-medium">짝짖기</h3>
                <p className="text-sm text-muted-foreground">점수: 50</p>
              </div>
              <Button variant="outline" size="sm">🔄 다시하기</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-center mb-4 font-medium">기타 코드 지판</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-white rounded border shadow-sm"></div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-center mb-4 font-medium">코드명</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-white rounded border shadow-sm flex items-center justify-center">
                      <span className="text-sm font-medium">Chord {i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (selectedComponent) {
      case "overview":
        return renderOverview();
      case "colors":
        return renderColors();
      case "typography":
        return renderTypography();
      case "components":
        return renderComponents();
      case "layouts":
        return renderLayouts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 사이드바 네비게이션 */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Guitar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold">Design System</h2>
              <p className="text-sm text-muted-foreground">기타 코드 마스터</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="w-full justify-start gap-3 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              앱으로 돌아가기
            </Button>
          )}
          
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedComponent(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  selectedComponent === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}