import { useMemo, useState } from 'react';
import { Edit, Plus, Trash2, UserRoundCog } from 'lucide-react';
import { Chip, Grow } from '@mui/material';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Badge from '../components/ui/Badge.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { Field, Input, Select, Textarea } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';

const blankTeacher = { fullName: '', phone: '', subject: '', percent: 40, status: 'active', notes: '' };

export default function Teachers() {
  const { teachers, students, subjects, addTeacher, updateTeacher, deleteTeacher } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState(blankTeacher);

  const activeTeachers = teachers.filter((teacher) => teacher.status === 'active').length;
  const totalStudents = useMemo(() => students.filter((student) => teachers.some((teacher) => teacher.fullName === student.teacherName)).length, [students, teachers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankTeacher);
    setOpen(true);
  };

  const openEdit = (teacher) => {
    setEditingId(teacher.id);
    setForm(teacher);
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (editingId) await updateTeacher(editingId, form);
    else await addTeacher(form);
    setOpen(false);
  };

  const confirmedTeacher = teachers.find((teacher) => teacher.id === confirmId);

  return (
    <>
      <PageHeader
        title="O'qituvchilar"
        description="Direktor o'qituvchilarni alohida qo'shadi. O'qituvchi login qilmaydi, faqat CRM ichida hisob-kitob uchun ishlatiladi."
        actions={<Button icon={Plus} onClick={openCreate}>O'qituvchi qo'shish</Button>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Grow in timeout={250}><div><StatCard title="Jami o'qituvchilar" value={teachers.length} icon={UserRoundCog} /></div></Grow>
        <Grow in timeout={400}><div><StatCard title="Faol o'qituvchilar" value={activeTeachers} icon={UserRoundCog} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100" /></div></Grow>
        <Grow in timeout={550}><div><StatCard title="Biriktirilgan talabalar" value={totalStudents} icon={UserRoundCog} tone="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100" /></div></Grow>
      </div>

      <DataTable
        data={teachers}
        columns={[
          { key: 'fullName', label: "O'qituvchi" },
          { key: 'phone', label: 'Telefon' },
          { key: 'subject', label: 'Fan' },
          { key: 'percent', label: 'Foiz', render: (row) => <Chip size="small" label={`${row.percent}%`} color="info" variant="outlined" /> },
          { key: 'students', label: 'Talabalar', render: (row) => students.filter((student) => student.teacherName === row.fullName).length },
          { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
          { key: 'actions', label: 'Amallar', render: (row) => (
            <div className="flex gap-2">
              <Button variant="secondary" className="h-9 w-9 p-0" icon={Edit} onClick={() => openEdit(row)} aria-label="Tahrirlash" />
              <Button variant="danger" className="h-9 w-9 p-0" icon={Trash2} onClick={() => setConfirmId(row.id)} aria-label="O'chirish" />
            </div>
          ) },
        ]}
      />

      <Modal open={open} title={editingId ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="F.I.Sh."><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Field>
          <Field label="Telefon"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Fan"><Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required><option value="">Fanni tanlang</option>{subjects.map((subject) => <option key={subject.id}>{subject.name}</option>)}</Select></Field>
          <Field label="Oylik foizi"><Input type="number" min="0" max="100" value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} required /></Field>
          <Field label="Holat"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Faol</option><option value="inactive">Nofaol</option></Select></Field>
          <div className="md:col-span-2"><Field label="Izoh"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field></div>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">Saqlash</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="O'qituvchini o'chirasizmi?"
        description={`${confirmedTeacher?.fullName || "Tanlangan o'qituvchi"} o'chiriladi. Bu amalni tasdiqlang.`}
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteTeacher(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
