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

import Settings from './pages/Settings.jsx';

import UsersList from './pages/users/UsersList.jsx';
import UserForm from './pages/users/UserForm.jsx';
import UserDetails from './pages/users/UserDetails.jsx';

import PermissionsList from './pages/permissions/PermissionsList.jsx';
import PermissionForm from './pages/permissions/PermissionForm.jsx';
import PermissionDetails from './pages/permissions/PermissionDetails.jsx';

import RolesList from './pages/roles/RolesList.jsx';
import RoleForm from './pages/roles/RoleForm.jsx';
import RoleDetails from './pages/roles/RoleDetails.jsx';

import MasterDataList from './pages/master-data/MasterDataList.jsx';
import MasterDataForm from './pages/master-data/MasterDataForm.jsx';
import MasterDataDetails from './pages/master-data/MasterDataDetails.jsx';
import MasterDataImport from './pages/master-data/MasterDataImport.jsx';



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
              <Route path="/settings" element={<Settings />} />
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

              <Route path="/master-data" element={<MasterDataList />} />
              <Route path="/master-data/create" element={<MasterDataForm />} />
              <Route path="/master-data/:id/edit" element={<MasterDataForm />} />
              <Route path="/master-data/:id" element={<MasterDataDetails />} />
              <Route path="/master-data/import" element={<MasterDataImport />} />
          </Route>
          {/* <Route path="*" element={<div className="p-6">Not Found</div>} /> */}
        </Routes>
    </PermissionsProvider>
  )
}

export default App
