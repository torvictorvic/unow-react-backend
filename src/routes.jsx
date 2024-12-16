import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeEdit from './pages/EmployeeEdit';
import EmployeeOwnProfile from './pages/EmployeeOwnProfile';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, roles } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  //if (allowedRoles && allowedRoles.length > 0 && !roles.some(r => allowedRoles.includes(r))) {
  if (allowedRoles && allowedRoles === "") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Usuarios con rol "USUARIO" */}
      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={['USUARIO']}>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/employees" element={
        <PrivateRoute allowedRoles={['USUARIO']}>
          <EmployeeList />
        </PrivateRoute>
      } />

      <Route path="/employees/new" element={
        <PrivateRoute allowedRoles={['USUARIO']}>
          <EmployeeForm />
        </PrivateRoute>
      } />

      <Route path="/employees/:id/edit" element={
        <PrivateRoute allowedRoles={['USUARIO']}>
          <EmployeeEdit />
        </PrivateRoute>
      } />

      {/* Empleados con rol "EMPLEADO" */}
      <Route path="/me" element={
        <PrivateRoute allowedRoles={['EMPLEADO']}>
          <EmployeeOwnProfile />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
