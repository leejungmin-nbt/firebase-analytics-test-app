# Firebase Analytics 연동 작업 체크리스트

> 프로젝트: firebase-analytics-test-app  
> 도메인: https://firebase-analytics-test-app.vercel.app  
> 작성일: 2025-11-03

---

## 📋 Phase 1: Firebase 프로젝트 설정 (Firebase Console)

### 1.1 Firebase 프로젝트 생성

- [ ] Firebase Console 접속: https://console.firebase.google.com
- [ ] "프로젝트 추가" 클릭
- [ ] 프로젝트 이름 입력 (예: `firebase-analytics-test`)
- [ ] Google Analytics 사용 설정 (권장)
- [ ] 프로젝트 생성 완료

### 1.2 웹 앱 추가

- [ ] 프로젝트 설정 → "앱 추가" → 웹(</>) 선택
- [ ] 앱 닉네임 입력 (예: `Firebase Analytics Test App`)
- [ ] "Firebase Hosting 설정" 체크 해제 (Vercel 사용 중)
- [ ] "앱 등록" 클릭
- [ ] Firebase SDK 설정 정보 복사 (나중에 사용)

**설정 정보 예시:**

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc...",
  measurementId: "G-XXXXXXXXXX",
};
```

### 1.3 Analytics 활성화 확인

- [ ] 좌측 메뉴 → Analytics → 대시보드 확인
- [ ] Analytics가 자동으로 활성화되었는지 확인

---

## 💻 Phase 2: 로컬 프로젝트 설정

### 2.1 Firebase 패키지 설치

```bash
npm install firebase
```

### 2.2 환경 변수 설정

**파일 생성:** `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2.3 Firebase 초기화 파일 생성

**파일 생성:** `src/lib/firebase.ts`

- [ ] Firebase 초기화 코드 작성
- [ ] Analytics 인스턴스 export
- [ ] 클라이언트 사이드에서만 실행되도록 설정

### 2.4 Analytics 유틸리티 함수 생성

**파일 생성:** `src/lib/analytics.ts`

- [ ] 이벤트 로깅 함수들 작성 (logEvent wrapper)
- [ ] 타입 안전성을 위한 이벤트 타입 정의
- [ ] 공통 이벤트 파라미터 처리

---

## 🎨 Phase 3: 각 페이지에 Analytics 적용

### 3.1 투두리스트 페이지 (`/todos`) - 먼저 테스트용

**파일:** `src/app/todos/page.tsx`

- [ ] analytics 유틸리티 import
- [ ] `console.log` → `logEvent`로 변경
- [ ] `todo_added` 이벤트 연동
  - 파라미터: `todoId`, `todoText`
- [ ] `todo_deleted` 이벤트 연동
  - 파라미터: `todoId`, `todoText`
- [ ] `todo_toggled` 이벤트 연동
  - 파라미터: `todoId`, `completed`

### 3.2 이벤트 페이지 (`/event`)

**파일:** `src/app/event/page.tsx`

- [ ] `console.log` → `logEvent`로 변경
- [ ] `page_view` 이벤트 연동
  - 파라미터: `page_title`, `page_location`, `page_path`
- [ ] `button_click` 이벤트 연동
  - 파라미터: `button_name`, `page`, `total_clicks`
- [ ] 페이지 체류 시간 측정
  - useEffect cleanup에서 duration 전송

### 3.3 무한스크롤 페이지 (`/infinite-list`)

**파일:** `src/app/infinite-list/page.tsx`

- [ ] `console.log` → `logEvent`로 변경
- [ ] `scroll_depth` 이벤트 연동 (25%, 50%, 75%, 100%)
  - 파라미터: `depth_percentage`, `current_items`
  - 중복 전송 방지 로직 추가
- [ ] `scroll_load_more` 이벤트 연동
  - 파라미터: `current_items`, `load_count`, `scroll_percentage`
- [ ] `reached_list_end` 이벤트 연동
  - 파라미터: `total_items`

---

## 🧪 Phase 4: 로컬 테스트

### 4.1 개발 환경에서 테스트

```bash
npm run dev
```

- [ ] 투두리스트 페이지 접속
- [ ] 할 일 추가/삭제 테스트
- [ ] 브라우저 개발자 도구 열기 (F12)
- [ ] Network 탭에서 Firebase 요청 확인
  - 필터: `google-analytics.com/g/collect` 검색
  - Status 204 응답 확인
- [ ] Console 탭에서 에러 없는지 확인

### 4.2 Firebase DebugView 활성화

**Chrome에서:**

```
http://localhost:3000?debug_mode=true
```

**Firebase Console:**

- [ ] Analytics → DebugView 메뉴 선택
- [ ] 실시간 이벤트 스트림 확인
- [ ] 이벤트 이름과 파라미터 검증
- [ ] 각 페이지별 이벤트 발생 확인

