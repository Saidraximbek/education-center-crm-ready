import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  adminsSeed,
  attendanceSeed,
  expensesSeed,
  groupsSeed,
  paymentsSeed,
  studentsSeed,
  subjectsSeed,
  teacherSalariesSeed,
  teachersSeed,
} from '../data/demoData.js';
import { createDocument, deleteDocument, listDocuments, updateDocument } from '../services/firestoreService.js';

const byId = (items, id) => items.find((item) => item.id === id);
const makeId = (prefix) => `${prefix}-${crypto.randomUUID?.() || Date.now()}`;

export const useCrmStore = create((set, get) => ({
  students: studentsSeed,
  groups: groupsSeed,
  subjects: subjectsSeed,
  payments: paymentsSeed,
  attendance: attendanceSeed,
  admins: adminsSeed,
  teachers: teachersSeed,
  teacherSalaries: teacherSalariesSeed,
  expenses: expensesSeed,
  isLoading: false,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const [students, groups, subjects, payments, attendance, admins, teachers, teacherSalaries, expenses] = await Promise.all([
        listDocuments('students'),
        listDocuments('groups'),
        listDocuments('subjects'),
        listDocuments('payments'),
        listDocuments('attendance'),
        listDocuments('users'),
        listDocuments('teachers'),
        listDocuments('teacherSalaries'),
        listDocuments('expenses'),
      ]);

      set({
        students: students.length ? students : studentsSeed,
        groups: groups.length ? groups : groupsSeed,
        subjects: subjects.length ? subjects : subjectsSeed,
        payments: payments.length ? payments : paymentsSeed,
        attendance: attendance.length ? attendance : attendanceSeed,
        admins: admins.length ? admins : adminsSeed,
        teachers: teachers.length ? teachers : teachersSeed,
        teacherSalaries: teacherSalaries.length ? teacherSalaries : teacherSalariesSeed,
        expenses: expenses.length ? expenses : expensesSeed,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.message || "Firebase'dan ma'lumot o'qib bo'lmadi");
    }
  },

  addStudent: async (student) => {
    const item = { ...student, id: makeId('stu') };
    await createDocument('students', item);
    set((state) => ({ students: [item, ...state.students] }));
    toast.success("Talaba qo'shildi");
  },
  updateStudent: async (id, updates) => {
    await updateDocument('students', id, updates);
    set((state) => ({ students: state.students.map((item) => (item.id === id ? { ...item, ...updates } : item)) }));
    toast.success('Talaba yangilandi');
  },
  deleteStudent: async (id) => {
    await deleteDocument('students', id);
    set((state) => ({ students: state.students.filter((item) => item.id !== id) }));
    toast.success("Talaba o'chirildi");
  },

  addGroup: async (group) => {
    const item = { ...group, id: makeId('grp'), active: group.active ?? true };
    await createDocument('groups', item);
    set((state) => ({ groups: [item, ...state.groups] }));
    toast.success('Guruh yaratildi');
  },
  updateGroup: async (id, updates) => {
    await updateDocument('groups', id, updates);
    set((state) => ({ groups: state.groups.map((item) => (item.id === id ? { ...item, ...updates } : item)) }));
    toast.success('Guruh yangilandi');
  },
  deleteGroup: async (id) => {
    await deleteDocument('groups', id);
    set((state) => ({ groups: state.groups.filter((item) => item.id !== id) }));
    toast.success("Guruh o'chirildi");
  },

  addSubject: async (subject) => {
    const item = { ...subject, id: makeId('sub'), status: subject.status || 'active' };
    await createDocument('subjects', item);
    set((state) => ({ subjects: [item, ...state.subjects] }));
    toast.success('Fan saqlandi');
  },

  addTeacher: async (teacher) => {
    const item = { ...teacher, id: makeId('teach'), percent: Number(teacher.percent || 0), status: teacher.status || 'active' };
    await createDocument('teachers', item);
    set((state) => ({ teachers: [item, ...state.teachers] }));
    toast.success("O'qituvchi qo'shildi");
  },
  updateTeacher: async (id, updates) => {
    const payload = { ...updates, percent: Number(updates.percent || 0) };
    await updateDocument('teachers', id, payload);
    set((state) => ({ teachers: state.teachers.map((item) => (item.id === id ? { ...item, ...payload } : item)) }));
    toast.success("O'qituvchi yangilandi");
  },
  deleteTeacher: async (id) => {
    await deleteDocument('teachers', id);
    set((state) => ({ teachers: state.teachers.filter((item) => item.id !== id) }));
    toast.success("O'qituvchi o'chirildi");
  },

  addPayment: async (payment) => {
    const student = byId(get().students, payment.studentId);
    const item = { ...payment, id: makeId('pay'), studentName: student?.fullName || payment.studentName };
    await createDocument('payments', item);
    set((state) => ({
      payments: [item, ...state.payments],
      students: state.students.map((stu) =>
        stu.id === payment.studentId ? { ...stu, paymentStatus: payment.status } : stu,
      ),
    }));
    toast.success("To'lov yozildi");
  },

  saveTeacherSalary: async (salary) => {
    const existing = get().teacherSalaries.find(
      (item) => item.teacherName === salary.teacherName && item.month === salary.month,
    );
    const item = { ...existing, ...salary, id: existing?.id || makeId('salary'), approvalStatus: 'pending' };
    await createDocument('teacherSalaries', item);
    set((state) => ({
      teacherSalaries: existing
        ? state.teacherSalaries.map((record) => (record.id === existing.id ? item : record))
        : [item, ...state.teacherSalaries],
    }));
    toast.success("O'qituvchi oyligi saqlandi");
  },
  approveTeacherSalary: async (id, approvalStatus) => {
    await updateDocument('teacherSalaries', id, { approvalStatus });
    set((state) => ({
      teacherSalaries: state.teacherSalaries.map((item) => (item.id === id ? { ...item, approvalStatus } : item)),
    }));
    toast.success(approvalStatus === 'approved' ? 'Oylik tasdiqlandi' : 'Oylik rad etildi');
  },

  addExpense: async (expense) => {
    const item = { ...expense, id: makeId('exp'), amount: Number(expense.amount || 0) };
    await createDocument('expenses', item);
    set((state) => ({ expenses: [item, ...state.expenses] }));
    toast.success("Chiqim qo'shildi");
  },
  deleteExpense: async (id) => {
    await deleteDocument('expenses', id);
    set((state) => ({ expenses: state.expenses.filter((item) => item.id !== id) }));
    toast.success("Chiqim o'chirildi");
  },

  markAttendance: async (records) => {
    const dated = records.map((record) => ({ ...record, id: makeId('att') }));
    await Promise.all(dated.map((record) => createDocument('attendance', record)));
    set((state) => ({ attendance: [...dated, ...state.attendance] }));
    toast.success('Davomat saqlandi');
  },

  addAdmin: async (admin) => {
    const item = { ...admin, id: makeId('usr'), role: 'admin', status: 'active' };
    await createDocument('users', item);
    set((state) => ({ admins: [item, ...state.admins] }));
    toast.success('Admin yaratildi');
  },
  updateAdmin: async (id, updates) => {
    await updateDocument('users', id, updates);
    set((state) => ({ admins: state.admins.map((item) => (item.id === id ? { ...item, ...updates } : item)) }));
    toast.success('Admin yangilandi');
  },
  deleteAdmin: async (id) => {
    await deleteDocument('users', id);
    set((state) => ({ admins: state.admins.filter((item) => item.id !== id) }));
    toast.success("Admin o'chirildi");
  },
}));
