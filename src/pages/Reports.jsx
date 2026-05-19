import { Download, FileDown, ReceiptText, WalletCards } from 'lucide-react';
import { Alert, Fade } from '@mui/material';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

export default function Reports() {
  const { students, groups, payments, attendance, teacherSalaries, expenses } = useCrmStore();
  const income = payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const debt = payments.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingSalaries = teacherSalaries.filter((item) => item.approvalStatus !== 'approved');
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const exportCsv = () => {
    const header = "Talaba,Fan,Guruh,To'lov holati,Oylik to'lov\n";
    const rows = students.map((item) => [item.fullName, item.subject, item.group, item.paymentStatus, item.monthlyFee].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'education-center-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Hisobot eksport qilindi');
  };

  return (
    <>
      <PageHeader title="Hisobotlar" description="Direktor uchun hisobotlar, statistika va eksport vositalari." actions={<Button icon={Download} onClick={exportCsv}>CSV eksport</Button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard title="Talabalar" value={students.length} icon={FileDown} />
        <StatCard title="Guruhlar" value={groups.length} icon={FileDown} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" />
        <StatCard title="Daromad" value={formatMoney(income)} icon={FileDown} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100" />
        <StatCard title="Qarzdorlik" value={formatMoney(debt)} icon={FileDown} tone="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100" />
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Fade in timeout={300}><div><StatCard title="Jami chiqim" value={formatMoney(totalExpenses)} icon={ReceiptText} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100" /></div></Fade>
        <Fade in timeout={450}><div><StatCard title="Tasdiq kutayotgan oyliklar" value={pendingSalaries.length} icon={WalletCards} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" /></div></Fade>
        <Fade in timeout={600}><div><StatCard title="Sof natija" value={formatMoney(income - totalExpenses)} icon={FileDown} /></div></Fade>
      </div>

      {pendingSalaries.length > 0 && (
        <Alert severity="warning" className="mb-6">
          Direktor tasdig'ini kutayotgan yoki rad etilgan o'qituvchi oyliklari bor. Ular quyidagi jadvalda ko'rsatilgan.
        </Alert>
      )}

      <div className="mb-6">
        <DataTable
          data={pendingSalaries}
          empty="Tasdiqlanmagan oyliklar yo'q"
          columns={[
            { key: 'teacherName', label: "O'qituvchi" },
            { key: 'month', label: 'Oy' },
            { key: 'calculatedSalary', label: 'Hisoblangan', render: (row) => formatMoney(row.calculatedSalary) },
            { key: 'paidToTeacher', label: 'Berilgan', render: (row) => formatMoney(row.paidToTeacher) },
            { key: 'approvalStatus', label: 'Holat', render: (row) => <Badge tone={row.approvalStatus || 'pending'}>{row.approvalStatus || 'pending'}</Badge> },
          ]}
        />
      </div>

      <div className="mb-6">
        <DataTable
          data={expenses}
          empty="Chiqimlar yo'q"
          columns={[
            { key: 'title', label: 'Chiqim' },
            { key: 'category', label: 'Kategoriya' },
            { key: 'amount', label: 'Summa', render: (row) => formatMoney(row.amount) },
            { key: 'spentFor', label: 'Nimaga sarflandi' },
          ]}
        />
      </div>

      <DataTable
        data={attendance}
        columns={[
          { key: 'date', label: 'Sana' },
          { key: 'group', label: 'Guruh' },
          { key: 'studentName', label: 'Talaba' },
          { key: 'status', label: 'Davomat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
        ]}
      />
    </>
  );
}
