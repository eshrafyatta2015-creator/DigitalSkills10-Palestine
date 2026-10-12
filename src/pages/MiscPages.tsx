import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allLessons, units } from '../data';

export function SearchPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const term = q.trim();
    if (term.length < 2) return [];
    const t = term.toLowerCase();
    return allLessons
      .map((l) => {
        const hay = [
          l.title,
          l.summary,
          ...l.terms.map((x) => `${x.term} ${x.definition}`),
          ...l.sections.flatMap((s) => [s.title, ...s.content]),
          ...l.bookQuestions.map((x) => x.prompt),
          ...l.examples,
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(t) ? l : null;
      })
      .filter(Boolean) as typeof allLessons;
  }, [q]);

  return (
    <div className="container">
      <div className="lesson-header" style={{ borderTopColor: 'var(--c-primary-700)' }}>
        <nav className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span className="sep">/</span>
          <span>البحث</span>
        </nav>
        <h2>🔍 البحث في الدروس</h2>
        <p className="summary">
          ابحث في العناوين والمصطلحات وأقسام الشرح وأسئلة الكتاب عبر الوحدات الأربع.
        </p>
        <input
          className="search-box"
          type="search"
          placeholder="مثال: الأردوينو، البصمة، FORECAST، الجمل الشرطية…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="بحث"
          autoFocus
        />
      </div>

      {q.trim().length >= 2 ? (
        <div className="search-results">
          <p className="text-muted mb">
            <strong>{results.length}</strong> نتيجة مطابقة لـ «{q.trim()}»
          </p>
          {results.length === 0 ? (
            <div className="section">
              <p>لا توجد نتائج. جرّب كلمات أقصر أو مصطلحًا من الكتاب (مثل: المستشعر، التصيد، الدالة).</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {results.map((l) => {
                const unit = units.find((u) => u.id === l.unitId);
                return (
                  <Link
                    key={l.id}
                    to={`/lesson/${l.id}`}
                    className="card"
                    style={{ animation: 'none', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="card-unit-strip"
                      style={{ background: unit?.color ?? 'var(--c-primary-700)' }}
                    />
                    <div style={{ marginTop: '0.4rem' }}>
                      <h3>{l.title}</h3>
                      <p>{l.summary.slice(0, 150)}…</p>
                      <div className="meta">
                        <span className="chip">
                          و{unit?.number} {unit?.title}
                        </span>
                        <span className="chip">صفحة {l.bookPage}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="section mt">
          <h3><span className="sec-num">؟</span> اقتراحات بحث شائعة</h3>
          <div className="flex mt">
            {['البيانات', 'الجدول الإلكتروني', 'بايثون', 'الشرطيات', 'الحلقات', 'البصمة الرقمية', 'DNS', 'التصيد', 'المصادقة الثنائية', 'الأردوينو', 'المستشعرات', 'جودة القرار'].map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  className="btn ghost"
                  style={{ border: '1px solid var(--c-border)', fontSize: '0.85rem' }}
                  onClick={() => setQ(s)}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="container">
      <div className="lesson-header" style={{ borderTopColor: 'var(--c-primary-700)' }}>
        <nav className="crumbs">
          <Link to="/">الرئيسية</Link>
          <span className="sep">/</span>
          <span>حول المنصة</span>
        </nav>
        <h2>حول هذه المنصة</h2>
        <p className="summary">
          منصة تعليمية تفاعلية بالعربية (RTL) لمادة المهارات الرقمية — الصف العاشر الأساسي،
          مبنية على الكتاب الفلسطيني الرسمي.
        </p>
      </div>

      <section className="section">
        <h3><span className="sec-num">1</span> ماذا تقدّم المنصة؟</h3>
        <ul>
          <li><strong>4 وحدات و17 درسًا</strong> مغطية الكتاب كاملًا (ص 6–152).</li>
          <li>كل درس يضم: أهدافًا، مصطلحات، شرحًا منظمًا، أمثلة، أنشطة الكتاب، أسئلة الكتاب وحلولها، أخطاء شائعة، إثراء، تفكيرًا ناقدًا، واختبارًا قصيرًا.</li>
          <li><strong>فهرس جانبي تفاعلي</strong> يتابع موقعك في الدرس.</li>
          <li><strong>خريطة رحلة</strong> تعرض تقدّمك وسجل الاختبارات.</li>
          <li><strong>حفظ محلي</strong> للتقدّم في متصفحك فقط — لا خادم ولا حساب.</li>
        </ul>
      </section>

      <section className="section">
        <h3><span className="sec-num">2</span> سياسة المحتوى والتدقيق</h3>
        <ul>
          <li>المحتوى مستخلص من الكتاب المدرسي المعتمد؛ لا يُنشأ محتوى ويُنسب زورًا له.</li>
          <li>كل حل أسئلة مُعلَّم بمصدره: <span className="tag book">من الكتاب</span> أو <span className="tag model">إجابة نموذجية</span> أو <span className="tag review">يحتاج مراجعة</span>.</li>
          <li>تحليلات الوحدات التربوية في <code>docs/unit-analysis/</code>.</li>
          <li>ملف تدقيق الأسئلة في <code>docs/content-audit/</code>.</li>
        </ul>
      </section>

      <section className="section">
        <h3><span className="sec-num">3</span> الوحدات</h3>
        <table className="map-table">
          <thead>
            <tr>
              <th>الوحدة</th>
              <th>العنوان</th>
              <th>الدروس</th>
              <th>الصفحات</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td>{u.number}</td>
                <td>
                  <Link to={`/unit/${u.id}`}>{u.title}</Link>
                </td>
                <td>{u.lessonIds.length}</td>
                <td>
                  {u.bookPages[0]}–{u.bookPages[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h3><span className="sec-num">4</span> للطلبة والمعلمين</h3>
        <p>
          هذه منصة <strong>تكميلية غير رسمية</strong>. يُنصح بمراجعة الحلول النموذجية
          مع المعلم المختص قبل الاعتماد الكامل، خصوصًا العناصر المعلَّمة
          «يحتاج مراجعة».
        </p>
      </section>
    </div>
  );
}
