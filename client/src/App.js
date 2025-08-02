
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import RoleSelect from './components/RoleSelect';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import JobFeedPage from './pages/JobFeedPage';
import JobPostPage from './pages/JobPostPage';
import AppliedJobsPage from './pages/AppliedJobsPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || '');

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchRole = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiUrl}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.role) {
            setRole(data.role);
            localStorage.setItem('userRole', data.role);
          }
        }
      };
      fetchRole();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRole('');
    localStorage.removeItem('userRole');
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  if (!role) {
    return <RoleSelect onSelect={async r => {
      setRole(r);
      localStorage.setItem('userRole', r);
      // Save role in backend
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: r })
      });
    }} />;
  }

  return (
    <Router>
      <Navbar role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
        <Route path="/jobs" element={<JobFeedPage />} />
        {role !== 'recruiter' && <Route path="/applied" element={<AppliedJobsPage />} />}
        {role === 'recruiter' && <Route path="/post" element={<JobPostPage />} />}
        <Route path="*" element={<Navigate to="/jobs" />} />
      </Routes>
    </Router>
  );
}

export default App;
