import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Field, Input, Select, Textarea } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

const blankStudent = {
  fullName: '',
  phone: '',
  parentPhone: '',
  subject: '',
  group: '',
  teacherName: '',
  monthlyFee: '',
  paymentStatus: 'unpaid',
  attendance: 100,
  joinDate: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function Students() {
  const { students, groups, subjects, addStudent, updateStudent, deleteStudent } = useCrmStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [subject, setSubject] = useState('all');
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(blankStudent);

  const filtered = useMemo(() => students.filter((student) => {
    const matchesQuery = [student.fullName, student.phone, student.parentPhone, student.group].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'all' || student.paymentStatus === status;
    const matchesSubject = subject === 'all' || student.subject === subject;
    return matchesQuery && matchesStatus && matchesSubject;
  }), [students, query, status, subject]);

  const openNew = () => {
    setEditing({ mode: 'create' });
    setForm(blankStudent);
  };

  const openEdit = (student) => {
    setEditing({ mode: 'edit', id: student.id });
    setForm(student);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, monthlyFee: Number(form.monthlyFee), attendance: Number(form.attendance) };
    if (editing.mode === 'edit') await updateStudent(editing.id, payload);
    else await addStudent(payload);
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="Talabalar"
        description="Talabalarni qo'shish, tahrirlash, qidirish, saralash va profilini ko'rish."
        actions={<Button icon={Plus} onClick={openNew}>Talaba qo'shish</Button>}
      />

      <div className="panel mb-5 grid gap-3 rounded-xl p-4 md:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input className="pl-10" placeholder="Talaba, telefon yoki guruh bo'yicha qidirish..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Barcha to'lov holatlari</option>
          <option value="paid">To'langan</option>
          <option value="unpaid">To'lanmagan</option>
          <option value="debt">Qarzdor</option>
        </Select>
        <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
          <option value="all">Barcha fanlar</option>
          {subjects.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
        </Select>
      </div>

      <DataTable
        data={filtered}
        columns={[
          { key: 'fullName', label: 'F.I.Sh.', render: (row) => <Link className="font-bold text-brand-700 dark:text-brand-100" to={`/students/${row.id}`}>{row.fullName}</Link> },
          { key: 'phone', label: 'Telefon' },
          { key: 'subject', label: 'Fan' },
          { key: 'group', label: 'Guruh' },
          { key: 'teacherName', label: "O'qituvchi ismi" },
          { key: 'monthlyFee', label: 'Oylik to‘lov', render: (row) => formatMoney(row.monthlyFee) },
          { key: 'paymentStatus', label: "To'lov", render: (row) => <Badge tone={row.paymentStatus}>{row.paymentStatus}</Badge> },
          { key: 'actions', label: 'Amallar', render: (row) => (
            <div className="flex gap-2">
              <Link to={`/students/${row.id}`}><Button variant="secondary" className="h-9 w-9 p-0" icon={Eye} aria-label="Ko'rish" /></Link>
              <Button variant="secondary" className="h-9 w-9 p-0" icon={Edit} onClick={() => openEdit(row)} aria-label="Tahrirlash" />
              <Button variant="danger" className="h-9 w-9 p-0" icon={Trash2} onClick={() => setConfirmId(row.id)} aria-label="O'chirish" />
            </div>
          ) },
        ]}
      />

      <Modal open={Boolean(editing)} title={editing?.mode === 'edit' ? 'Talabani tahrirlash' : "Talaba qo'shish"} onClose={() => setEditing(null)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="F.I.Sh."><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Field>
          <Field label="Telefon raqam"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></Field>
          <Field label="Ota-ona telefoni"><Input value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} /></Field>
          <Field label="Fan"><Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required><option value="">Fanni tanlang</option>{subjects.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="Guruh"><Select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} required><option value="">Guruhni tanlang</option>{groups.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="O'qituvchi ismi"><Input value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} required /></Field>
          <Field label="Oylik to'lov"><Input type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} required /></Field>
          <Field label="To'lov holati"><Select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}><option value="paid">To'langan</option><option value="unpaid">To'lanmagan</option><option value="debt">Qarzdor</option></Select></Field>
          <Field label="Davomat %"><Input type="number" min="0" max="100" value={form.attendance} onChange={(e) => setForm({ ...form, attendance: e.target.value })} /></Field>
          <Field label="Qo'shilgan sana"><Input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Izohlar"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Bekor qilish</Button>
            <Button type="submit">Talabani saqlash</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Talabani o'chirasizmi?"
        description="Tanlangan talaba ro'yxatdan o'chiriladi. Amalni tasdiqlang."
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteStudent(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
