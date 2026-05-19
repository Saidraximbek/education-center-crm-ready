import { useMemo, useState } from 'react';
import { Bell, FileText, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { Field, Input, Select } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

export default function Payments() {
  const { students, payments, addPayment } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ studentId: '', amount: '', month: 'May 2026', status: 'paid', date: new Date().toISOString().slice(0, 10), method: 'Naqd' });

  const filtered = payments.filter((item) => filter === 'all' || item.status === filter);
  const stats = useMemo(() => {
    const paid = payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const debt = payments.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { paid, debt };
  }, [payments]);

  const submit = async (event) => {
    event.preventDefault();
    await addPayment({ ...form, amount: Number(form.amount), date: form.status === 'paid' ? form.date : '' });
    setOpen(false);
  };

  const receipt = (row) => {
    toast.success(`${row.studentName} uchun kvitansiya yaratildi`);
    window.print();
  };

  return (
    <>
      <PageHeader title="To'lovlar" description="Oylik to'lovlar, qarzdorlik, to'lov tarixi, kvitansiya va bildirishnomalarni boshqaring." actions={<Button icon={Plus} onClick={() => setOpen(true)}>To'lov qo'shish</Button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="To'langan daromad" value={formatMoney(stats.paid)} icon={FileText} />
        <StatCard title="Qolgan qarzdorlik" value={formatMoney(stats.debt)} icon={Bell} tone="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100" />
        <div className="panel rounded-xl p-5">
          <span className="label">Saralash</span>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Barcha to'lovlar</option>
            <option value="paid">To'langan</option>
            <option value="unpaid">To'lanmagan</option>
            <option value="debt">Qarzdor</option>
          </Select>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={[
          { key: 'studentName', label: 'Talaba' },
          { key: 'month', label: 'Oy' },
          { key: 'amount', label: 'Summa', render: (row) => formatMoney(row.amount) },
          { key: 'method', label: "To'lov usuli" },
          { key: 'date', label: 'Sana', render: (row) => row.date || '-' },
          { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          { key: 'actions', label: 'Amallar', render: (row) => (
            <div className="flex gap-2">
              <Button variant="secondary" icon={FileText} onClick={() => receipt(row)}>Kvitansiya</Button>
              <Button variant="secondary" icon={Bell} onClick={() => toast.success(`${row.studentName} uchun Telegram xabari tayyorlandi`)}>Telegram</Button>
            </div>
          ) },
        ]}
      />

      <Modal open={open} title="Oylik to'lov qo'shish" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Talaba"><Select value={form.studentId} onChange={(e) => {
            const student = students.find((item) => item.id === e.target.value);
            setForm({ ...form, studentId: e.target.value, amount: student?.monthlyFee || '' });
          }} required><option value="">Talabani tanlang</option>{students.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}</Select></Field>
          <Field label="Summa"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></Field>
          <Field label="Oy"><Input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required /></Field>
          <Field label="Holat"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="paid">To'langan</option><option value="unpaid">To'lanmagan</option><option value="debt">Qarzdor</option></Select></Field>
          <Field label="To'lov sanasi"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="To'lov usuli"><Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}><option>Naqd</option><option>Karta</option><option>Bank o'tkazmasi</option><option>Click/Payme</option></Select></Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">To'lovni saqlash</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
