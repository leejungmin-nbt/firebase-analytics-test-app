"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function EventPage() {
  const [pageViewTime] = useState<Date>(() => new Date());
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [buttonClicks, setButtonClicks] = useState(0);
  const entryTimeRef = useRef<Date>(new Date());

  useEffect(() => {
    const entryTime = entryTimeRef.current;

    // 여기에 Firebase Analytics 페이지뷰 이벤트 추가 예정
    console.log("🔥 Analytics Event: page_view", {
      page_title: "이벤트 페이지",
      page_location: window.location.href,
      page_path: "/event",
      timestamp: entryTime.toISOString(),
    });

    // 페이지에 머문 시간 측정
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);

      // 페이지를 떠날 때 이벤트
      const exitTime = new Date();
      const duration = Math.floor(
        (exitTime.getTime() - entryTime.getTime()) / 1000
      );
      console.log("🔥 Analytics Event: page_exit", {
        page_title: "이벤트 페이지",
        duration_seconds: duration,
        timestamp: exitTime.toISOString(),
      });
    };
  }, []);

  const handleButtonClick = (buttonName: string) => {
    setButtonClicks((prev) => prev + 1);

    // 여기에 Firebase Analytics 버튼 클릭 이벤트 추가 예정
    console.log("🔥 Analytics Event: button_click", {
      button_name: buttonName,
      page: "/event",
      total_clicks: buttonClicks + 1,
      timestamp: new Date().toISOString(),
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← 홈으로
        </Link>
        <h1 className={styles.title}>이벤트 페이지</h1>
        <p className={styles.subtitle}>페이지 진입과 사용자 행동을 트래킹</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>페이지 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>진입 시간</div>
              <div className={styles.infoValue}>
                {pageViewTime ? pageViewTime.toLocaleTimeString("ko-KR") : "-"}
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>머문 시간</div>
              <div className={styles.infoValue}>{formatTime(timeOnPage)}</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>버튼 클릭</div>
              <div className={styles.infoValue}>{buttonClicks}회</div>
            </div>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>테스트 액션</h2>
          <p className={styles.actionDescription}>
            아래 버튼들을 클릭하여 이벤트를 발생
          </p>

          <div className={styles.buttonGrid}>
            <button
              onClick={() => handleButtonClick("primary_action")}
              className={`${styles.actionButton} ${styles.primary}`}
            >
              주요 액션
            </button>
            <button
              onClick={() => handleButtonClick("secondary_action")}
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              보조 액션
            </button>
            <button
              onClick={() => handleButtonClick("info_action")}
              className={`${styles.actionButton} ${styles.info}`}
            >
              정보 보기
            </button>
            <button
              onClick={() => handleButtonClick("share_action")}
              className={`${styles.actionButton} ${styles.success}`}
            >
              공유하기
            </button>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h2 className={styles.sectionTitle}>트래킹되는 이벤트</h2>
          <ul className={styles.eventList}>
            <li>페이지 진입 (page_view)</li>
            <li>페이지 이탈 (page_exit)</li>
            <li>버튼 클릭 (button_click)</li>
            <li>페이지 체류 시간 측정</li>
          </ul>
          <p className={styles.note}>
            💡 현재는 콘솔에 로그가 출력됩니다. Firebase Analytics 연동 후 실제
            데이터가 전송됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
