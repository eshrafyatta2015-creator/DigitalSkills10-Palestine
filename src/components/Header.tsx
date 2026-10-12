import { Link, NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="site-header no-print" role="banner">
      <div className="inner">
        <Link to="/" className="brand" aria-label="الصفحة الرئيسية">
          <span className="brand-icon" aria-hidden="true">📘</span>
          <span className="brand-text-full">المهارات الرقمية — الصف العاشر</span>
        </Link>
        <nav aria-label="التنقل الرئيسي">
          <NavLink to="/" end>
            الرئيسية
          </NavLink>
          <NavLink to="/units">الوحدات</NavLink>
          <NavLink to="/journey">رحلتي</NavLink>
          <NavLink to="/search">البحث</NavLink>
          <NavLink to="/about">حول</NavLink>
        </nav>
      </div>
    </header>
  );
}
