import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  Guitar, 
  FileText, 
  BookOpen,
  ChevronRight,
  ChevronDown,
  Square,
  Circle,
  Eye,
  EyeOff,
  Layers,
  Component,
  FileImage,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Settings,
  Grid,
  Copy,
  Download,
  Share2,
  Figma,
  Zap,
  Target
} from "lucide-react";

interface LayerNode {
  id: string;
  name: string;
  type: 'page' | 'frame' | 'component' | 'instance' | 'group' | 'text' | 'icon' | 'rectangle' | 'image';
  visible: boolean;
  selected: boolean;
  expanded?: boolean;
  locked?: boolean;
  children?: LayerNode[];
  properties?: {
    width?: string;
    height?: string;
    x?: number;
    y?: number;
    opacity?: number;
    cornerRadius?: string;
    fill?: string;
    stroke?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: string;
    padding?: string;
    margin?: string;
    gap?: string;
    flexDirection?: string;
    alignItems?: string;
    justifyContent?: string;
  };
  componentProps?: Record<string, any>;
  notes?: string;
}

export default function FigmaSpecification() {
  const [selectedPage, setSelectedPage] = useState<string>("main-page");
  const [selectedLayer, setSelectedLayer] = useState<string>("main-page");
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [activeTab, setActiveTab] = useState<'design' | 'prototype' | 'inspect'>('design');
  
  // 피그마 스타일 페이지 구조 - 3개 기능으로 수정
  const [pageStructure, setPageStructure] = useState<LayerNode[]>([
    {
      id: "main-page",
      name: "📱 메인 페이지",
      type: "page",
      visible: true,
      selected: true,
      expanded: true,
      properties: {
        width: "375px",
        height: "812px"
      },
      children: [
        {
          id: "main-frame",
          name: "Main Frame",
          type: "frame",
          visible: true,
          selected: false,
          expanded: true,
          properties: {
            width: "375px",
            height: "812px",
            fill: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
            padding: "16px"
          },
          children: [
            {
              id: "content-container",
              name: "Content Container",
              type: "frame",
              visible: true,
              selected: false,
              expanded: true,
              properties: {
                width: "343px",
                height: "auto",
                alignItems: "center",
                gap: "32px",
                flexDirection: "column"
              },
              children: [
                {
                  id: "header-component",
                  name: "🎯 Header Component",
                  type: "component",
                  visible: true,
                  selected: false,
                  expanded: true,
                  properties: {
                    width: "343px",
                    height: "auto",
                    gap: "16px",
                    alignItems: "center",
                    flexDirection: "column"
                  },
                  children: [
                    {
                      id: "logo-group",
                      name: "Logo Group",
                      type: "group",
                      visible: true,
                      selected: false,
                      expanded: true,
                      properties: {
                        width: "64px",
                        height: "64px",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      children: [
                        {
                          id: "logo-background",
                          name: "Logo Background",
                          type: "rectangle",
                          visible: true,
                          selected: false,
                          properties: {
                            width: "64px",
                            height: "64px",
                            fill: "#7c3aed",
                            cornerRadius: "32px"
                          }
                        },
                        {
                          id: "guitar-icon",
                          name: "Guitar Icon",
                          type: "icon",
                          visible: true,
                          selected: false,
                          properties: {
                            width: "32px",
                            height: "32px",
                            fill: "#ffffff"
                          },
                          componentProps: {
                            name: "Guitar",
                            variant: "filled"
                          }
                        }
                      ]
                    },
                    {
                      id: "title-text",
                      name: "Main Title",
                      type: "text",
                      visible: true,
                      selected: false,
                      properties: {
                        fontSize: "24px",
                        fontWeight: "700",
                        fontFamily: "Pretendard",
                        fill: "#1f2937",
                        textAlign: "center"
                      },
                      componentProps: {
                        text: "기타 코드 마스터"
                      }
                    },
                    {
                      id: "subtitle-text",
                      name: "Subtitle",
                      type: "text",
                      visible: true,
                      selected: false,
                      properties: {
                        fontSize: "16px",
                        fontWeight: "400",
                        fontFamily: "Pretendard",
                        fill: "#6b7280",
                        textAlign: "center"
                      },
                      componentProps: {
                        text: "게임으로 배우는 기타 코드"
                      }
                    }
                  ]
                },
                {
                  id: "game-modes-component",
                  name: "🎮 Game Modes Component",
                  type: "component",
                  visible: true,
                  selected: false,
                  expanded: true,
                  properties: {
                    width: "343px",
                    height: "auto",
                    gap: "24px",
                    flexDirection: "column"
                  },
                  children: [
                    {
                      id: "fretboard-card",
                      name: "Fretboard Match Card",
                      type: "instance",
                      visible: true,
                      selected: false,
                      properties: {
                        width: "343px",
                        height: "80px",
                        fill: "#ffffff",
                        cornerRadius: "12px",
                        stroke: "#e5e7eb"
                      },
                      componentProps: {
                        title: "짝짖기 게임",
                        description: "기타 지판에서 코드 위치를 맞춰보세요",
                        iconColor: "#3b82f6",
                        accentColor: "#dbeafe"
                      }
                    },
                    {
                      id: "chord-input-card",
                      name: "Chord Input Card",
                      type: "instance",
                      visible: true,
                      selected: false,
                      properties: {
                        width: "343px",
                        height: "80px",
                        fill: "#ffffff",
                        cornerRadius: "12px",
                        stroke: "#e5e7eb"
                      },
                      componentProps: {
                        title: "코드 입력 게임",
                        description: "직접 기타 지판에 코드를 입력하며 연습하세요",
                        iconColor: "#f97316",
                        accentColor: "#fed7aa"
                      }
                    },
                    {
                      id: "chord-info-card",
                      name: "Chord Info Card",
                      type: "instance",
                      visible: true,
                      selected: false,
                      properties: {
                        width: "343px",
                        height: "80px",
                        fill: "#ffffff",
                        cornerRadius: "12px",
                        stroke: "#e5e7eb"
                      },
                      componentProps: {
                        title: "코드 정보 보기",
                        description: "21개 기본 코드의 상세 정보와 연주 팁을 확인하세요",
                        iconColor: "#14b8a6",
                        accentColor: "#ccfbf1"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "game-page",
      name: "🎯 짝짖기 게임 페이지",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      properties: {
        width: "512px",
        height: "812px"
      },
      notes: "짝짖기 게임 화면 - 2열 레이아웃, 컴팩트한 디자인 (max-w-2xl)",
      children: [
        {
          id: "game-frame",
          name: "Game Frame",
          type: "frame",
          visible: true,
          selected: false,
          expanded: true,
          properties: {
            width: "512px",
            height: "812px",
            fill: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)",
            padding: "16px"
          },
          children: [
            {
              id: "game-header",
              name: "Game Header",
              type: "component",
              visible: true,
              selected: false,
              properties: {
                width: "100%",
                height: "60px",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row"
              }
            },
            {
              id: "score-display",
              name: "Score Display Component",
              type: "component",
              visible: true,
              selected: false,
              properties: {
                width: "100%",
                height: "auto",
                gap: "16px"
              }
            },
            {
              id: "game-content",
              name: "Game Content Grid",
              type: "frame",
              visible: true,
              selected: false,
              expanded: true,
              properties: {
                width: "100%",
                height: "auto",
                gap: "16px",
                flexDirection: "row"
              },
              children: [
                {
                  id: "fretboard-column",
                  name: "Fretboard Column",
                  type: "frame",
                  visible: true,
                  selected: false,
                  properties: {
                    width: "50%",
                    height: "auto",
                    gap: "8px",
                    flexDirection: "column",
                    alignItems: "center"
                  }
                },
                {
                  id: "chord-names-column",
                  name: "Chord Names Column",
                  type: "frame",
                  visible: true,
                  selected: false,
                  properties: {
                    width: "50%",
                    height: "auto",
                    gap: "8px",
                    flexDirection: "column",
                    alignItems: "center"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "chord-input-page",
      name: "🎸 코드 입력 게임 페이지",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      properties: {
        width: "375px",
        height: "812px"
      },
      notes: "코드 입력 게임 - 기타 지판 인터랙션"
    },
    {
      id: "chord-info-page",
      name: "📚 코드 정보 페이지",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      properties: {
        width: "375px",
        height: "812px"
      },
      notes: "21개 기본 코드 라이브러리 - 메이저, 마이너, 7th 코드"
    },
    {
      id: "design-system-page",
      name: "🎨 디자인 시스템",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      properties: {
        width: "1440px",
        height: "1024px"
      },
      notes: "컴포넌트 라이브러리 및 디자인 토큰 정의"
    }
  ]);

  const toggleLayerExpansion = (layerId: string) => {
    const updateLayer = (nodes: LayerNode[]): LayerNode[] => {
      return nodes.map(node => {
        if (node.id === layerId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateLayer(node.children) };
        }
        return node;
      });
    };
    setPageStructure(updateLayer(pageStructure));
  };

  const toggleLayerVisibility = (layerId: string) => {
    const updateLayer = (nodes: LayerNode[]): LayerNode[] => {
      return nodes.map(node => {
        if (node.id === layerId) {
          return { ...node, visible: !node.visible };
        }
        if (node.children) {
          return { ...node, children: updateLayer(node.children) };
        }
        return node;
      });
    };
    setPageStructure(updateLayer(pageStructure));
  };

  const selectLayer = (layerId: string) => {
    const updateSelection = (nodes: LayerNode[]): LayerNode[] => {
      return nodes.map(node => ({
        ...node,
        selected: node.id === layerId,
        children: node.children ? updateSelection(node.children) : undefined
      }));
    };
    setPageStructure(updateSelection(pageStructure));
    setSelectedLayer(layerId);
    
    // 페이지 선택시 현재 페이지 변경
    const isPage = pageStructure.find(p => p.id === layerId && p.type === 'page');
    if (isPage) {
      setSelectedPage(layerId);
    }
  };

  const getSelectedLayerData = (): LayerNode | null => {
    const findLayer = (nodes: LayerNode[]): LayerNode | null => {
      for (const node of nodes) {
        if (node.id === selectedLayer) return node;
        if (node.children) {
          const found = findLayer(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findLayer(pageStructure);
  };

  const renderLayerIcon = (type: LayerNode['type']) => {
    const iconMap = {
      page: <FileImage className="w-4 h-4 text-blue-600" />,
      frame: <Square className="w-4 h-4 text-green-600" />,
      component: <Component className="w-4 h-4 text-purple-600" />,
      instance: <Copy className="w-4 h-4 text-orange-600" />,
      group: <Grid className="w-4 h-4 text-gray-600" />,
      text: <Type className="w-4 h-4 text-red-600" />,
      icon: <Circle className="w-4 h-4 text-yellow-600" />,
      rectangle: <Square className="w-4 h-4 text-blue-400" />,
      image: <FileImage className="w-4 h-4 text-pink-600" />
    };
    return iconMap[type] || <Square className="w-4 h-4 text-gray-400" />;
  };

  const renderLayerTree = (nodes: LayerNode[], depth: number = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-1 py-1.5 px-2 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
            node.selected ? 'bg-blue-100 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectLayer(node.id)}
        >
          {node.children && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerExpansion(node.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {node.expanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
              }
            </button>
          )}
          {!node.children && <div className="w-4" />}
          
          {renderLayerIcon(node.type)}
          
          <span className={`text-sm flex-1 truncate ${node.selected ? 'font-medium' : ''}`}>
            {node.name}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(node.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded opacity-60 hover:opacity-100"
          >
            {node.visible ? 
              <Eye className="w-3 h-3" /> : 
              <EyeOff className="w-3 h-3" />
            }
          </button>
        </div>
        
        {node.children && node.expanded && (
          <div>
            {renderLayerTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderCanvas = () => {
    if (selectedPage === "main-page") {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div 
            className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border border-gray-300 ${
              viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full max-w-2xl h-[600px]'
            } overflow-hidden`}
          >
            <div className="p-4 h-full">
              <div className="max-w-md mx-auto h-full flex flex-col">
                {/* 헤더 */}
                <div className="text-center pt-8 pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-purple-600 rounded-full">
                      <Guitar className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">기타 코드 마스터</h1>
                  <p className="text-gray-600 mb-6">게임으로 배우는 기타 코드</p>
                </div>

                {/* 3개 게임 모드 카드들 */}
                <div className="flex-1 space-y-6">
                  {[
                    { title: "짝짖기 게임", desc: "기타 지판에서 코드 위치를 맞춰보세요", color: "bg-blue-500", icon: Guitar },
                    { title: "코드 입력 게임", desc: "직접 기타 지판에 코드를 입력하며 연습하세요", color: "bg-orange-500", icon: FileText },
                    { title: "코드 정보 보기", desc: "21개 기본 코드의 상세 정보와 연주 팁을 확인하세요", color: "bg-teal-500", icon: BookOpen }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${item.color} rounded-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedPage === "game-page") {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border border-gray-300 w-[512px] h-[600px] overflow-hidden">
            <div className="p-4 h-full">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">짝짖기 게임</h2>
                <p className="text-sm text-gray-600">컴팩트한 2열 레이아웃</p>
              </div>
              
              {/* 2열 그리드 시뮬레이션 */}
              <div className="grid grid-cols-2 gap-4 h-96">
                <div className="bg-white rounded-lg p-3 border">
                  <h3 className="text-sm font-medium text-center mb-2">기타 코드 지판</h3>
                  <div className="space-y-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-12 bg-blue-50 rounded border-2 border-blue-200 flex items-center justify-center">
                        <span className="text-xs text-blue-600">코드 {i}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border">
                  <h3 className="text-sm font-medium text-center mb-2">코드명</h3>
                  <div className="space-y-2">
                    {['C', 'Dm', 'Em', 'F', 'G'].map(chord => (
                      <div key={chord} className="h-12 bg-orange-50 rounded border-2 border-orange-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">{chord}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center text-gray-500">
          <FileImage className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-medium">
            {pageStructure.find(p => p.id === selectedPage)?.name || "페이지"}
          </p>
          <p className="text-sm">구현 예정</p>
        </div>
      </div>
    );
  };

  const selectedLayerData = getSelectedLayerData();

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* 피그마 스타일 헤더 */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 flex items-center px-4 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Figma className="w-6 h-6 text-purple-600" />
            <span className="font-medium">기타 코드 마스터 - 기획서 (수정됨)</span>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button 
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="h-7 px-3"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
            <Button 
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="h-7 px-3"
            >
              <Monitor className="w-4 h-4 mr-1" />
              Desktop
            </Button>
          </div>
        </div>
      </div>

      {/* 왼쪽 레이어 패널 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col pt-12">
        <div className="p-4 border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design" className="text-xs">
                <Layers className="w-4 h-4 mr-1" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="prototype" className="text-xs">
                <Zap className="w-4 h-4 mr-1" />
                Prototype
              </TabsTrigger>
              <TabsTrigger value="inspect" className="text-xs">
                <Target className="w-4 h-4 mr-1" />
                Inspect
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 p-2">
          {activeTab === 'design' && renderLayerTree(pageStructure)}
          {activeTab === 'prototype' && (
            <div className="p-4 text-center text-gray-500">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">프로토타입 설정</p>
              <p className="text-xs">3개 기능 간 인터랙션 정의</p>
            </div>
          )}
          {activeTab === 'inspect' && (
            <div className="p-4 text-center text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">코드 검사</p>
              <p className="text-xs">CSS 속성 확인</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* 메인 캔버스 */}
      <div className="flex-1 pt-12">
        {renderCanvas()}
      </div>

      {/* 오른쪽 속성 패널 */}
      <div className="w-80 bg-white border-l border-gray-200 pt-12">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <h3 className="font-medium">Properties</h3>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {selectedLayerData ? (
            <div className="space-y-6">
              {/* 레이어 정보 */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700">Layer Info</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {renderLayerIcon(selectedLayerData.type)}
                    <span className="text-sm font-medium">{selectedLayerData.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Type: <Badge variant="secondary" className="text-xs">{selectedLayerData.type}</Badge>
                  </div>
                </div>
              </div>

              {/* 속성 */}
              {selectedLayerData.properties && (
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Properties</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedLayerData.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 컴포넌트 Props */}
              {selectedLayerData.componentProps && (
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Component Props</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedLayerData.componentProps).map(([key, value]) => (
                      <div key={key} className="p-2 bg-blue-50 rounded">
                        <div className="text-xs font-medium text-blue-700">{key}</div>
                        <div className="text-xs text-blue-600 font-mono">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 노트 */}
              {selectedLayerData.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Notes</h4>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-yellow-800">{selectedLayerData.notes}</p>
                  </div>
                </div>
              )}

              {/* 업데이트 정보 */}
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">📝 업데이트</h4>
                <div className="space-y-1 text-xs text-green-700">
                  <p>• 5개 → 3개 기능으로 간소화</p>
                  <p>• 짝짖기 게임 레이아웃 최적화</p>
                  <p>• 21개 기본 코드로 통일</p>
                  <p>• 모바일 친화적 디자인</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Component className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">레이어를 선택하세요</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}