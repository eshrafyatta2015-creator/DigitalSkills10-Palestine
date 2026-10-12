import type { Lesson, Unit } from '../types';
import { units } from './units';
import { u1l1, u1l2, u1l3, u1l4 } from './unit1';
import { u2l1, u2l2, u2l3, u2l4 } from './unit2';
import { u3l1, u3l2, u3l3, u3l4, u3l5 } from './unit3';
import { u4l1, u4l2, u4l3, u4l4 } from './unit4';

export const allLessons: Lesson[] = [
  u1l1, u1l2, u1l3, u1l4,
  u2l1, u2l2, u2l3, u2l4,
  u3l1, u3l2, u3l3, u3l4, u3l5,
  u4l1, u4l2, u4l3, u4l4,
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((l) => [l.id, l])
);

export function getUnit(unitId: string): Unit | undefined {
  return units.find((u) => u.id === unitId);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  const unit = getUnit(unitId);
  if (!unit) return [];
  return unit.lessonIds
    .map((id) => lessonsById[id])
    .filter((l): l is Lesson => Boolean(l));
}

export function getNextLesson(lessonId: string): Lesson | null {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx >= allLessons.length - 1) return null;
  return allLessons[idx + 1];
}

export function getPrevLesson(lessonId: string): Lesson | null {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return null;
  return allLessons[idx - 1];
}

export { units };
