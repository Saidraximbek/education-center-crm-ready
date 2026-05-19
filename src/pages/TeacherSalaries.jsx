import { useEffect, useMemo, useState } from 'react';
import { Calculator, CheckCircle2, Save, Users, WalletCards, XCircle } from 'lucide-react';
import { Zoom } from '@mui/material';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, Input, Select, Textarea } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatMoney } from '../utils/format.js';

const currentMonth = 'May 2026';

const salaryStatus = (calculatedSalary, paidToTeacher) => {
  if (paidToTeacher <= 0) return 'debt';
  if (paidToTeacher >= calculatedSalary) return 'paid';
  return 'partial';
};

export default function TeacherSalaries() {
  const { students, payments, teachers: teacherProfiles, teacherSalaries, saveTeacherSalary, approveTeacherSalary } = useCrmStore();
  const { user, isDirector } = useAuth();
  const [month, setMonth] = useState(currentMonth);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [form, setForm] = useState({ percent: 40, paidToTeacher: 0, note: '' });

  const teachers = useMemo(() => {
    const fromProfiles = teacherProfiles.map((teacher) => teacher.fullName).filter(Boolean);
    const fromStudents = students.map((student) => student.teacherName).filter(Boolean);
    return [...new Set([...fromProfiles, ...fromStudents])].sort();
  }, [students, teacherProfiles]);

  const selected = selectedTeacher || teachers[0] || '';
  const selectedProfile = teacherProfiles.find((teacher) => teacher.fullName === selected);

  const teacherStudents = useMemo(() => {
    return students.filter((student) => student.teacherName === selected);
  }, [students, selected]);

  const paidPayments = useMemo(() => {
    const studentIds = new Set(teacherStudents.map((student) => student.id));
    const studentNames = new Set(teacherStudents.map((student) => student.fullName));
    return payments.filter((payment) => {
      const belongsToTeacher = studentIds.has(payment.studentId) || studentNames.has(payment.studentName);
      return belongsToTeacher && payment.status === 'paid' && payment.month === month;
    });
  }, [payments, teacherStudents, month]);

  const totalPaidByStudents = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const calculatedSalary = Math.round((totalPaidByStudents * Number(form.percent || 0)) / 100);
  const paidToTeacher = Number(form.paidToTeacher || 0);
  const remaining = Math.max(calculatedSalary - paidToTeacher, 0);

  const savedRows = teacherSalaries.map((record) => ({
    ...record,
    remaining: Math.max(Number(record.calculatedSalary || 0) - Number(record.paidToTeacher || 0), 0),
  }));

  useEffect(() => {
    if (selectedProfile?.percent && !selectedTeacher) {
      setForm((current) => ({ ...current, percent: selectedProfile.percent }));
    }
  }, [selectedProfile, selectedTeacher]);

  const save = async (event) => {
    event.preventDefault();
    await saveTeacherSalary({
      teacherName: selected,
      month,
      percent: Number(form.percent || 0),
      totalPaidByStudents,
      calculatedSalary,
      paidToTeacher,
      paidByAdmin: user?.fullName || user?.email || 'Admin',
      note: form.note,
    });
  };

  return (
    <>
      <PageHeader
        title="O'qituvchi oyliklari"
        description="Admin oylikni kiritadi, Direktor esa berilgan summani tasdiqlaydi yoki rad etadi."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Zoom in timeout={250}><div><StatCard title="O'qituvchi talabalari" value={teacherStudents.length} icon={Users} /></div></Zoom>
        <Zoom in timeout={350}><div><StatCard title="Talabalardan tushgan" value={formatMoney(totalPaidByStudents)} icon={WalletCards} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100" /></div></Zoom>
        <Zoom in timeout={450}><div><StatCard title="Hisoblangan oylik" value={formatMoney(calculatedSalary)} helper={`${form.percent}% ulush`} icon={Calculator} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" /></div></Zoom>
        <Zoom in timeout={550}><div><StatCard title="Qolgan summa" value={formatMoney(remaining)} icon={WalletCards} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100" /></div></Zoom>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={save} className="panel rounded-xl p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Oylik hisoblash</h2>
          <div className="grid gap-4">
            <Field label="O'qituvchi">
              <Select value={selected} onChange={(event) => {
                const next = event.target.value;
                const profile = teacherProfiles.find((teacher) => teacher.fullName === next);
                setSelectedTeacher(next);
                if (profile?.percent) setForm((current) => ({ ...current, percent: profile.percent }));
              }} required>
                {teachers.map((teacher) => <option key={teacher}>{teacher}</option>)}
              </Select>
            </Field>
            <Field label="Oy">
              <Input value={month} onChange={(event) => setMonth(event.target.value)} placeholder="May 2026" required />
            </Field>
            <Field label="O'qituvchi ulushi (%)">
              <Input type="number" min="0" max="100" value={form.percent} onChange={(event) => setForm({ ...form, percent: event.target.value })} required />
            </Field>
            <Field label="O'qituvchiga berilgan summa">
              <Input type="number" min="0" value={form.paidToTeacher} onChange={(event) => setForm({ ...form, paidToTeacher: event.target.value })} />
            </Field>
            <Field label="Izoh">
              <Textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
            </Field>
            <div className="rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-800">
              <p className="font-bold text-slate-950 dark:text-white">Formula</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                {formatMoney(totalPaidByStudents)} x {form.percent || 0}% = {formatMoney(calculatedSalary)}
              </p>
            </div>
            <Button type="submit" icon={Save} disabled={!selected}>Oylikni saqlash</Button>
          </div>
        </form>

        <DataTable
          data={teacherStudents}
          empty="Bu o'qituvchiga talaba biriktirilmagan"
          columns={[
            { key: 'fullName', label: 'Talaba' },
            { key: 'group', label: 'Guruh' },
            { key: 'monthlyFee', label: "Oylik to'lov", render: (row) => formatMoney(row.monthlyFee) },
            { key: 'paymentStatus', label: "To'lov holati", render: (row) => <Badge tone={row.paymentStatus}>{row.paymentStatus}</Badge> },
          ]}
        />
      </div>

      <div className="mt-6">
        <DataTable
          data={savedRows}
          empty="Hali o'qituvchi oyligi saqlanmagan"
          columns={[
            { key: 'teacherName', label: "O'qituvchi" },
            { key: 'month', label: 'Oy' },
            { key: 'percent', label: 'Foiz', render: (row) => `${row.percent}%` },
            { key: 'totalPaidByStudents', label: 'Tushum', render: (row) => formatMoney(row.totalPaidByStudents) },
            { key: 'calculatedSalary', label: 'Hisoblangan', render: (row) => formatMoney(row.calculatedSalary) },
            { key: 'paidToTeacher', label: 'Berilgan', render: (row) => formatMoney(row.paidToTeacher) },
            { key: 'remaining', label: 'Qolgan', render: (row) => formatMoney(row.remaining) },
            { key: 'status', label: "To'lov holati", render: (row) => <Badge tone={salaryStatus(row.calculatedSalary, row.paidToTeacher)}>{salaryStatus(row.calculatedSalary, row.paidToTeacher)}</Badge> },
            { key: 'approvalStatus', label: 'Direktor tasdig‘i', render: (row) => <Badge tone={row.approvalStatus || 'pending'}>{row.approvalStatus || 'pending'}</Badge> },
            { key: 'approvalActions', label: 'Tasdiqlash', render: (row) => isDirector ? (
              <div className="flex gap-2">
                <Button variant="secondary" className="h-9 w-9 p-0" icon={CheckCircle2} onClick={() => approveTeacherSalary(row.id, 'approved')} aria-label="Tasdiqlash" />
                <Button variant="danger" className="h-9 w-9 p-0" icon={XCircle} onClick={() => approveTeacherSalary(row.id, 'rejected')} aria-label="Rad etish" />
              </div>
            ) : '-' },
          ]}
        />
      </div>
    </>
  );
}
