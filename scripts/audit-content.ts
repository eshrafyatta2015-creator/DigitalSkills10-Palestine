// سكربت تدقيق المحتوى — يتحقق من اكتمال الدروس والأسئلة
import { allLessons, units } from '../src/data/index.ts';

const issues: string[] = [];

// 1) عدد الدروس
if (allLessons.length !== 17) {
  issues.push(`عدد الدروس ${allLessons.length} — المتوقع 17`);
}

// 2) كل وحدة لها دروسها
for (const u of units) {
  for (const lid of u.lessonIds) {
    const l = allLessons.find((x) => x.id === lid);
    if (!l) issues.push(`درس مفقود في ${u.id}: ${lid}`);
  }
}

// 3) حقول إلزامية لكل درس
const requiredMin = {
  objectives: 3,
  terms: 2,
  sections: 2,
  examples: 2,
  bookActivities: 2,
  bookQuestions: 3,
  commonMistakes: 2,
  enrichment: 1,
  criticalThinking: 1,
  quiz: 2,
  sources: 1,
};

for (const l of allLessons) {
  const arr = [
    ['objectives', l.objectives],
    ['terms', l.terms],
    ['sections', l.sections],
    ['examples', l.examples],
    ['bookActivities', l.bookActivities],
    ['bookQuestions', l.bookQuestions],
    ['commonMistakes', l.commonMistakes],
    ['enrichment', l.enrichment],
    ['criticalThinking', l.criticalThinking],
    ['quiz', l.quiz],
    ['sources', l.sources],
  ] as const;

  for (const [name, list] of arr) {
    const min = requiredMin[name as keyof typeof requiredMin];
    if (list.length < min) {
      issues.push(`${l.id}: ${name} = ${list.length} (الحد الأدنى ${min})`);
    }
  }

  if (!l.summary || l.summary.length < 40) {
    issues.push(`${l.id}: summary قصيرة جدًا`);
  }
  if (!l.bookPage || l.bookPage < 1) issues.push(`${l.id}: bookPage غير صالح`);

  // 4) MCQ要有 correct
  for (const q of l.bookQuestions) {
    if (q.type === 'mcq' && (q.correct === undefined || !q.answer)) {
      issues.push(`${l.id} ${q.id}: MCQ بدون correct أو answer`);
    }
    if (!q.answerSource) issues.push(`${l.id} ${q.id}: بدون answerSource`);
  }

  // 5) quiz correct index
  for (const q of l.quiz) {
    if (q.correct < 0 || q.correct >= q.options.length) {
      issues.push(`${l.id} ${q.id}: correct index خارج النطاق`);
    }
    if (!q.explanation) issues.push(`${l.id} ${q.id}: بدون explanation`);
  }

  // 6) عربي check: لا نصوص صينية/فرنسية متبقية
  const blob = JSON.stringify(l);
  const cjk = blob.match(/[\u4e00-\u9fff]/g);
  if (cjk) {
    issues.push(`${l.id}: يحتوي محارف CJK: ${[...new Set(cjk)].join('')}`);
  }
}

// 7) unique ids
const ids = allLessons.map((l) => l.id);
if (new Set(ids).size !== ids.length) issues.push('تكرار معرفات الدروس');

// 8) quiz question ids unique per lesson
for (const l of allLessons) {
  const qids = l.quiz.map((q) => q.id);
  if (new Set(qids).size !== qids.length) issues.push(`${l.id}: تكرار quiz ids`);
  const bqs = l.bookQuestions.map((q) => q.id);
  if (new Set(bqs).size !== bqs.length) issues.push(`${l.id}: تكرار bookQuestion ids`);
}

// 9) totals
let totalBQ = 0;
let totalQuiz = 0;
let reviewNeeded = 0;
for (const l of allLessons) {
  totalBQ += l.bookQuestions.length;
  totalQuiz += l.quiz.length;
  reviewNeeded += l.needsReview.length;
  for (const q of l.bookQuestions) {
    if (q.answerSource === 'review-needed') reviewNeeded++;
  }
}

console.log('=== تقرير التدقيق ===');
console.log(`الدروس: ${allLessons.length}`);
console.log(`أسئلة الكتاب: ${totalBQ}`);
console.log(`أسئلة الاختبارات: ${totalQuiz}`);
console.log(`عناصر تحتاج مراجعة: ${reviewNeeded}`);
console.log('---------------------');

if (issues.length === 0) {
  console.log('✅ لا توجد مشاكل — المحتوى مكتمل ومتسق.');
  process.exit(0);
} else {
  console.log(`⚠️  ${issues.length} مشكلة:`);
  for (const i of issues) console.log(' -', i);
  process.exit(1);
}
