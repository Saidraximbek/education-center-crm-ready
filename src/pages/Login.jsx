import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import { Field, Input } from '../components/ui/FormFields.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: 'director@educrm.local', password: 'password123' });

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Kirish amalga oshmadi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">O'quv Markazi CRM</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Direktor va Admin uchun xavfsiz kirish</p>
            </div>
          </div>

          <form onSubmit={submit} className="panel rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">Kirish</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">O'qituvchilar bu tizimga kirmaydi.</p>
            </div>
            <div className="space-y-4">
              <Field label="Elektron pochta">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-10" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                </div>
              </Field>
              <Field label="Parol">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input className="pl-10" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
                </div>
              </Field>
              <Button className="w-full" loading={loading}>Tizimga kirish</Button>
            </div>
          </form>
        </div>
      </section>
      <section className="hidden bg-[linear-gradient(135deg,#0f6ca6,#17324d)] p-10 text-white lg:flex lg:items-end">
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">Professional o'quv markazi boshqaruvi</p>
          <h2 className="mt-4 text-5xl font-extrabold leading-tight">Talabalar, to'lovlar, guruhlar va davomat bitta qulay markazda.</h2>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {['Rol bo‘yicha kirish', 'Daromad grafiklari', 'Kvitansiyalar'].map((item) => (
              <div key={item} className="rounded-lg bg-white/12 p-4 text-sm font-bold backdrop-blur">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
