# 기타 코드 마스터 프로젝트

## 📁 파일 구조

### 메인 애플리케이션
- `App.tsx` - 메인 애플리케이션 (기타 코드 학습 앱)
- `components/` - 앱에서 사용하는 React 컴포넌트들
- `styles/globals.css` - Tailwind CSS 설정 및 전역 스타일

### 별도 도구들
- `FigmaSpecification.tsx` - **독립적인 피그마 기획서 페이지**
- `DesignSystem.tsx` - 디자인 시스템 라이브러리 (앱 내 접근 가능)
- `FigmaStyleSpecification.tsx` - 이전 버전 피그마 도구 (사용 안함)

### 문서
- `docs/app-design-specification.md` - 상세한 앱 설계서

## 🎯 사용 방법

### 1. 메인 앱 실행
기본적으로 `App.tsx`가 실행되어 기타 코드 학습 앱이 표시됩니다.

### 2. 피그마 기획서 보기
완전히 별도의 독립적인 피그마 스타일 기획서를 보려면:
1. `App.tsx` 파일의 기본 export를 변경하거나
2. `FigmaSpecification.tsx`를 별도로 실행

```typescript
// App.tsx에서 피그마 기획서로 전환하려면:
import FigmaSpecification from "./FigmaSpecification";

export default function App() {
  return <FigmaSpecification />;
}
```

### 3. 디자인 시스템 보기
메인 앱에서 "디자인 시스템 보기" 버튼을 클릭하면 앱 내에서 접근 가능합니다.

## 🎨 피그마 기획서 특징

`FigmaSpecification.tsx`는 실제 피그마와 유사한 인터페이스를 제공합니다:

- **완전한 독립 페이지**: 앱과 분리된 별도의 기획서
- **피그마 스타일 UI**: 헤더, 레이어 패널, 캔버스, 속성 패널
- **계층 구조**: 페이지 > 프레임 > 컴포넌트 > 레이어
- **인터랙티브**: 레이어 선택, 확장/축소, 표시/숨김
- **반응형 뷰**: 모바일/데스크톱 뷰 전환
- **상세 속성**: 각 요소의 크기, 색상, 폰트 등 상세 정보

## 🛠 개발 현황

### ✅ 완료된 기능
- 메인 페이지 UI
- 짝짖기(지판) 게임
- 디자인 시스템 라이브러리
- 피그마 스타일 기획서

### 🚧 개발 예정
- 짝짖기(음표) 게임
- 짝짖기(지판-음표) 게임  
- 코드 입력 연습
- 코드 정보 보기

## 📝 사용 예시

### 피그마 기획서 독립 실행
```bash
# FigmaSpecification.tsx를 메인으로 설정
# App.tsx 내용을 다음과 같이 수정:

import FigmaSpecification from "./FigmaSpecification";
export default FigmaSpecification;
```

이렇게 하면 완전히 독립적인 피그마 스타일 기획서가 실행됩니다.