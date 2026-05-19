import { useMemo, useState } from 'react';
import { CalendarCheck, Save } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { Select } from '../components/ui/FormFields.jsx';
import { useCrmStore } from '../store/useCrmStore.js';
import { todayISO } from '../utils/format.js';

export default function Attendance() {
  const { groups, students, attendance, markAttendance } = useCrmStore();
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.name || '');
  const [date, setDate] = useState(todayISO());
  const [records, setRecords] = useState({});
  const groupStudents = students.filter((student) => student.group === selectedGroup);

  const monthly = useMemo(() => {
    const present = attendance.filter((item) => item.status === 'present').length;
    const percent = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    return { present, percent };
  }, [attendance]);

  const save = async () => {
    const payload = groupStudents.map((student) => ({
      date,
      group: selectedGroup,
      studentName: student.fullName,
      status: records[student.id] || 'present',
    }));
    await markAttendance(payload);
    setRecords({});
  };

  return (
    <>
      <PageHeader title="Davomat" description="Keldi, kelmadi yoki kechikdi holatini belgilang va kunlik/oylik davomatni ko'ring." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Oylik davomat" value={`${monthly.percent}%`} helper={`${monthly.present} ta kelgan belgi`} icon={CalendarCheck} />
        <div className="panel rounded-xl p-5">
          <span className="label">Guruh</span>
          <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            {groups.map((group) => <option key={group.id}>{group.name}</option>)}
          </Select>
        </div>
        <div className="panel rounded-xl p-5">
          <span className="label">Sana</span>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="panel mb-6 rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold text-slate-950 dark:text-white">Davomat belgilash</h2>
          <Button icon={Save} onClick={save} disabled={!groupStudents.length}>Davomatni saqlash</Button>
        </div>
        <div className="grid gap-3">
          {groupStudents.map((student) => (
            <div key={student.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{student.fullName}</p>
                <p className="text-sm text-slate-500">{student.phone}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:w-80">
                {['present', 'late', 'absent'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setRecords({ ...records, [student.id]: status })}
                    className={`rounded-lg border px-3 py-2 text-sm font-bold capitalize transition ${((records[student.id] || 'present') === status) ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}
                  >
                    {{ present: 'Keldi', late: 'Kechikdi', absent: 'Kelmadi' }[status]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        data={attendance}
        columns={[
          { key: 'date', label: 'Sana' },
          { key: 'group', label: 'Guruh' },
          { key: 'studentName', label: 'Talaba' },
          { key: 'status', label: 'Holat', render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
        ]}
      />
    </>
  );
}
