import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses'; // <-- THÊM DÒNG NÀY
import InstructorCourseDetail from './pages/instructor/InstructorCourseDetail';
import AddLesson from './pages/instructor/AddLesson';
import StudentDashboard from './pages/student/StudentDashboard';
import HomePage from './pages/HomePage';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '14px', borderRadius: '8px' } }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* TRANG CHỦ CHUNG CHO KHÁCH & HỌC VIÊN */}
        <Route path="/" element={<HomePage />} />

        {/* ADMIN */}
        <Route path="/admin" element={
          <RoleBasedRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>
        } />

        {/* GIẢNG VIÊN - Dashboard tổng quan */}
        <Route path="/instructor" element={
          <RoleBasedRoute allowedRoles={['GIANG_VIEN']}>
            <InstructorDashboard />
          </RoleBasedRoute>
        } />

        {/* GIẢNG VIÊN - Danh sách khóa học (THÊM ĐOẠN NÀY VÀO) */}
        <Route path="/instructor/courses" element={
          <RoleBasedRoute allowedRoles={['GIANG_VIEN']}>
            <InstructorCourses />
          </RoleBasedRoute>
        } />

        {/* GIẢNG VIÊN - Chi tiết khóa học */}
        <Route path="/instructor/courses/:id" element={
          <RoleBasedRoute allowedRoles={['GIANG_VIEN']}>
            <InstructorCourseDetail />
          </RoleBasedRoute>
        } />

        {/* GIẢNG VIÊN - Thêm bài học */}
        <Route path="/instructor/lessons/:id" element={
          <RoleBasedRoute allowedRoles={['GIANG_VIEN']}>
            <AddLesson />
          </RoleBasedRoute>
        } />

        {/* HỌC VIÊN */}
        <Route path="/student" element={
          <RoleBasedRoute allowedRoles={['HOC_VIEN']}><StudentDashboard /></RoleBasedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;