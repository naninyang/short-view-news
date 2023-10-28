import React, { useState } from 'react';
import Seo from '@/components/Seo';
import PageName from '@/components/PageName';
import PeriodtOmt from './omt';
import PeriodtTimeline from './timeline';
import tabs from '@/styles/tabs.module.sass';
import styles from '@/styles/periodts.module.sass';

function Periodt() {
  const [activeArea, setActiveArea] = useState<number | null>(null);
  const timestamp = Date.now();
  return (
    <main className={styles.periodts}>
      <Seo
        pageTitle="트위터 인용/멘션 및 타임라인"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <PageName pageName="트위터 인용/멘션 및 타임라인" />
      <div className={styles.list}>
        <nav className={tabs.nav}>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => setActiveArea(1)}
                className={`${activeArea === null || activeArea === 1 ? tabs.active : ''}`}
              >
                <span>인용/멘션</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveArea(2)}
                className={`${activeArea === 2 ? tabs.active : ''}`}
              >
                <span>타임라인</span>
              </button>
            </li>
          </ul>
        </nav>
        {(activeArea === null || activeArea === 1) && <PeriodtOmt />}
        {activeArea === 2 && <PeriodtTimeline />}
      </div>
    </main>
  );
}

export default Periodt;
