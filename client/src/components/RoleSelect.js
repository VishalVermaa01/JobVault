import React from 'react';

const RoleSelect = ({ onSelect }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      padding: '2.5rem 2.5rem',
      minWidth: 340,
      maxWidth: 400,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h2 style={{ color: '#f76b1c', marginBottom: 24 }}>What brings you here?</h2>
      <button
        onClick={() => onSelect('seeker')}
        style={{
          background: 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 0',
          fontWeight: 600,
          fontSize: 18,
          cursor: 'pointer',
          width: '100%',
          marginBottom: 18
        }}
      >
        I am looking for a job
      </button>
      <button
        onClick={() => onSelect('recruiter')}
        style={{
          background: 'linear-gradient(90deg, #fda085 0%, #f6d365 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 0',
          fontWeight: 600,
          fontSize: 18,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        I want to post a job
      </button>
    </div>
  </div>
);

export default RoleSelect;
