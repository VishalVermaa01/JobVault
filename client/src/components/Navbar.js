import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav style={{
      background: 'linear-gradient(90deg, #2980ef 0%, #66a6ff 100%)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: 24
    }}>
      <div style={{ fontWeight: 700, color: '#fff', fontSize: 22, letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate('/jobs')}>JobChain</div>
      <div style={{ display: 'flex', gap: 18 }}>
        <button onClick={() => navigate('/profile')} style={navBtnStyle}>Profile</button>
        <button onClick={() => navigate('/jobs')} style={navBtnStyle}>Job Feed</button>
        {role !== 'recruiter' && <button onClick={() => navigate('/applied')} style={navBtnStyle}>Applied Jobs</button>}
        {role === 'recruiter' && <button onClick={() => navigate('/post')} style={navBtnStyle}>Post Job</button>}
        <button onClick={onLogout} style={{ ...navBtnStyle, background: '#e74c3c', color: '#fff' }}>Logout</button>
      </div>
    </nav>
  );
};

const navBtnStyle = {
  background: '#fff',
  color: '#2980ef',
  border: 'none',
  borderRadius: 6,
  padding: '7px 18px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
};

export default Navbar;