### 4.3 전체 페이지 테스트

- [ ] `/` - 홈 페이지 접속
- [ ] `/todos` - 투두 추가/삭제/토글 테스트
- [ ] `/event` - 버튼 클릭 테스트
- [ ] `/infinite-list` - 스크롤 및 무한 로딩 테스트
- [ ] 모든 이벤트가 DebugView에 표시되는지 확인

---

## 🚀 Phase 5: Vercel 배포 및 프로덕션 테스트

### 5.1 Vercel 환경 변수 설정

**Vercel Dashboard:**

1. [ ] 프로젝트 선택
2. [ ] Settings → Environment Variables 선택
3. [ ] 다음 환경 변수들 추가:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

4. [ ] 각 변수마다 Environment 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 5.2 GitHub에 코드 푸시

```bash
git status
git add .
git commit -m "feat: Firebase Analytics 연동 완료"
git push origin main
```

### 5.3 Vercel 자동 배포 확인

- [ ] Vercel Dashboard → Deployments 확인
- [ ] Building... → Ready 상태 확인
- [ ] 배포 로그에서 에러 없는지 확인
- [ ] Visit 버튼으로 프로덕션 사이트 접속

### 5.4 프로덕션 환경 테스트

**URL:** https://firebase-analytics-test-app.vercel.app

- [ ] 각 페이지 정상 작동 확인
- [ ] 이벤트 발생 테스트
- [ ] Network 탭에서 Firebase 요청 확인
- [ ] Firebase Console → Analytics → 실시간 보고서 확인

### 5.5 Firebase Console 데이터 확인

**즉시 확인 가능:**

- [ ] Analytics → 실시간
  - 실시간 사용자 수
  - 실시간 이벤트 스트림

**24시간 후 확인:**

- [ ] Analytics → 이벤트
  - 커스텀 이벤트 목록
  - 이벤트별 발생 횟수
- [ ] Analytics → 참여도
  - 페이지 및 화면
  - 이벤트별 통계

---

## 📊 Phase 6: 고급 설정 (선택사항)

### 6.1 승인된 도메인 추가

**Firebase Console → 프로젝트 설정 → 승인된 도메인**

- [ ] `firebase-analytics-test-app.vercel.app` 추가
- [ ] `*.vercel.app` 추가 (Preview 배포용)
- [ ] `localhost` 확인 (기본 포함됨)

### 6.2 Conversion 이벤트 설정

**Firebase Console → Analytics → 이벤트**

- [ ] 주요 이벤트를 Conversion으로 표시
  - `todo_added`
  - `button_click` (primary_action)
  - `reached_list_end`

### 6.3 커스텀 정의 생성

**Firebase Console → Analytics → 커스텀 정의**

- [ ] 커스텀 측정기준 (Custom Dimensions) 추가
  - `button_type`
  - `scroll_depth_milestone`
- [ ] 커스텀 측정항목 (Custom Metrics) 추가
  - `todo_count`
  - `load_count`

### 6.4 Google Analytics 4 연동 확인

- [ ] GA4 속성 확인
- [ ] 커스텀 리포트 생성
- [ ] 탐색 분석 설정
- [ ] 퍼널 분석 구성

---

## 🎯 작업 우선순위

### 🔴 필수 (오늘 완료)

1. Phase 1: Firebase 프로젝트 설정
2. Phase 2: 로컬 프로젝트 설정
3. Phase 3.1: 투두리스트 1개 페이지 연동
4. Phase 4: 로컬 테스트

### 🟡 중요 (내일 완료)

5. Phase 3.2-3.3: 나머지 페이지 연동
6. Phase 5: Vercel 배포 및 프로덕션 테스트

### 🟢 선택 (여유 있을 때)

7. Phase 6: 고급 설정

---

## 📝 참고 자료

### 공식 문서

- [Firebase Analytics 시작하기](https://firebase.google.com/docs/analytics/get-started?platform=web)
- [Firebase + Next.js](https://firebase.google.com/docs/web/setup)
- [Analytics 이벤트](https://firebase.google.com/docs/analytics/events)

### 트러블슈팅

- DebugView에 이벤트가 안 보이면: `?debug_mode=true` 파라미터 확인
- 환경 변수 적용 안 되면: Vercel에서 재배포 또는 `vercel env pull` 실행
- CORS 에러 발생 시: Firebase Console에서 승인된 도메인 확인

---

## ✅ 완료 체크

- [ ] Phase 1 완료
- [ ] Phase 2 완료
- [ ] Phase 3 완료
- [ ] Phase 4 완료
- [ ] Phase 5 완료
- [ ] Phase 6 완료 (선택)

---

**최종 업데이트:** 2025-11-03  
**작성자:** AI Assistant  
**프로젝트:** Firebase Analytics Test App
