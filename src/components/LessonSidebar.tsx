import { useEffect, useState } from 'react';
import type { Lesson } from '../types';

interface TocItem {
  id: string;
  label: string;
}

export function LessonSidebar({ lesson }: { lesson: Lesson }) {
  const [active, setActive] = useState('');

  const items: TocItem[] = [
    { id: 'objectives', label: 'أهداف التعلم' },
    { id: 'terms', label: 'المصطلحات' },
    ...lesson.sections.map((s) => ({ id: s.id, label: s.title })),
    { id: 'examples', label: 'أمثلة تطبيقية' },
    { id: 'activities', label: 'أنشطة الكتاب' },
    { id: 'questions', label: 'أسئلة الكتاب وحلولها' },
    { id: 'mistakes', label: 'أخطاء شائعة' },
    { id: 'enrichment', label: 'إثراء' },
    { id: 'critical', label: 'تفكير ناقد' },
    { id: 'quiz', label: 'اختبار قصير' },
    { id: 'sources', label: 'المصادر' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  return (
    <aside className="toc-sidebar no-print" aria-label="فهرس الدرس">
      <h4>فهرس الدرس</h4>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={active === it.id ? 'active' : ''}
              onClick={() => setActive(it.id)}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
