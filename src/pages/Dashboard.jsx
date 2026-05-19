import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarCheck, CreditCard, GraduationCap, TrendingUp, Users } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

const incomeData = [
  { month: 'Yan', income: 14200000 },
  { month: 'Fev', income: 16800000 },
  { month: 'Mar', income: 18100000 },
  { month: 'Apr', income: 19400000 },
  { month: 'May', income: 21500000 },
];

const growthData = [
  { month: 'Yan', students: 82 },
  { month: 'Fev', students: 96 },
  { month: 'Mar', students: 117 },
  { month: 'Apr', students: 132 },
  { month: 'May', students: 148 },
];

const attendanceData = [
  { name: 'Keldi', value: 72, color: '#10b981' },
  { name: 'Kechikdi', value: 12, color: '#f59e0b' },
  { name: 'Kelmadi', value: 16, color: '#ef4444' },
];

export default function Dashboard() {
  const { students, groups, payments, attendance } = useCrmStore();
  const totalIncome = payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const unpaid = students.filter((item) => item.paymentStatus !== 'paid').length;
  const activeGroups = groups.filter((item) => item.active).length;
  const attendancePercent = students.length
    ? Math.round(students.reduce((sum, item) => sum + Number(item.attendance || 0), 0) / students.length)
    : 0;

  return (
    <>
      <PageHeader title="Boshqaruv analitikasi" description="Talabalar, daromad, guruhlar, to'lovlar va davomat bo'yicha umumiy ko'rinish." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Jami talabalar" value={students.length} helper="Bu oy +12%" icon={Users} />
        <StatCard title="Faol guruhlar" value={activeGroups} helper={`Jami ${groups.length} ta guruh`} icon={GraduationCap} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" />
        <StatCard title="Oylik daromad" value={formatMoney(totalIncome)} helper="Yozilgan to'lovlar" icon={CreditCard} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100" />
        <StatCard title="To'lamaganlar" value={unpaid} helper="Kuzatuv kerak" icon={TrendingUp} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100" />
        <StatCard title="Davomat" value={`${attendancePercent}%`} helper={`${attendance.length} ta so'nggi belgi`} icon={CalendarCheck} tone="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="panel rounded-xl p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Daromad grafigi</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8dee8" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}m`} />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Area type="monotone" dataKey="income" stroke="#1685c7" fill="#d9efff" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel rounded-xl p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Davomat grafigi</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendanceData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} paddingAngle={3}>
                  {attendanceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="panel rounded-xl p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950 dark:text-white">Talabalar o'sishi</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8dee8" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <DataTable
          data={payments.slice(0, 5)}
          columns={[
            { key: 'studentName', label: 'Talaba' },
            { key: 'month', label: 'Oy' },
            { key: 'amount', label: 'Summa', render: (row) => formatMoney(row.amount) },
            { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          ]}
        />
      </div>
    </>
  );
}
