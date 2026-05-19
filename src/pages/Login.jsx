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

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);

      navigate(location.state?.from?.pathname || '/dashboard', {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || 'Login xato');
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
              <h1 className="text-2xl font-extrabold">CRM Login</h1>
              <p className="text-sm text-slate-500">Admin & Director system</p>
            </div>
          </div>

          <form onSubmit={submit} className="panel rounded-xl p-6 space-y-4">

            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-10"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-10"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </Field>

            <Button className="w-full" loading={loading}>
              Login
            </Button>

          </form>
        </div>
      </section>
    </div>
  );
}