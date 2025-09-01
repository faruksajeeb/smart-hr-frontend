import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PermissionsProvider } from "./context/PermissionsContext";

import Home from './pages/Home.jsx'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import UsersList from './pages/users/UsersList.jsx';
import UserForm from './pages/users/UserForm.jsx';
import UserDetails from './pages/users/UserDetails.jsx';

import PermissionsList from './pages/permissions/PermissionsList.jsx';
import PermissionForm from './pages/permissions/PermissionForm.jsx';
import PermissionDetails from './pages/permissions/PermissionDetails.jsx';

import RolesList from './pages/roles/RolesList.jsx';
import RoleForm from './pages/roles/RoleForm.jsx';
import RoleDetails from './pages/roles/RoleDetails.jsx';



function App() {
 
  return (
    <PermissionsProvider>
        <Routes>
            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              {/* Protected routes */}
              {/* Admin / HR dashboards */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Employee dashboard */}
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<Home />} />
              <Route path="/change-password" element={<Home />} />
              <Route path="/delete-account" element={<Home />} />

              <Route path="/users" element={<UsersList />} />
              <Route path="/users/create" element={<UserForm />} />
              <Route path="/users/:id/edit" element={<UserForm />} />
              <Route path="/users/:id" element={<UserDetails />} />

              <Route path="/permissions" element={<PermissionsList />} />
              <Route path="/permissions/create" element={<PermissionForm />} />
              <Route path="/permissions/:id/edit" element={<PermissionForm />} />
              <Route path="/permissions/:id" element={<PermissionDetails />} />

              <Route path="/roles" element={<RolesList />} />
              <Route path="/roles/create" element={<RoleForm />} />
              <Route path="/roles/:id/edit" element={<RoleForm />} />
              <Route path="/roles/:id" element={<RoleDetails />} />
          </Route>
          {/* <Route path="*" element={<div className="p-6">Not Found</div>} /> */}
        </Routes>
    </PermissionsProvider>
  )
}

export default App
