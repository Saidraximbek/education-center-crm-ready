import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import Groups from './pages/Groups.jsx';
import Subjects from './pages/Subjects.jsx';
import Teachers from './pages/Teachers.jsx';
import Payments from './pages/Payments.jsx';
import TeacherSalaries from './pages/TeacherSalaries.jsx';
import Expenses from './pages/Expenses.jsx';
import Attendance from './pages/Attendance.jsx';
import Admins from './pages/Admins.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:studentId" element={<StudentProfile />} />
        <Route path="groups" element={<Groups />} />
        <Route path="subjects" element={<Subjects />} />
        <Route
          path="teachers"
          element={
            <ProtectedRoute roles={['director']}>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route path="payments" element={<Payments />} />
        <Route path="teacher-salaries" element={<TeacherSalaries />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="attendance" element={<Attendance />} />
        <Route
          path="admins"
          element={
            <ProtectedRoute roles={['director']}>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute roles={['director']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
