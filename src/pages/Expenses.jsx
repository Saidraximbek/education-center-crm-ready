import { useState } from 'react';
import { Plus, ReceiptText, Trash2 } from 'lucide-react';
import { Fade } from '@mui/material';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { Field, Input, Select, Textarea } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatMoney, todayISO } from '../utils/format.js';

const blankExpense = { title: '', category: 'Kanstovar', amount: '', date: todayISO(), spentFor: '' };

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useCrmStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(blankExpense);
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const confirmed = expenses.find((expense) => expense.id === confirmId);

  const submit = async (event) => {
    event.preventDefault();
    await addExpense({ ...form, addedBy: user?.fullName || user?.email || 'Admin' });
    setForm(blankExpense);
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Chiqimlar" description="Admin kanstovar va boshqa xarajatlarni nima uchun sarflanganini yozib kiritadi." actions={<Button icon={Plus} onClick={() => setOpen(true)}>Chiqim qo'shish</Button>} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Fade in timeout={300}><div><StatCard title="Jami chiqim" value={formatMoney(total)} icon={ReceiptText} tone="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-100" /></div></Fade>
        <Fade in timeout={450}><div><StatCard title="Chiqim yozuvlari" value={expenses.length} icon={ReceiptText} /></div></Fade>
        <Fade in timeout={600}><div><StatCard title="Oxirgi kategoriya" value={expenses[0]?.category || '-'} icon={ReceiptText} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" /></div></Fade>
      </div>

      <DataTable
        data={expenses}
        columns={[
          { key: 'title', label: 'Chiqim nomi' },
          { key: 'category', label: 'Kategoriya' },
          { key: 'amount', label: 'Summa', render: (row) => formatMoney(row.amount) },
          { key: 'date', label: 'Sana' },
          { key: 'spentFor', label: 'Nimaga sarflandi' },
          { key: 'addedBy', label: 'Kiritgan' },
          { key: 'actions', label: 'Amallar', render: (row) => <Button variant="danger" className="h-9 w-9 p-0" icon={Trash2} onClick={() => setConfirmId(row.id)} aria-label="O'chirish" /> },
        ]}
      />

      <Modal open={open} title="Chiqim qo'shish" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Chiqim nomi"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Kategoriya"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Kanstovar</option><option>Ijara</option><option>Kommunal</option><option>Reklama</option><option>Ta'mirlash</option><option>Boshqa</option></Select></Field>
          <Field label="Summa"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></Field>
          <Field label="Sana"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></Field>
          <div className="md:col-span-2"><Field label="Nimaga sarflandi"><Textarea value={form.spentFor} onChange={(e) => setForm({ ...form, spentFor: e.target.value })} required /></Field></div>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">Chiqimni saqlash</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Chiqimni o'chirasizmi?"
        description={`${confirmed?.title || 'Tanlangan chiqim'} o'chiriladi. Amalni tasdiqlang.`}
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteExpense(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
