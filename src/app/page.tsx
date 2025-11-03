import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>테스트 페이지</h1>
        <p className={styles.description}>
          이벤트 트래킹을 테스트하기 위한 페이지
        </p>

        <nav className={styles.nav}>
          <Link href="/todos" className={styles.navItem}>
            <div className={styles.navCard}>
              <h2>투두리스트</h2>
              <p>추가/삭제 이벤트 트래킹</p>
            </div>
          </Link>

          <Link href="/event" className={styles.navItem}>
            <div className={styles.navCard}>
              <h2>이벤트 페이지</h2>
              <p>페이지 진입 트래킹</p>
            </div>
          </Link>

          <Link href="/infinite-list" className={styles.navItem}>
            <div className={styles.navCard}>
              <h2>스크롤 리스트</h2>
              <p>스크롤 이벤트 트래킹</p>
            </div>
          </Link>
        </nav>
      </main>
    </div>
  );
}
