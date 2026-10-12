import { Link } from 'react-router-dom';
import { units, getLessonsForUnit, allLessons } from '../data';
import { loadProgress } from '../utils/progress';

export function JourneyPage() {
  const progress = loadProgress();
  const total = allLessons.length;
  const done = progress.completedLessons.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const quizEntries = Object.entries(progress.quizScores);
  const avg =
    quizEntries.length > 0
      ? Math.round(quizEntries.reduce((a, [, v]) => a + v, 0) / quizEntries.length)
      : 0;

  const nextLesson = allLessons.find(
    (l) => !progress.completedLessons.includes(l.id)
  );

  return (
    <div className="container">
      <div className="lesson-header" style={{ borderTopColor: 'var(--c-primary-700)' }}>
        <nav className="crumbs" aria-label="مسار التنقل">
          <Link to="/">الرئيسية</Link>
          <span className="sep">/</span>
          <span>رحلتي</span>
        </nav>
        <h2>🗺️ خريطة رحلتي التعليمية</h2>
        <p className="summary">
          تابع تقدّمك عبر الوحدات الأربع. تُحفظ النتائج في متصفحك فقط.
        </p>

        <div className="progress-ring-wrap">
          <div
            className="ring"
            style={{ ['--p' as string]: String(pct) }}
            data-label={`${pct}%`}
            role="img"
            aria-label={`نسبة الإنجاز ${pct}%`}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>
              {done} من {total} درسًا
            </div>
            <div className="text-muted text-sm">
              {nextLesson ? (
                <>
                  الدرس التالي:{' '}
                  <Link to={`/lesson/${nextLesson.id}`} style={{ fontWeight: 700 }}>
                    {nextLesson.title}
                  </Link>
                </>
              ) : (
                '🎉 أكملت جميع الدروس — أحسنت!'
              )}
            </div>
            {quizEntries.length > 0 && (
              <div className="text-muted text-sm">
                متوسط الاختبارات: <strong>{avg}%</strong> ({quizEntries.length} اختبار)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-row">
        {units.map((u) => {
          const lessons = getLessonsForUnit(u.id);
          const uDone = lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          return (
            <div className="stat-tile" key={u.id}>
              <div className="num" style={{ color: u.color }}>
                {uDone}/{lessons.length}
              </div>
              <div className="lbl">وحدة {u.number}</div>
            </div>
          );
        })}
      </div>

      {units.map((u) => {
        const lessons = getLessonsForUnit(u.id);
        return (
          <section key={u.id} className="journey-unit">
            <h3>
              <span className="journey-dot" style={{ background: u.color }} />
              و{u.number}. {u.title}
              <span className="chip" style={{ marginRight: 'auto' }}>
                {u.subtitle}
              </span>
            </h3>
            <div className="journey-steps">
              {lessons.map((l, i) => {
                const ok = progress.completedLessons.includes(l.id);
                const qScore = progress.quizScores[l.id];
                const isNext = nextLesson?.id === l.id;
                let cls = 'journey-step';
                if (ok) cls += ' done';
                else if (isNext) cls += ' current';
                return (
                  <Link key={l.id} to={`/lesson/${l.id}`} className={cls}>
                    <span className="step-num">
                      الدرس {i + 1}
                      {ok ? ' ✓' : isNext ? ' ← التالي' : ''}
                    </span>
                    {l.title}
                    {qScore !== undefined && (
                      <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 700 }}>
                        اختبار: {qScore}%
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {quizEntries.length > 0 && (
        <section className="section">
          <h3><span className="sec-num">؟</span> سجل الاختبارات</h3>
          <table className="map-table">
            <thead>
              <tr>
                <th>الدرس</th>
                <th>النتيجة</th>
                <th>التقدير</th>
              </tr>
            </thead>
            <tbody>
              {quizEntries.map(([id, score]) => {
                const lesson = allLessons.find((l) => l.id === id);
                return (
                  <tr key={id}>
                    <td>{lesson?.title ?? id}</td>
                    <td>{score}%</td>
                    <td>
                      {score >= 90
                        ? 'ممتاز'
                        : score >= 80
                        ? 'جيد جدًا'
                        : score >= 70
                        ? 'جيد'
                        : score >= 60
                        ? 'مقبول'
                        : 'يحتاج مراجعة'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
