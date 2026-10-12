const KEY = 'ds10-progress-v1';

export interface StoredProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastVisited: string | null;
}

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { completedLessons: [], quizScores: {}, lastVisited: null };
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      completedLessons: parsed.completedLessons ?? [],
      quizScores: parsed.quizScores ?? {},
      lastVisited: parsed.lastVisited ?? null,
    };
  } catch {
    return { completedLessons: [], quizScores: {}, lastVisited: null };
  }
}

export function saveProgress(p: StoredProgress): void {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function markLessonComplete(lessonId: string): StoredProgress {
  const p = loadProgress();
  if (!p.completedLessons.includes(lessonId)) {
    p.completedLessons = [...p.completedLessons, lessonId];
  }
  p.lastVisited = lessonId;
  saveProgress(p);
  return p;
}

export function saveQuizScore(lessonId: string, score: number): StoredProgress {
  const p = loadProgress();
  p.quizScores[lessonId] = score;
  saveProgress(p);
  return p;
}

export function markLessonVisited(lessonId: string): void {
  const p = loadProgress();
  p.lastVisited = lessonId;
  saveProgress(p);
}

export function isLessonComplete(lessonId: string): boolean {
  return loadProgress().completedLessons.includes(lessonId);
}
