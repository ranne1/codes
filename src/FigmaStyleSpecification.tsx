import { useState } from "react";
import { GameModeCard } from "./components/GameModeCard";
import { FretboardMatchGame } from "./components/FretboardMatchGame";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { ScrollArea } from "./components/ui/scroll-area";
import { 
  Music, 
  Guitar, 
  FileText, 
  Play, 
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
  ArrowLeft,
  Monitor,
  Smartphone
} from "lucide-react";

interface LayerNode {
  id: string;
  name: string;
  type: 'page' | 'component' | 'layer' | 'text' | 'icon';
  visible: boolean;
  selected: boolean;
  expanded?: boolean;
  children?: LayerNode[];
  props?: Record<string, any>;
  styles?: Record<string, string>;
}

interface FigmaStyleSpecificationProps {
  onBack?: () => void;
}

export default function FigmaStyleSpecification({ onBack }: FigmaStyleSpecificationProps) {
  const [currentPage, setCurrentPage] = useState<string>("main-page");
  const [selectedLayer, setSelectedLayer] = useState<string>("main-page");
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');
  
  // 페이지와 레이어 구조 정의
  const [layerStructure, setLayerStructure] = useState<LayerNode[]>([
    {
      id: "main-page",
      name: "메인 페이지",
      type: "page",
      visible: true,
      selected: true,
      expanded: true,
      children: [
        {
          id: "background",
          name: "Background Gradient",
          type: "layer",
          visible: true,
          selected: false,
          styles: {
            background: "bg-gradient-to-br from-blue-50 to-purple-50",
            padding: "p-4",
            minHeight: "min-h-screen"
          }
        },
        {
          id: "container",
          name: "Main Container",
          type: "layer",
          visible: true,
          selected: false,
          expanded: true,
          styles: {
            maxWidth: "max-w-md",
            margin: "mx-auto"
          },
          children: [
            {
              id: "header-section",
              name: "Header Section",
              type: "component",
              visible: true,
              selected: false,
              expanded: true,
              children: [
                {
                  id: "header-container",
                  name: "Header Container",
                  type: "layer",
                  visible: true,
                  selected: false,
                  styles: {
                    textAlign: "text-center",
                    marginBottom: "mb-8",
                    paddingTop: "pt-8"
                  },
                  children: [
                    {
                      id: "logo-container",
                      name: "Logo Container",
                      type: "layer",
                      visible: true,
                      selected: false,
                      styles: {
                        display: "flex",
                        alignItems: "items-center",
                        justifyContent: "justify-center",
                        marginBottom: "mb-4"
                      },
                      children: [
                        {
                          id: "logo-background",
                          name: "Logo Background",
                          type: "layer",
                          visible: true,
                          selected: false,
                          styles: {
                            padding: "p-3",
                            background: "bg-purple-600",
                            borderRadius: "rounded-full"
                          }
                        },
                        {
                          id: "guitar-icon",
                          name: "Guitar Icon",
                          type: "icon",
                          visible: true,
                          selected: false,
                          props: {
                            icon: "Guitar",
                            size: "w-8 h-8",
                            color: "text-white"
                          }
                        }
                      ]
                    },
                    {
                      id: "main-title",
                      name: "Main Title",
                      type: "text",
                      visible: true,
                      selected: false,
                      props: {
                        text: "기타 코드 마스터",
                        tag: "h1"
                      },
                      styles: {
                        fontSize: "text-2xl",
                        fontWeight: "font-bold",
                        color: "text-gray-800",
                        marginBottom: "mb-2"
                      }
                    },
                    {
                      id: "subtitle",
                      name: "Subtitle",
                      type: "text",
                      visible: true,
                      selected: false,
                      props: {
                        text: "게임으로 배우는 기타 코드",
                        tag: "p"
                      },
                      styles: {
                        color: "text-gray-600"
                      }
                    },
                    {
                      id: "design-system-button",
                      name: "Design System Button",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        variant: "outline",
                        text: "디자인 시스템 보기"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "game-modes-section",
              name: "Game Modes Section",
              type: "component",
              visible: true,
              selected: false,
              expanded: true,
              children: [
                {
                  id: "game-modes-container",
                  name: "Game Modes Container",
                  type: "layer",
                  visible: true,
                  selected: false,
                  styles: {
                    spacing: "space-y-4"
                  },
                  children: [
                    {
                      id: "fretboard-match-card",
                      name: "짝짖기 (지판) Card",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        title: "짝짖기 (지판)",
                        description: "기타 지판에서 코드 위치 맞추기",
                        icon: "Guitar",
                        color: "bg-blue-500"
                      }
                    },
                    {
                      id: "note-match-card",
                      name: "짝짖기 (음표) Card",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        title: "짝짖기 (음표)",
                        description: "음표와 코드명 맞추기",
                        icon: "Music",
                        color: "bg-green-500"
                      }
                    },
                    {
                      id: "fretboard-note-match-card",
                      name: "짝짖기 (지판-음표) Card",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        title: "짝짖기 (지판-음표)",
                        description: "지판 위치와 음표 연결하기",
                        icon: "Play",
                        color: "bg-purple-500"
                      }
                    },
                    {
                      id: "chord-input-card",
                      name: "코드 입력 Card",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        title: "코드 입력",
                        description: "직접 코드를 입력하며 연습하기",
                        icon: "FileText",
                        color: "bg-orange-500"
                      }
                    },
                    {
                      id: "chord-info-card",
                      name: "코드 정보 보기 Card",
                      type: "component",
                      visible: true,
                      selected: false,
                      props: {
                        title: "코드 정보 보기",
                        description: "다양한 기타 코드 정보와 해설",
                        icon: "BookOpen",
                        color: "bg-teal-500"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "bottom-spacer",
              name: "Bottom Spacer",
              type: "layer",
              visible: true,
              selected: false,
              styles: {
                height: "h-8"
              }
            }
          ]
        }
      ]
    },
    {
      id: "fretboard-game-page",
      name: "짝짖기 (지판) 게임 페이지",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      children: [
        {
          id: "game-background",
          name: "Game Background",
          type: "layer",
          visible: true,
          selected: false
        },
        {
          id: "game-header",
          name: "Game Header",
          type: "component",
          visible: true,
          selected: false
        },
        {
          id: "game-content",
          name: "Game Content",
          type: "component",
          visible: true,
          selected: false,
          children: [
            {
              id: "chord-cards-section",
              name: "Chord Cards Section",
              type: "component",
              visible: true,
              selected: false
            },
            {
              id: "name-cards-section",
              name: "Name Cards Section",
              type: "component",
              visible: true,
              selected: false
            }
          ]
        }
      ]
    },
    {
      id: "design-system-page",
      name: "디자인 시스템 페이지",
      type: "page",
      visible: true,
      selected: false,
      expanded: false,
      children: [
        {
          id: "design-sidebar",
          name: "Sidebar Navigation",
          type: "component",
          visible: true,
          selected: false
        },
        {
          id: "design-content",
          name: "Content Area",
          type: "component",
          visible: true,
          selected: false
        }
      ]
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
    setLayerStructure(updateLayer(layerStructure));
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
    setLayerStructure(updateLayer(layerStructure));
  };

  const selectLayer = (layerId: string) => {
    const updateSelection = (nodes: LayerNode[]): LayerNode[] => {
      return nodes.map(node => ({
        ...node,
        selected: node.id === layerId,
        children: node.children ? updateSelection(node.children) : undefined
      }));
    };
    setLayerStructure(updateSelection(layerStructure));
    setSelectedLayer(layerId);
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
    return findLayer(layerStructure);
  };

  const renderLayerIcon = (type: LayerNode['type']) => {
    switch (type) {
      case 'page':
        return <FileImage className="w-4 h-4 text-blue-500" />;
      case 'component':
        return <Component className="w-4 h-4 text-green-500" />;
      case 'layer':
        return <Square className="w-4 h-4 text-gray-500" />;
      case 'text':
        return <span className="w-4 h-4 text-xs font-bold text-purple-500 flex items-center justify-center">T</span>;
      case 'icon':
        return <Circle className="w-4 h-4 text-orange-500" />;
      default:
        return <Square className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderLayerTree = (nodes: LayerNode[], depth: number = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center gap-1 py-1 px-2 hover:bg-accent rounded cursor-pointer ${
            node.selected ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            selectLayer(node.id);
            if (node.type === 'page') {
              setCurrentPage(node.id);
            }
          }}
        >
          {node.children && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerExpansion(node.id);
              }}
              className="p-0.5 hover:bg-accent-foreground/10 rounded"
            >
              {node.expanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
              }
            </button>
          )}
          {!node.children && <div className="w-4" />}
          
          {renderLayerIcon(node.type)}
          
          <span className="text-sm flex-1 truncate">{node.name}</span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(node.id);
            }}
            className="p-0.5 hover:bg-accent-foreground/10 rounded"
          >
            {node.visible ? 
              <Eye className="w-3 h-3 text-muted-foreground" /> : 
              <EyeOff className="w-3 h-3 text-muted-foreground" />
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

  const renderMainPagePreview = () => (
    <div className={`bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg ${
      viewMode === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
    }`}>
      <div className={viewMode === 'mobile' ? 'max-w-md mx-auto' : 'max-w-2xl mx-auto'}>
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Guitar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">기타 코드 마스터</h1>
          <p className="text-gray-600 mb-6">게임으로 배우는 기타 코드</p>
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            <Guitar className="w-4 h-4" />
            디자인 시스템 보기
          </Button>
        </div>

        {/* 게임 모드 카드들 */}
        <div className={`gap-4 ${viewMode === 'mobile' ? 'space-y-4' : 'grid grid-cols-2'}`}>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Guitar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">짝짖기 (지판)</h3>
                <p className="text-sm text-muted-foreground">기타 지판에서 코드 위치 맞추기</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">짝짖기 (음표)</h3>
                <p className="text-sm text-muted-foreground">음표와 코드명 맞추기</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">짝짖기 (지판-음표)</h3>
                <p className="text-sm text-muted-foreground">지판 위치와 음표 연결하기</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">코드 입력</h3>
                <p className="text-sm text-muted-foreground">직접 코드를 입력하며 연습하기</p>
              </div>
            </div>
          </div>

          {viewMode === 'mobile' && (
            <div className="p-4 bg-white rounded-lg shadow-sm border border-teal-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-500 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">코드 정보 보기</h3>
                  <p className="text-sm text-muted-foreground">다양한 기타 코드 정보와 해설</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const selectedLayerData = getSelectedLayerData();

  return (
    <div className="h-screen bg-background flex">
      {/* 레이어 패널 (왼쪽) */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              <h2 className="font-medium">기타 코드 마스터 기획서</h2>
            </div>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* 뷰 모드 전환 */}
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </Button>
            <Button 
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
          </div>
        </div>

        {/* 레이어 트리 */}
        <ScrollArea className="flex-1 p-2">
          {renderLayerTree(layerStructure)}
        </ScrollArea>
      </div>

      {/* 메인 캔버스 (중앙) */}
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {layerStructure.find(p => p.id === currentPage)?.name || "페이지"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {viewMode === 'mobile' ? '모바일 뷰 (최대 448px)' : '데스크톱 뷰 (반응형)'}
          </p>
        </div>
        
        {currentPage === "main-page" && renderMainPagePreview()}
        
        {currentPage === "fretboard-game-page" && (
          <div className="bg-white p-8 rounded-lg border">
            <div className="text-center text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-4" />
              <p>짝짖기 (지판) 게임 페이지</p>
              <p className="text-sm">구현 예정</p>
            </div>
          </div>
        )}

        {currentPage === "design-system-page" && (
          <div className="bg-white p-8 rounded-lg border">
            <div className="text-center text-muted-foreground">
              <Component className="w-12 h-12 mx-auto mb-4" />
              <p>디자인 시스템 페이지</p>
              <p className="text-sm">구현 완료</p>
            </div>
          </div>
        )}
      </div>

      {/* 속성 패널 (오른쪽) */}
      <div className="w-80 bg-card border-l border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium">속성</h3>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {selectedLayerData ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h4 className="text-sm font-medium mb-2">기본 정보</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {renderLayerIcon(selectedLayerData.type)}
                    <span className="text-sm">{selectedLayerData.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    타입: {selectedLayerData.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">표시:</span>
                    {selectedLayerData.visible ? 
                      <Eye className="w-3 h-3 text-green-500" /> : 
                      <EyeOff className="w-3 h-3 text-red-500" />
                    }
                  </div>
                </div>
              </div>

              {/* Props */}
              {selectedLayerData.props && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Props</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedLayerData.props).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="ml-1 font-mono bg-accent px-1 rounded">
                          {typeof value === 'string' ? `"${value}"` : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Styles */}
              {selectedLayerData.styles && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tailwind Classes</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedLayerData.styles).map(([property, className]) => (
                      <div key={property} className="text-xs">
                        <Badge variant="outline" className="text-xs">
                          {className}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 설명 */}
              <div>
                <h4 className="text-sm font-medium mb-2">설명</h4>
                <p className="text-xs text-muted-foreground">
                  {selectedLayerData.type === 'page' && '애플리케이션의 전체 페이지입니다.'}
                  {selectedLayerData.type === 'component' && '재사용 가능한 컴포넌트입니다.'}
                  {selectedLayerData.type === 'layer' && 'UI 레이어 요소입니다.'}
                  {selectedLayerData.type === 'text' && '텍스트 요소입니다.'}
                  {selectedLayerData.type === 'icon' && '아이콘 요소입니다.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Square className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">레이어를 선택하세요</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}