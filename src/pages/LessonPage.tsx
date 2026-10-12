import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BookQuestion, Lesson, QuizQuestion } from '../types';
import { markLessonComplete, saveQuizScore, loadProgress, markLessonVisited } from '../utils/progress';
import { LessonSidebar } from '../components/LessonSidebar';
import { getUnit } from '../data';

function answerBadge(a: BookQuestion['answerSource']) {
  if (a === 'book') return <span className="tag book">من الكتاب</span>;
  if (a === 'review-needed') return <span className="tag review">يحتاج مراجعة</span>;
  return <span className="tag model">إجابة نموذجية</span>;
}

function Sec({ n }: { n: string }) {
  return <span className="sec-num" aria-hidden="true">{n}</span>;
}

function QuizBlock({ lesson }: { lesson: Lesson }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  const score = revealed
    ? lesson.quiz.filter((q) => answers[q.id] === q.correct).length
    : 0;
  const pct = lesson.quiz.length ? Math.round((score / lesson.quiz.length) * 100) : 0;

  useEffect(() => {
    if (revealed) saveQuizScore(lesson.id, pct);
  }, [revealed, pct, lesson.id]);

  const allAnswered = lesson.quiz.every((q) => answers[q.id] !== undefined);

  return (
    <section className="section" id="quiz">
      <h3>
        <Sec n="؟" />
        اختبار قصير
      </h3>
      <p className="text-muted text-sm mb">
        {lesson.quiz.length} أسئلة — أجب ثم اضغط «تحقق من إجاباتي».
      </p>
      {lesson.quiz.map((q: QuizQuestion, i) => (
        <div key={q.id} className="q-item">
          <div className="prompt">
            {i + 1}. {q.question}
          </div>
          {q.options.map((opt, oi) => {
            let cls = 'quiz-option';
            if (revealed) {
              if (oi === q.correct) cls += ' correct';
              else if (answers[q.id] === oi) cls += ' wrong';
            }
            return (
              <button
                key={oi}
                type="button"
                className={cls}
                disabled={revealed}
                aria-pressed={answers[q.id] === oi}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
              >
                {opt}
              </button>
            );
          })}
          {revealed && <div className="quiz-explanation">{q.explanation}</div>}
        </div>
      ))}
      {!revealed ? (
        <button
          type="button"
          className="btn accent"
          onClick={() => setRevealed(true)}
          disabled={!allAnswered}
        >
          تحقق من إجاباتي
        </button>
      ) : (
        <div className="quiz-score">
          نتيجتك: {score} من {lesson.quiz.length} ({pct}%)
          {pct >= 80 ? ' — ممتاز! 🎉' : pct >= 50 ? ' — جيد، راجع النقطات الضعيفة.' : ' — أعد قراءة الشرح ثم حاول مجددًا.'}
        </div>
      )}
    </section>
  );
}

