import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Field, Input, Select } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { formatMoney } from '../utils/format.js';

export default function Subjects() {
  const { subjects, groups, addSubject } = useCrmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', level: '', monthlyFee: '', status: 'active' });

  const submit = async (event) => {
    event.preventDefault();
    await addSubject({ ...form, monthlyFee: Number(form.monthlyFee) });
    setForm({ name: '', level: '', monthlyFee: '', status: 'active' });
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Fanlar" description="O'quv dasturlari va standart oylik to'lovlarni boshqaring." actions={<Button icon={Plus} onClick={() => setOpen(true)}>Fan qo'shish</Button>} />
      <DataTable
        data={subjects}
        columns={[
          { key: 'name', label: 'Fan' },
          { key: 'level', label: 'Daraja' },
          { key: 'monthlyFee', label: "Oylik to'lov", render: (row) => formatMoney(row.monthlyFee) },
          { key: 'groups', label: 'Guruhlar', render: (row) => groups.filter((group) => group.subject === row.name).length },
          { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
        ]}
      />
      <Modal open={open} title="Fan qo'shish" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Fan nomi"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Daraja"><Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required /></Field>
          <Field label="Oylik to'lov"><Input type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} required /></Field>
          <Field label="Holat"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Faol</option><option value="inactive">Nofaol</option></Select></Field>
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="submit">Fanni saqlash</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
