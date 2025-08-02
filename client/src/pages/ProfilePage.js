import React from 'react';
import ProfileForm from '../components/ProfileForm';

const ProfilePage = ({ onLogout }) => (
  <div style={{ background: '#f8faff', minHeight: '100vh' }}>
    <ProfileForm onLogout={onLogout} />
  </div>
);

export default ProfilePage;
