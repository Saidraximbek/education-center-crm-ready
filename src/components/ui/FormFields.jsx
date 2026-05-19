import { classNames } from '../../utils/format.js';

export function Field({ label, children }) {
  return (
    <label>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={classNames('input', className)} {...props} />;
}

export function Select({ children, className, ...props }) {
  return (
    <select className={classNames('input', className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }) {
  return <textarea className={classNames('input min-h-24 resize-y', className)} {...props} />;
}
