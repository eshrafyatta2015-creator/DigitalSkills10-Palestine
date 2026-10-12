import { Link } from 'react-router-dom';
import { units, getLessonsForUnit, allLessons } from '../data';
import { loadProgress } from '../utils/progress';

export function HomePage() {
  const progress = loadProgress();
  const total = allLessons.length;
  const done = progress.completedLessons.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const quizzes = Object.keys(progress.quizScores).length;
  const avg =
    quizzes > 0
      ? Math.round(
          Object.values(progress.quizScores).reduce((a, b) => a + b, 0) / quizzes
        )
      : 0;

  return (
    <>
      <section className="hero">
        <div className="hero-kicker">📘 الكتاب الفلسطيني المعتمد — 2026/2027</div>
        <h2>منصة المهارات الرقمية التفاعلية</h2>
        <p>
          رحلة تعليمية متكاملة لمادة المهارات الرقمية — الصف العاشر الأساسي:
          شرح مبسّط، حلول أسئلة الكتاب، إثراء، واختبارات قصيرة مع حفظ تقدّمك.
        </p>
        <div className="hero-badges">
          <span className="hero-badge">4 وحدات</span>
          <span className="hero-badge">{total} درسًا</span>
          <span className="hero-badge">RTL كامل</span>
          <span className="hero-badge">بدون تسجيل</span>
        </div>
        <div className="hero-cta">
          {done > 0 && progress.lastVisited ? (
            <Link className="btn accent lg" to={`/lesson/${progress.lastVisited}`}>
              ↩️ متابعة من حيث توقفت
            </Link>
          ) : (
            <Link className="btn accent lg" to="/unit/unit1">
              🚀 ابدأ الوحدة الأولى
            </Link>
          )}
          <Link className="btn secondary lg" to="/journey" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
            🗺️ خريطة رحلتي
          </Link>
        </div>
      </section>

      <div className="container">
        <section className="section mt-lg" style={{ animation: 'none' }}>
          <h3>
            <span className="sec-num">✓</span>
            تقدّمك العام
          </h3>
          <div className="stats-row">
            <div className="stat-tile">
              <div className="num">{done}</div>
              <div className="lbl">درس مكتمل</div>
            </div>
            <div className="stat-tile">
              <div className="num">{total - done}</div>
              <div className="lbl">درس متبقٍ</div>
            </div>
            <div className="stat-tile">
              <div className="num">{quizzes}</div>
              <div className="lbl">اختبار مجتاز</div>
            </div>
            <div className="stat-tile">
              <div className="num">{avg}%</div>
              <div className="lbl">متوسط الاختبارات</div>
            </div>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-label">
              أكملت {done} من {total} درسًا ({pct}%)
            </div>
          </div>
        </section>

        <h3 className="mt-lg mb">الوحدات الدراسية</h3>
        <div className="grid grid-2">
          {units.map((u) => {
            const lessons = getLessonsForUnit(u.id);
            const uDone = lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const uPct = lessons.length ? Math.round((uDone / lessons.length) * 100) : 0;
            return (
              <Link
                key={u.id}
                to={`/unit/${u.id}`}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card-unit-strip" style={{ background: u.color }} />
                <div style={{ marginTop: '0.4rem' }}>
                  <h3>
                    و{u.number}. {u.title}
                  </h3>
                  <p>{u.subtitle}</p>
                  <div className="progress-wrap mt">
                    <div className="progress-bar">
                      <span style={{ width: `${uPct}%`, background: u.color }} />
                    </div>
                  </div>
                  <div className="meta">
                    <span className="chip">📖 ص {u.bookPages[0]}–{u.bookPages[1]}</span>
                    <span className="chip">{lessons.length} دروس</span>
                    <span className="chip">✅ {uDone}/{lessons.length}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="section mt-lg" style={{ animation: 'none' }}>
          <h3><span className="sec-num">i</span> كيف تستخدم المنصة؟</h3>
          <div className="grid grid-3 mt">
            <div className="card" style={{ animation: 'none' }}>
              <h3>1️⃣ اقرأ الشرح</h3>
              <p>افتح الدرس واقرأ الأهداف والمصطلحات ثم الشرح المنظم بفهرس جانبي.</p>
            </div>
            <div className="card" style={{ animation: 'none' }}>
              <h3>2️⃣ حلّ أسئلة الكتاب</h3>
              <p>كل حل مُعلَّم بمصدره (كتاب / نموذج للمعلم / يحتاج مراجعة).</p>
            </div>
            <div className="card" style={{ animation: 'none' }}>
              <h3>3️⃣ اختبر نفسك</h3>
              <p>أجب عن الاختبار القصير واحفظ نتيجتك في «رحلتي».</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
