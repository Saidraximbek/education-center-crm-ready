import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarCheck, CreditCard, FileDown, GraduationCap, Home, LogOut, Menu, Moon, ReceiptText, Settings, Shield, Sun, UserRoundCog, Users, WalletCards, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { classNames } from '../utils/format.js';
import { useCrmStore } from '../store/useCrmStore.js';

const nav = [
  { to: '/dashboard', label: 'Boshqaruv paneli', icon: Home },
  { to: '/students', label: 'Talabalar', icon: Users },
  { to: '/groups', label: 'Guruhlar', icon: GraduationCap },
  { to: '/subjects', label: 'Fanlar', icon: BookOpen },
  { to: '/teachers', label: "O'qituvchilar", icon: UserRoundCog, directorOnly: true },
  { to: '/payments', label: "To'lovlar", icon: CreditCard },
  { to: '/teacher-salaries', label: "O'qituvchi oyliklari", icon: WalletCards },
  { to: '/expenses', label: 'Chiqimlar', icon: ReceiptText },
  { to: '/attendance', label: 'Davomat', icon: CalendarCheck },
  { to: '/admins', label: 'Adminlar', icon: Shield, directorOnly: true },
  { to: '/reports', label: 'Hisobotlar', icon: FileDown, directorOnly: true },
  { to: '/settings', label: 'Sozlamalar', icon: Settings },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout, isDirector } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const loadData = useCrmStore((state) => state.loadData);
  const location = useLocation();
  const page = nav.find((item) => item.to === location.pathname)?.label || 'CRM';
  const visibleNav = nav.filter((item) => !item.directorOnly || isDirector);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={classNames('fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-extrabold">O'quv Markazi CRM</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direktor/Admin paneli</p>
            </div>
          </div>
          <Button variant="ghost" icon={X} className="h-9 w-9 p-0 lg:hidden" onClick={() => setOpen(false)} aria-label="Menyuni yopish" />
        </div>
        <nav className="space-y-1 p-4">
          {visibleNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                  isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Yon menyuni yopish" />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" icon={Menu} className="h-10 w-10 p-0 lg:hidden" onClick={() => setOpen(true)} aria-label="Menyuni ochish" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Joriy sahifa</p>
              <h2 className="font-bold text-slate-950 dark:text-white">{page}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={theme === 'dark' ? Sun : Moon} className="h-10 w-10 p-0" onClick={toggleTheme} aria-label="Rejimni almashtirish" />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{user?.fullName || user?.email}</p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role}</p>
            </div>
            <Button variant="secondary" icon={LogOut} onClick={logout}>Chiqish</Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
