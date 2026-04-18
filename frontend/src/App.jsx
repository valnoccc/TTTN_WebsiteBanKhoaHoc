import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('access_token');

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" />;
  return children;
};

const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" />;
  if (user.role === 'GIANG_VIEN') return <Navigate to="/instructor" />;
  return <Navigate to="/student" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={
          <RoleBasedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>
        } />
        <Route path="/instructor" element={
          <RoleBasedRoute allowedRoles={['GIANG_VIEN']}><InstructorDashboard /></RoleBasedRoute>
        } />
        <Route path="/student" element={
          <RoleBasedRoute allowedRoles={['HOC_VIEN']}><StudentDashboard /></RoleBasedRoute>
        } />

        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;