import { classNames } from '../../utils/format.js';

const styles = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  unpaid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  debt: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  absent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  partial: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
};

const labels = {
  paid: "To'langan",
  present: 'Keldi',
  active: 'Faol',
  unpaid: "To'lanmagan",
  late: 'Kechikdi',
  debt: 'Qarzdor',
  absent: 'Kelmadi',
  inactive: 'Nofaol',
  director: 'Direktor',
  admin: 'Admin',
  partial: 'Qisman berilgan',
  pending: 'Tasdiq kutmoqda',
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
};

export default function Badge({ children, tone }) {
  return (
    <span className={classNames('inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize', styles[tone] || styles.inactive)}>
      {labels[children] || labels[tone] || children}
    </span>
  );
}
