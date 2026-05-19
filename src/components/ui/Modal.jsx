import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="panel max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Oynani yopish" className="h-9 w-9 p-0" icon={X} />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
