import { Link } from 'react-router-dom';
import { units, getLessonsForUnit } from '../data';
import { loadProgress } from '../utils/progress';

export function UnitsPage() {
  const progress = loadProgress();
  return (
    <div className="container">
      <div className="lesson-header" style={{ borderTopColor: 'var(--c-primary-700)' }}>
        <nav className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span className="sep">/</span>
          <span>الوحدات</span>
        </nav>
        <h2>الوحدات الدراسية</h2>
        <p className="summary">
          أربع وحدات وفق الكتاب الفلسطيني: علم البيانات، البرمجة بلغة بايثون،
          المواطنة والأمان الرقمي، والروبوت ونظم التحكم.
        </p>
      </div>

      {units.map((u) => {
        const lessons = getLessonsForUnit(u.id);
        const uDone = lessons.filter((l) =>
          progress.completedLessons.includes(l.id)
        ).length;
        return (
          <section key={u.id} className="section" style={{ borderTop: `4px solid ${u.color}` }}>
            <h3 style={{ color: u.color, borderBottomColor: u.color }}>
              و{u.number}. {u.title} — {u.subtitle}
            </h3>
            <p style={{ marginBottom: '0.6rem' }}>{u.summary}</p>
            <div className="flex mb">
              <span className="chip">📖 صفحات {u.bookPages[0]}–{u.bookPages[1]}</span>
              <span className="chip">{lessons.length} دروس</span>
              <span className="chip">✅ مكتمل {uDone}/{lessons.length}</span>
            </div>
            <p className="text-sm text-muted mb">
              مصطلحات: {u.keywords.join('، ')}
            </p>

            <div className="grid grid-2">
              {lessons.map((l) => {
                const ok = progress.completedLessons.includes(l.id);
                return (
                  <Link
                    key={l.id}
                    to={`/lesson/${l.id}`}
                    className="card"
                    style={{ animation: 'none', textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3>
                      {ok ? '✅ ' : '📘 '}
                      الدرس {l.number}: {l.title}
                    </h3>
                    <p>{l.summary}</p>
                    <div className="meta">
                      <span className="chip">صفحة {l.bookPage}</span>
                      <span className="chip">{l.bookQuestions.length} سؤال</span>
                      {progress.quizScores[l.id] !== undefined && (
                        <span className="chip">اختبار {progress.quizScores[l.id]}%</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function UnitDetailPage({ unitId }: { unitId: string }) {
  const unit = units.find((u) => u.id === unitId);
  const progress = loadProgress();

  if (!unit)
    return (
      <div className="container mt">
        <div className="section text-center">
          <h3>الوحدة غير موجودة</h3>
          <Link className="btn mt" to="/units">عرض جميع الوحدات</Link>
        </div>
      </div>
    );

  const lessons = getLessonsForUnit(unit.id);
  const uDone = lessons.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const uPct = lessons.length ? Math.round((uDone / lessons.length) * 100) : 0;

  return (
    <div className="container">
      <div className="lesson-header" style={{ borderTopColor: unit.color }}>
        <nav className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span className="sep">/</span>
          <Link to="/units">الوحدات</Link>
          <span className="sep">/</span>
          <span>الوحدة {unit.number}</span>
        </nav>
        <h2>
          و{unit.number}. {unit.title}
        </h2>
        <p className="summary">{unit.summary}</p>
        <div className="lesson-meta">
          <span className="chip">📖 ص {unit.bookPages[0]}–{unit.bookPages[1]}</span>
          <span className="chip">{lessons.length} دروس</span>
          <span className="chip">✅ {uDone}/{lessons.length}</span>
        </div>
        <div className="progress-wrap">
          <div className="progress-bar">
            <span style={{ width: `${uPct}%`, background: unit.color }} />
          </div>
          <div className="progress-label">{uPct}% مكتمل</div>
        </div>
      </div>

      {unit.intro && unit.intro.length > 0 && (
        <section className="section" style={{ borderTop: `4px solid ${unit.color}` }}>
          <h3><span className="sec-num">i</span> لماذا هذه الوحدة؟</h3>
          {unit.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="flex mt">
            {unit.keywords.map((k) => (
              <span key={k} className="chip">{k}</span>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-2">
        {lessons.map((l) => {
          const ok = progress.completedLessons.includes(l.id);
          return (
            <Link
              key={l.id}
              to={`/lesson/${l.id}`}
              className="card"
              style={{ animation: 'none', textDecoration: 'none', color: 'inherit' }}
            >
              <h3>
                {ok ? '✅ ' : '📘 '}
                الدرس {l.number}: {l.title}
              </h3>
              <p>{l.summary}</p>
              <div className="meta">
                <span className="chip">صفحة {l.bookPage}</span>
                <span className="chip">{l.bookQuestions.length} سؤال كتاب</span>
                <span className="chip">{l.quiz.length} اختبار</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
