import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { BackToTop } from './components/BackToTop';
import { HomePage } from './pages/HomePage';
import { UnitsPage, UnitDetailPage } from './pages/UnitsPage';
import { JourneyPage } from './pages/JourneyPage';
import { SearchPage, AboutPage } from './pages/MiscPages';
import { LessonPage } from './pages/LessonPage';
import { lessonsById, getPrevLesson, getNextLesson } from './data';

function LessonRoute() {
  const { id } = useParams();
  const lesson = id ? lessonsById[id] : undefined;
  if (!lesson)
    return (
      <div className="container mt text-center">
        <div className="section">
          <h3>الدرس غير موجود</h3>
          <p className="text-muted">ربما تغيّر الرابط. عد إلى الوحدات.</p>
        </div>
      </div>
    );
  return (
    <LessonPage lesson={lesson} prev={getPrevLesson(lesson.id)} next={getNextLesson(lesson.id)} />
  );
}

function UnitRoute() {
  const { id } = useParams();
  return <UnitDetailPage unitId={id ?? ''} />;
}

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/unit/:id" element={<UnitRoute />} />
          <Route path="/lesson/:id" element={<LessonRoute />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-brand">المهارات الرقمية — الصف العاشر الأساسي</div>
        <p>منصة تعليمية تكميلية مبنية على الكتاب المدرسي المعتمد — للاستخدام المدرسي في فلسطين</p>
      </footer>
      <BackToTop />
    </HashRouter>
  );
}
