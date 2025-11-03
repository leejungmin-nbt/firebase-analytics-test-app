import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

// 커스텀 이벤트 타입 정의
export type AnalyticsEventName =
  // 투두리스트 이벤트
  | "todo_added"
  | "todo_deleted"
  | "todo_toggled"
  // 이벤트 페이지
  | "page_view"
  | "page_exit"
  | "button_click"
  // 무한스크롤 이벤트
  | "scroll_load_more"
  | "reached_list_end"
  // 기타 Firebase 권장 이벤트나 커스텀 이벤트
  | string;

// 이벤트 파라미터 타입 정의
export interface AnalyticsEventParams {
  // 공통 파라미터
  page_title?: string;
  page_location?: string;
  page_path?: string;
  timestamp?: string;

  // 투두리스트 파라미터
  todoId?: number;
  todoText?: string;
  completed?: boolean;

  // 버튼 클릭 파라미터
  button_name?: string;
  page?: string;
  total_clicks?: number;

  // 스크롤 파라미터
  current_items?: number;
  load_count?: number;
  scroll_percentage?: number;
  total_items?: number;

  // 페이지 체류 시간
  duration_seconds?: number;

  // 추가 커스텀 파라미터
  [key: string]: string | number | boolean | undefined;
}

/**
 * Analytics 이벤트 트래킹 함수
 * @param eventName - 이벤트 이름
 * @param eventParams - 이벤트 파라미터
 */
export const trackEvent = (
  eventName: AnalyticsEventName,
  eventParams?: AnalyticsEventParams
) => {
  // Analytics가 초기화되지 않았으면 로그만 출력
  if (!analytics) {
    console.log(
      `🔥 Analytics Event (not initialized): ${eventName}`,
      eventParams
    );
    return;
  }

  try {
    // Firebase Analytics에 이벤트 전송
    logEvent(analytics, eventName, eventParams);

    // 개발 환경에서는 콘솔에도 출력
    if (process.env.NODE_ENV === "development") {
      console.log(`🔥 Analytics Event: ${eventName}`, eventParams);
    }
  } catch (error) {
    console.error("Analytics 이벤트 로깅 실패:", error);
  }
};

/**
 * 페이지뷰 이벤트 트래킹
 * @param pageTitle - 페이지 제목
 * @param pagePath - 페이지 경로
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  trackEvent("page_view", {
    page_title: pageTitle,
    page_location: typeof window !== "undefined" ? window.location.href : "",
    page_path: pagePath,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 버튼 클릭 이벤트 트래킹
 * @param buttonName - 버튼 이름
 * @param additionalParams - 추가 파라미터
 */
export const trackButtonClick = (
  buttonName: string,
  additionalParams?: AnalyticsEventParams
) => {
  trackEvent("button_click", {
    button_name: buttonName,
    timestamp: new Date().toISOString(),
    ...additionalParams,
  });
};

/**
 * 투두 추가 이벤트 트래킹
 * @param todoId - 투두 ID
 * @param todoText - 투두 내용
 */
export const trackTodoAdded = (todoId: number, todoText: string) => {
  trackEvent("todo_added", {
    todoId,
    todoText,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 투두 삭제 이벤트 트래킹
 * @param todoId - 투두 ID
 * @param todoText - 투두 내용
 */
export const trackTodoDeleted = (todoId: number, todoText?: string) => {
  trackEvent("todo_deleted", {
    todoId,
    todoText,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 투두 토글 이벤트 트래킹
 * @param todoId - 투두 ID
 * @param completed - 완료 상태
 */
export const trackTodoToggled = (todoId: number, completed: boolean) => {
  trackEvent("todo_toggled", {
    todoId,
    completed,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 더 많은 아이템 로드 이벤트 트래킹
 * @param currentItems - 현재 아이템 수
 * @param loadCount - 로드 횟수
 * @param scrollPercentage - 스크롤 위치 (%)
 */
export const trackScrollLoadMore = (
  currentItems: number,
  loadCount: number,
  scrollPercentage: number
) => {
  trackEvent("scroll_load_more", {
    current_items: currentItems,
    load_count: loadCount,
    scroll_percentage: scrollPercentage,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 리스트 끝 도달 이벤트 트래킹
 * @param totalItems - 전체 아이템 수
 */
export const trackReachedListEnd = (totalItems: number) => {
  trackEvent("reached_list_end", {
    total_items: totalItems,
    timestamp: new Date().toISOString(),
  });
};
