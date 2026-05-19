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

export default function Admins() {
  const { admins, addAdmin, updateAdmin, deleteAdmin } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', status: 'active' });

  const submit = async (event) => {
    event.preventDefault();
    await addAdmin(form);
    setForm({ fullName: '', email: '', status: 'active' });
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Admin boshqaruvi" description="Adminlarni yaratish, tahrirlash va o'chirish faqat Direktor uchun ochiq." actions={<Button icon={Plus} onClick={() => setOpen(true)}>Admin yaratish</Button>} />
      <DataTable
        data={admins}
        columns={[
          { key: 'fullName', label: 'F.I.Sh.' },
          { key: 'email', label: 'Elektron pochta' },
          { key: 'role', label: 'Rol', render: (row) => <Badge tone={row.role}>{row.role}</Badge> },
          { key: 'status', label: 'Holat', render: (row) => <button disabled={row.role === 'director'} onClick={() => updateAdmin(row.id, { status: row.status === 'active' ? 'inactive' : 'active' })}><Badge tone={row.status}>{row.status}</Badge></button> },
          { key: 'actions', label: 'Amallar', render: (row) => row.role === 'director' ? '-' : <Button variant="danger" className="h-9 w-9 p-0" icon={Trash2} onClick={() => setConfirmId(row.id)} aria-label="Adminni o'chirish" /> },
        ]}
      />
      <Modal open={open} title="Admin yaratish" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="F.I.Sh."><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></Field>
          <Field label="Elektron pochta"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <Field label="Holat"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Faol</option><option value="inactive">Nofaol</option></Select></Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">Admin yaratish</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Adminni o'chirasizmi?"
        description="Tanlangan admin o'chiriladi. Amalni tasdiqlang."
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteAdmin(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
