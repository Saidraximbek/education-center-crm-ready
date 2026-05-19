import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, CreditCard, Phone, UserRound } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

export default function StudentProfile() {
  const { studentId } = useParams();
  const { students, payments, attendance } = useCrmStore();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return (
      <div className="panel rounded-xl p-8 text-center">
        <p className="font-bold">Talaba topilmadi</p>
        <Link to="/students"><Button className="mt-4" icon={ArrowLeft}>Talabalarga qaytish</Button></Link>
      </div>
    );
  }

  const paymentHistory = payments.filter((item) => item.studentId === student.id || item.studentName === student.fullName);
  const attendanceHistory = attendance.filter((item) => item.studentName === student.fullName);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-100" to="/students"><ArrowLeft className="h-4 w-4" /> Orqaga</Link>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">{student.fullName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{student.subject} / {student.group}</p>
        </div>
        <Badge tone={student.paymentStatus}>{student.paymentStatus}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Oylik to'lov" value={formatMoney(student.monthlyFee)} icon={CreditCard} />
        <StatCard title="Davomat" value={`${student.attendance}%`} icon={CalendarCheck} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100" />
        <StatCard title="Telefon" value={student.phone} icon={Phone} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" />
        <StatCard title="O'qituvchi ismi" value={student.teacherName} icon={UserRound} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DataTable
          data={paymentHistory}
          empty="To'lov tarixi yo'q"
          columns={[
            { key: 'month', label: 'Oy' },
            { key: 'amount', label: 'Summa', render: (row) => formatMoney(row.amount) },
            { key: 'method', label: "To'lov usuli" },
            { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          ]}
        />
        <DataTable
          data={attendanceHistory}
          empty="Davomat tarixi yo'q"
          columns={[
            { key: 'date', label: 'Sana' },
            { key: 'group', label: 'Guruh' },
            { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          ]}
        />
      </div>

      <div className="panel mt-6 rounded-xl p-5">
        <h2 className="font-bold text-slate-950 dark:text-white">Izohlar</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{student.notes || "Izoh qo'shilmagan."}</p>
      </div>
    </>
  );
}
