export default function StatCard({ title, value, helper, icon: Icon, tone = 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-100' }) {
  return (
    <div className="panel rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{value}</p>
          {helper && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
        </div>
        <div className={`rounded-lg p-3 ${tone}`}>{Icon && <Icon className="h-5 w-5" />}</div>
      </div>
    </div>
  );
}
