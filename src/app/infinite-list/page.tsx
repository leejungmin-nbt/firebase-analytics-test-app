"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { trackScrollLoadMore, trackReachedListEnd } from "@/lib/analytics";

interface ListItem {
  id: number;
  title: string;
  description: string;
  color: string;
}

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#43e97b",
  "#fa709a",
];

const generateItems = (startId: number, count: number): ListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `아이템 #${startId + i}`,
    description: `이것은 ${
      startId + i
    }번째 아이템입니다. 스크롤하여 더 많은 아이템을 로드하세요.`,
    color: COLORS[(startId + i) % COLORS.length],
  }));
};

export default function InfiniteListPage() {
  const [items, setItems] = useState<ListItem[]>(() => generateItems(1, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef<number>(0);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    // Firebase Analytics 스크롤 이벤트 전송
    trackScrollLoadMore(items.length, loadCount + 1, scrollPercentage);

    // 실제로는 API 호출, 여기서는 시뮬레이션
    setTimeout(() => {
      const newItems = generateItems(items.length + 1, 10);
      setItems((prev) => [...prev, ...newItems]);
      setLoadCount((prev) => prev + 1);
      setLoading(false);

      // 50개 이상이면 더 이상 로드하지 않음
      if (items.length + newItems.length >= 50) {
        setHasMore(false);
        // Firebase Analytics 리스트 끝 도달 이벤트 전송
        trackReachedListEnd(items.length + newItems.length);
      }
    }, 1000);
  }, [loading, hasMore, items.length, loadCount, scrollPercentage]);

  useEffect(() => {
    const THROTTLE_MS = 200; // 200ms마다 최대 1번 실행

    const handleScroll = () => {
      const now = Date.now();

      // Throttle: 마지막 실행으로부터 200ms가 지나지 않았으면 무시
      if (now - lastScrollTimeRef.current < THROTTLE_MS) {
        return;
      }

      lastScrollTimeRef.current = now;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;

      // 스크롤 퍼센트 업데이트 (UI 표시용)
      setScrollPercentage(Math.round(scrolled));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items.length]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← 홈으로
          </Link>
          <h1 className={styles.title}>스크롤 리스트</h1>
          <p className={styles.subtitle}>스크롤 이벤트를 트래킹합니다</p>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>로드된 아이템:</span>
            <span className={styles.statValue}>{items.length}개</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>로드 횟수:</span>
            <span className={styles.statValue}>{loadCount}회</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>스크롤:</span>
            <span className={styles.statValue}>{scrollPercentage}%</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div
          className={styles.scrollProgress}
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.itemList}>
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.item}
              style={{ borderLeftColor: item.color }}
            >
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDescription}>{item.description}</p>
              <div className={styles.itemMeta}>
                <span className={styles.itemId}>ID: {item.id}</span>
                <div
                  className={styles.itemColor}
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>로딩 중...</p>
            </div>
          )}
          {!hasMore && (
            <div className={styles.endMessage}>
              <p>🎉 모든 아이템을 로드했습니다!</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoBox}>
        <h3>트래킹되는 이벤트</h3>
        <ul>
          <li>추가 아이템 로드 (scroll_load_more) - 로드 횟수 집계</li>
          <li>리스트 끝 도달 (reached_list_end) - 전체 완독 여부</li>
        </ul>
        <p className={styles.note}>
          💡 Firebase Analytics가 연동되어 실시간으로 데이터가 전송됩니다. 개발
          환경에서는 콘솔에도 로그가 출력됩니다.
        </p>
      </div>
    </div>
  );
}