export function LessonPage({ lesson, prev, next }: {
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  const [done, setDone] = useState(false);
  const unit = getUnit(lesson.unitId);

  useEffect(() => {
    setDone(loadProgress().completedLessons.includes(lesson.id));
    markLessonVisited(lesson.id);
    window.scrollTo(0, 0);
  }, [lesson.id]);

  const handleComplete = () => {
    markLessonComplete(lesson.id);
    setDone(true);
  };

  const unitColor = unit?.color ?? 'var(--c-primary-700)';

  return (
    <div className="page-layout with-sidebar">
      <LessonSidebar lesson={lesson} />

      <div className="lesson-main">
        <header className="lesson-header" style={{ borderTopColor: unitColor }}>
          <nav className="crumbs" aria-label="مسار التنقل">
            <Link to="/">الرئيسية</Link>
            <span className="sep">/</span>
            <Link to="/units">الوحدات</Link>
            <span className="sep">/</span>
            <Link to={`/unit/${lesson.unitId}`}>
              و{lesson.unitId.replace('unit', '')} {unit?.title}
            </Link>
            <span className="sep">/</span>
            <span>الدرس {lesson.number}</span>
          </nav>

          <h2>{lesson.title}</h2>
          <p className="summary">{lesson.summary}</p>

          <div className="lesson-meta">
            <span className="chip">📖 صفحة الكتاب {lesson.bookPage}</span>
            <span className="chip">📝 {lesson.bookQuestions.length} سؤال كتاب</span>
            <span className="chip">✅ {lesson.quiz.length} أسئلة اختبار</span>
            <span className="chip">🎯 {lesson.objectives.length} أهداف</span>
          </div>

          <button type="button" className={`btn no-print ${done ? 'success' : ''}`} onClick={handleComplete} disabled={done}>
            {done ? '✓ مكتمل — أحسنت' : 'وضع علامة اكتمال الدرس'}
          </button>
        </header>

        <section className="section" id="objectives">
          <h3><Sec n="1" /> أهداف التعلم</h3>
          <ol>
            {lesson.objectives.map((o, i) => (
              <li key={i}>{o.text}</li>
            ))}
          </ol>
        </section>

        <section className="section" id="terms">
          <h3><Sec n="2" /> مصطلحات أساسية</h3>
          <ul>
            {lesson.terms.map((t, i) => (
              <li key={i}>
                <strong className="tag term">{t.term}</strong> — {t.definition}
              </li>
            ))}
          </ul>
        </section>

        {lesson.sections.map((s, si) => (
          <section className="section" key={s.id} id={s.id}>
            <h3>
              <Sec n={String(si + 3)} />
              {s.title}
            </h3>
            {s.content.map((c, i) => {
              const looksLikeCode =
                c.includes('print(') || c.includes('if ') || c.includes('for ') ||
                c.includes('input(') || c.includes('=') || c.includes('float(');
              return looksLikeCode && (c.includes('\n') || c.includes('print(') || c.includes('input(')) ? (
                <pre key={i}>{c}</pre>
              ) : (
                <p key={i}>{c}</p>
              );
            })}
          </section>
        ))}

        <section className="section" id="examples">
          <h3><Sec n="6" /> أمثلة تطبيقية</h3>
          <ul>
            {lesson.examples.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="activities">
          <h3><Sec n="7" /> أنشطة الكتاب</h3>
          <ul>
            {lesson.bookActivities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="questions">
          <h3><Sec n="8" /> أسئلة الكتاب وحلولها</h3>
          <p className="text-muted text-sm mb">
            كل حل مُعلَّم بمصدره: من الكتاب، أو إجابة نموذجية للمعلم، أو يحتاج مراجعة.
          </p>
          {lesson.bookQuestions.map((q) => (
            <div key={q.id} className="q-item">
              <div className="prompt">{q.prompt}</div>
              {q.options && (
                <ul className="options">
                  {q.options.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              )}
              {q.answer && (
                <div className="answer">
                  {answerBadge(q.answerSource)} <strong>الحل:</strong> {q.answer}
                </div>
              )}
              {q.note && <div className="note">⚠️ {q.note}</div>}
            </div>
          ))}
          {lesson.needsReview.length > 0 && (
            <div className="needed-review">
              <h4>⚠️ عناصر تحتاج مراجعة المعلم</h4>
              <ul>
                {lesson.needsReview.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="section" id="mistakes">
          <h3><Sec n="9" /> أخطاء شائعة</h3>
          <ul>
            {lesson.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="summary-block">
          <h3><Sec n="10" /> خلاصة الدرس</h3>
          <p>{lesson.summary}</p>
        </section>

        <section className="section" id="enrichment">
          <h3><Sec n="11" /> إثراء</h3>
          <ul>
            {lesson.enrichment.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="critical">
          <h3><Sec n="12" /> تفكير ناقد</h3>
          <ul>
            {lesson.criticalThinking.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>

        <QuizBlock lesson={lesson} />

        <section className="section" id="sources">
          <h3><Sec n="13" /> المصادر</h3>
          <ul>
            {lesson.sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <nav className="lesson-nav no-print" aria-label="تنقل بين الدروس">
          <div className="nav-side">
            {prev ? (
              <Link className="btn secondary" to={`/lesson/${prev.id}`}>
                ← {prev.title}
              </Link>
            ) : null}
          </div>
          <div className="nav-side end">
            {next ? (
              <Link className="btn" to={`/lesson/${next.id}`}>
                {next.title} →
              </Link>
            ) : (
              <Link className="btn success" to="/journey">
                🎓 عرض رحلتي
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
