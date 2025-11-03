# Firebase Analytics 트래킹 가이드

> Firebase Analytics 테스트 앱에서 수집하는 모든 이벤트와 파라미터에 대한 상세 가이드

## 📋 목차

1. [개요](#개요)
2. [트래킹 이벤트 목록](#트래킹-이벤트-목록)
3. [페이지별 트래킹 상세](#페이지별-트래킹-상세)
4. [공통 파라미터](#공통-파라미터)
5. [구현 방식](#구현-방식)
6. [Firebase Console에서 확인하기](#firebase-console에서-확인하기)

---

## 개요

이 프로젝트는 Firebase Analytics 학습 및 테스트를 위한 프로젝트입니다.  
총 **7개의 이벤트**를 3개 페이지에서 트래킹합니다.

### 기술 스택
- **Frontend**: Next.js 15 (App Router)
- **Analytics**: Firebase Analytics SDK
- **Language**: TypeScript
- **Styling**: Vanilla Extract CSS

### 환경 설정
- **개발 환경**: 콘솔 로그 + Firebase 전송
- **프로덕션 환경**: Firebase 전송만

---

## 트래킹 이벤트 목록

| 이벤트명 | 페이지 | 발생 시점 | 주요 파라미터 |
|---------|--------|----------|-------------|
| `todo_added` | 투두리스트 | 할 일 추가 | todoId, todoText |
| `todo_deleted` | 투두리스트 | 할 일 삭제 | todoId, todoText |
| `todo_toggled` | 투두리스트 | 완료 상태 변경 | todoId, completed |
| `page_view` | 이벤트 페이지 | 페이지 진입 | page_title, page_path |
| `page_exit` | 이벤트 페이지 | 페이지 이탈 | page_title, duration_seconds |
| `button_click` | 이벤트 페이지 | 버튼 클릭 | button_name, total_clicks |
| `scroll_load_more` | 무한스크롤 | 추가 아이템 로드 | load_count, current_items |
| `reached_list_end` | 무한스크롤 | 리스트 끝 도달 | total_items |

---

## 페이지별 트래킹 상세

### 1. 투두리스트 페이지 (`/todos`)

**목적**: 사용자의 CRUD 액션을 트래킹하여 기능 사용 패턴 분석

#### 1.1 할 일 추가 (`todo_added`)

```typescript
trackTodoAdded(todoId, todoText);
```

**발생 시점**: 사용자가 입력란에 텍스트를 입력하고 "추가" 버튼 클릭

**파라미터**:
```typescript
{
  todoId: number;        // 투두 고유 ID
  todoText: string;      // 투두 내용
  timestamp: string;     // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 평균 할 일 개수
- 가장 많이 입력되는 할 일 유형 (텍스트 분석)
- 시간대별 할 일 추가 패턴

---

#### 1.2 할 일 삭제 (`todo_deleted`)

```typescript
trackTodoDeleted(todoId, todoText);
```

**발생 시점**: 사용자가 "삭제" 버튼 클릭

**파라미터**:
```typescript
{
  todoId: number;        // 삭제된 투두 ID
  todoText?: string;     // 삭제된 투두 내용 (선택)
  timestamp: string;     // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 삭제율 (추가 대비 삭제 비율)
- 완료되지 않고 삭제되는 비율

---

#### 1.3 완료 상태 변경 (`todo_toggled`)

```typescript
trackTodoToggled(todoId, completed);
```

**발생 시점**: 사용자가 체크박스 클릭하여 완료/미완료 상태 변경

**파라미터**:
```typescript
{
  todoId: number;        // 투두 ID
  completed: boolean;    // 변경 후 상태 (true: 완료, false: 미완료)
  timestamp: string;     // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 할 일 완료율
- 완료 취소 빈도 (사용자가 실수로 체크했는지)

---

### 2. 이벤트 페이지 (`/event`)

**목적**: 페이지 진입/이탈 및 버튼 클릭을 트래킹하여 사용자 참여도 분석

#### 2.1 페이지 진입 (`page_view`)

```typescript
trackPageView("이벤트 페이지", "/event");
```

**발생 시점**: 페이지 컴포넌트 마운트 시 (useEffect)

**파라미터**:
```typescript
{
  page_title: string;      // 페이지 제목
  page_location: string;   // 전체 URL (window.location.href)
  page_path: string;       // 페이지 경로 (/event)
  timestamp: string;       // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 페이지 방문 횟수
- 유입 경로 (직접/링크/북마크)

---

#### 2.2 페이지 이탈 (`page_exit`)

```typescript
trackEvent("page_exit", {
  page_title: "이벤트 페이지",
  duration_seconds: duration,
  timestamp: exitTime.toISOString(),
});
```

**발생 시점**: 페이지 언마운트 시 (useEffect cleanup)

**파라미터**:
```typescript
{
  page_title: string;        // 페이지 제목
  duration_seconds: number;  // 페이지 체류 시간 (초)
  timestamp: string;         // 이탈 시점 타임스탬프
}
```

**분석 가능한 인사이트**:
- 평균 체류 시간
- 이탈률 (짧은 체류 시간 = 높은 이탈률)

---

#### 2.3 버튼 클릭 (`button_click`)

```typescript
trackButtonClick(buttonName, {
  page: "/event",
  total_clicks: buttonClicks + 1,
});
```

**발생 시점**: 사용자가 4개의 버튼 중 하나를 클릭

**트래킹 대상 버튼**:
1. "주요 액션"
2. "보조 액션"
3. "정보 보기"
4. "설정 열기"

**파라미터**:
```typescript
{
  button_name: string;     // 버튼 이름
  page: string;            // 버튼이 있는 페이지
  total_clicks: number;    // 해당 세션의 총 클릭 수
  timestamp: string;       // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 가장 인기 있는 버튼
- 버튼 클릭률 (페이지 방문 대비)
- 사용자 참여도

---

### 3. 무한스크롤 페이지 (`/infinite-list`)

**목적**: 스크롤 행동과 컨텐츠 소비 패턴 분석

#### 3.1 추가 아이템 로드 (`scroll_load_more`)

```typescript
trackScrollLoadMore(items.length, loadCount + 1, scrollPercentage);
```

**발생 시점**: 사용자가 페이지 끝까지 스크롤하여 새 아이템 로드

**파라미터**:
```typescript
{
  current_items: number;      // 현재 로드된 아이템 수
  load_count: number;         // 로드 횟수 (1부터 시작)
  scroll_percentage: number;  // 현재 스크롤 위치 (%)
  timestamp: string;          // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 평균 로드 횟수 (사용자가 얼마나 깊이 탐색하는지)
- 로드 횟수 분포 (1회만, 3회 이상 등)
- 컨텐츠 참여도

**성능 최적화**:
- ✅ Throttle 적용 (200ms)
- ✅ IntersectionObserver 사용

---

#### 3.2 리스트 끝 도달 (`reached_list_end`)

```typescript
trackReachedListEnd(items.length + newItems.length);
```

**발생 시점**: 사용자가 50개 아이템을 모두 로드하여 끝에 도달

**파라미터**:
```typescript
{
  total_items: number;    // 전체 아이템 수 (50개)
  timestamp: string;      // ISO 8601 형식 타임스탬프
}
```

**분석 가능한 인사이트**:
- 끝까지 본 사용자 비율 (완독률)
- 높은 참여도 사용자 식별

---

## 공통 파라미터

모든 이벤트에 자동으로 추가되는 파라미터:

### `timestamp`
- **타입**: `string`
- **형식**: ISO 8601 (예: `2025-11-03T12:34:56.789Z`)
- **용도**: 이벤트 발생 시각 기록

### Firebase 자동 수집 파라미터
Firebase SDK가 자동으로 수집하는 데이터:
- 사용자 기기 정보 (OS, 브라우저, 화면 크기)
- 지역 정보 (국가, 도시)
- 첫 방문/재방문 구분
- 세션 ID

---

## 구현 방식

### 파일 구조

```
src/
├── lib/
│   ├── firebase.ts          # Firebase 초기화
│   └── analytics.ts         # 트래킹 함수 모음
└── app/
    ├── todos/
    │   └── page.tsx         # 투두리스트 + 트래킹
    ├── event/
    │   └── page.tsx         # 이벤트 페이지 + 트래킹
    └── infinite-list/
        └── page.tsx         # 무한스크롤 + 트래킹
```

### 핵심 함수

#### `trackEvent` (기본 함수)

```typescript
export const trackEvent = (
  eventName: AnalyticsEventName,
  eventParams?: AnalyticsEventParams
) => {
  if (!analytics) {
    console.log(`🔥 Analytics Event (not initialized): ${eventName}`, eventParams);
    return;
  }

  try {
    logEvent(analytics, eventName, eventParams);
    
    if (process.env.NODE_ENV === "development") {
      console.log(`🔥 Analytics Event: ${eventName}`, eventParams);
    }
  } catch (error) {
    console.error("Analytics 이벤트 로깅 실패:", error);
  }
};
```

**특징**:
- Analytics 미초기화 시 안전하게 처리
- 개발 환경에서 콘솔 로그 자동 출력
- 에러 핸들링 포함

---

### 헬퍼 함수

각 이벤트별로 타입 안전한 헬퍼 함수 제공:

```typescript
// 페이지뷰
trackPageView(pageTitle: string, pagePath: string)

// 버튼 클릭
trackButtonClick(buttonName: string, additionalParams?: AnalyticsEventParams)

// 투두리스트
trackTodoAdded(todoId: number, todoText: string)
trackTodoDeleted(todoId: number, todoText?: string)
trackTodoToggled(todoId: number, completed: boolean)

// 무한스크롤
trackScrollLoadMore(currentItems: number, loadCount: number, scrollPercentage: number)
trackReachedListEnd(totalItems: number)
```

**장점**:
- TypeScript 타입 체크
- 필수 파라미터 강제
- 일관된 타임스탬프 자동 추가

---

### 성능 최적화

#### 스크롤 이벤트 Throttle

```typescript
const THROTTLE_MS = 200; // 200ms마다 최대 1번 실행

const handleScroll = () => {
  const now = Date.now();
  
  if (now - lastScrollTimeRef.current < THROTTLE_MS) {
    return; // 무시
  }
  
  lastScrollTimeRef.current = now;
  // 실제 로직 실행
};
```

**효과**: 스크롤 이벤트 처리 95% 감소 (초당 100-200번 → 5번)

---

## Firebase Console에서 확인하기

### 1. 실시간 보고서 (테스트용)

**경로**: Firebase Console → Analytics → 실시간

**확인 가능한 정보**:
- 현재 활성 사용자 수
- 실시간 이벤트 스트림
- 최근 30분 데이터

**사용 시나리오**: 개발 중 이벤트가 제대로 전송되는지 즉시 확인

---

### 2. DebugView (개발 전용)

**경로**: Firebase Console → Analytics → DebugView

**활성화 방법**:
```bash
# Chrome 브라우저 콘솔에서
sessionStorage.setItem('debug_mode', 'true');
```

**확인 가능한 정보**:
- 모든 이벤트 상세 정보
- 파라미터 값
- 타임스탬프

**사용 시나리오**: 로컬 개발 중 상세 디버깅

---

### 3. 대시보드 (프로덕션)

**경로**: Firebase Console → Analytics → 대시보드

**처리 시간**: 24-48시간 (데이터 처리 및 집계)

**확인 가능한 정보**:
- 사용자 참여도
- 이벤트 발생 횟수
- 사용자 경로
- 코호트 분석

---

## 데이터 분석 예시

### 투두리스트 사용 패턴

```
질문: 사용자들이 평균 몇 개의 할 일을 추가하나?

분석 방법:
1. Firebase Console → Events → todo_added
2. 사용자당 평균 카운트 확인
3. 시간대별 분포 확인

예상 인사이트:
- 평균 3-5개 추가
- 오전 시간대에 추가 집중
- 완료율 70%
```

---

### 버튼 클릭 선호도

```
질문: 어떤 버튼이 가장 많이 클릭되나?

분석 방법:
1. Firebase Console → Events → button_click
2. Parameter → button_name 필터링
3. 각 버튼별 클릭 수 비교

예상 인사이트:
- "주요 액션" 버튼: 60%
- "보조 액션" 버튼: 25%
- "정보 보기": 10%
- "설정 열기": 5%

→ CTA 배치 최적화에 활용
```

---

### 무한스크롤 완독률

```
질문: 사용자들이 끝까지 스크롤하나?

분석 방법:
1. scroll_load_more 이벤트 집계
2. reached_list_end 이벤트와 비교

예상 인사이트:
- 첫 로드 참여: 100%
- 1회 추가 로드: 60%
- 2회 추가 로드: 30%
- 끝까지 도달: 15%

→ 컨텐츠 양과 배치 전략 수립
```

---

## 환경 변수

`.env.local` 파일에 Firebase 설정 필요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**주의**: Vercel 배포 시 Dashboard에서도 환경 변수 설정 필요

---

## 트러블슈팅

### 이벤트가 Firebase에 안 보일 때

**체크리스트**:
1. ✅ 환경 변수 설정 확인 (.env.local)
2. ✅ Firebase Console에서 Analytics 활성화 확인
3. ✅ 브라우저 광고 차단기 비활성화
4. ✅ 개발 서버 재시작 (npm run dev)
5. ✅ 브라우저 캐시 클리어 (Cmd+Shift+R)

---

### 콘솔 로그가 안 보일 때

**원인**:
- `process.env.NODE_ENV !== "development"`

**해결**:
```typescript
// analytics.ts에서 강제 로그 출력
console.log(`🔥 Analytics Event: ${eventName}`, eventParams);
```

---

### Network 탭에 collect 요청이 안 보일 때

**원인**:
- Analytics 초기화 실패
- 브라우저 확장 프로그램 차단

**확인 방법**:
```javascript
// 브라우저 콘솔에서
console.log(window);
// Firebase 관련 객체가 있는지 확인
```

---

## 참고 자료

### Firebase 공식 문서
- [Firebase Analytics 개요](https://firebase.google.com/docs/analytics)
- [웹에서 이벤트 로깅](https://firebase.google.com/docs/analytics/events)
- [권장 이벤트](https://firebase.google.com/docs/analytics/events?platform=web)

### 프로젝트 내부 문서
- [Firebase 설정 가이드](./firebase-analytics-setup.md)

---

## 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-11-03 | 초기 문서 작성, 7개 이벤트 트래킹 |
| 1.1.0 | 2025-11-03 | Throttle 성능 최적화, scroll_depth 제거 |

---

**문서 작성**: 2025년 11월 3일  
**마지막 업데이트**: 2025년 11월 3일

