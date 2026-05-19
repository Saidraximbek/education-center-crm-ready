import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Field, Input, Select } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';

export default function Groups() {
  const { groups, subjects, students, addGroup, deleteGroup, updateGroup } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', schedule: '', room: '', teacherName: '', active: true });

  const submit = async (event) => {
    event.preventDefault();
    await addGroup(form);
    setForm({ name: '', subject: '', schedule: '', room: '', teacherName: '', active: true });
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Guruhlar" description="Guruh, jadval, xona, o'qituvchi ismi va faol holatini boshqaring." actions={<Button icon={Plus} onClick={() => setOpen(true)}>Guruh yaratish</Button>} />
      <DataTable
        data={groups}
        columns={[
          { key: 'name', label: 'Guruh' },
          { key: 'subject', label: 'Fan' },
          { key: 'schedule', label: 'Jadval' },
          { key: 'room', label: 'Xona' },
          { key: 'teacherName', label: "O'qituvchi ismi" },
          { key: 'students', label: 'Talabalar', render: (row) => students.filter((student) => student.group === row.name).length },
          { key: 'active', label: 'Holat', render: (row) => <button onClick={() => updateGroup(row.id, { active: !row.active })}><Badge tone={row.active ? 'active' : 'inactive'}>{row.active ? 'active' : 'inactive'}</Badge></button> },
          { key: 'actions', label: 'Amallar', render: (row) => <Button variant="danger" className="h-9 w-9 p-0" icon={Trash2} onClick={() => setConfirmId(row.id)} aria-label="Guruhni o'chirish" /> },
        ]}
      />

      <Modal open={open} title="Guruh yaratish" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Guruh nomi"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Fan"><Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required><option value="">Fanni tanlang</option>{subjects.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field>
          <Field label="Jadval"><Input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Du/Chor/Juma 09:00" required /></Field>
          <Field label="Xona"><Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} required /></Field>
          <Field label="O'qituvchi ismi"><Input value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} required /></Field>
          <Field label="Holat"><Select value={String(form.active)} onChange={(e) => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Faol</option><option value="false">Nofaol</option></Select></Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">Guruhni saqlash</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Guruhni o'chirasizmi?"
        description="Tanlangan guruh o'chiriladi. Amalni tasdiqlang."
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteGroup(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
