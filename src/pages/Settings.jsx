import { Moon, Sun } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { hasFirebaseConfig } from '../firebase/config.js';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <PageHeader title="Sozlamalar" description="Tizim sozlamalari va Firebase ulanish holati." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel rounded-xl p-5">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Ko'rinish</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Yorug' va qorong'i rejimlar orasida almashing.</p>
          <Button className="mt-4" icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme}>
            {theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
          </Button>
        </div>
        <div className="panel rounded-xl p-5">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Firebase</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {hasFirebaseConfig ? 'Firebase muhit qiymatlari sozlangan.' : 'Firebase muhit qiymatlari kiritilmagan, CRM lokal demo rejimida ishlayapti.'}
          </p>
          <div className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Kolleksiyalar: users, students, groups, payments, attendance, subjects
          </div>
        </div>
      </div>
    </>
  );
}
