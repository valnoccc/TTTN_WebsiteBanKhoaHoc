import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access_token');

    if (!token) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

    return children;
}