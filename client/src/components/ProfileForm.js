import React, { useState, useEffect } from 'react';
import { getRizeTokenBalance } from '../utils/token';

const ProfileForm = ({ onLogout }) => {
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    jobType: '',
    salary: '',
    bio: '',
    linkedin: '',
    skills: [],
    walletAddress: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage] = useState('');
  const [rizeBalance, setRizeBalance] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          company: data.company || '',
          jobType: data.jobType || '',
          salary: data.salary || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          skills: data.skills || [],
          walletAddress: data.walletAddress || ''
        });
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      if (profile.walletAddress && profile.walletAddress.length === 42) {
        try {
          const bal = await getRizeTokenBalance(profile.walletAddress);
          setRizeBalance(bal);
        } catch (e) {
          setRizeBalance('Error');
        }
      } else {
        setRizeBalance(null);
      }
    }
    fetchBalance();
  }, [profile.walletAddress]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setProfile(p => ({ ...p, walletAddress: accounts[0] }));
      } catch (err) {
        setMessage('Wallet connection failed');
      }
    } else {
      setMessage('MetaMask not found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    if (res.ok) setMessage('Profile updated!');
    else setMessage('Error updating profile');
  };

  // Only show resume upload for seekers
  const userRole = localStorage.getItem('userRole');

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage('Parsing resume...');
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch('http://localhost:5000/api/resume/parse', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      const parsed = data.parsed || {};
      const rawText = data.rawText || '';
      setProfile(p => {
        // Compose skills: only accept array of strings, filter out objects/empty/duplicates
        let skills = p.skills;
        if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
          skills = parsed.skills.filter(s => typeof s === 'string' && s.length > 1);
          skills = Array.from(new Set([...p.skills, ...skills])).slice(0, 10);
        } else if (rawText) {
          // fallback: extract likely skills from text, but avoid numbers and common words
          const words = rawText.match(/\b([A-Za-z]{3,})\b/g)?.filter(w => w.length > 2) || [];
          skills = Array.from(new Set([...p.skills, ...words])).slice(0, 10);
        }
        // Compose bio
        let bio = p.bio || '';
        if (parsed.experience && Array.isArray(parsed.experience) && parsed.experience.length > 0) {
          const exp = parsed.experience[0];
          bio = `${exp.title || ''}${exp.title && exp.company ? ' at ' : ''}${exp.company || ''}`.trim();
        } else if (parsed.education && Array.isArray(parsed.education) && parsed.education.length > 0) {
          const edu = parsed.education[0];
          bio = `${edu.degree || ''}${edu.degree && edu.school ? ' at ' : ''}${edu.school || ''}`.trim();
        } else if (!bio && rawText) {
          bio = rawText.slice(0, 300);
        }
        // Compose LinkedIn
        let linkedin = p.linkedin || '';
        if (!linkedin && rawText) {
          const match = rawText.match(/linkedin\.com\/[a-zA-Z0-9\-_/]+/i);
          if (match) linkedin = 'https://' + match[0];
        }
        return {
          ...p,
          name: parsed.fullName || p.name || '',
          bio: bio.slice(0, 300),
          skills,
          linkedin,
        };
      });
      setMessage('Resume parsed! Please review and edit as needed.');
    } else {
      setMessage('Failed to parse resume');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: '2.5rem 2.5rem',
        minWidth: 360,
        maxWidth: 440,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#2980ef', marginBottom: 24 }}>Edit Profile</h2>
        {profile.walletAddress && (
          <div style={{ marginBottom: 12, color: '#2980ef', fontWeight: 500 }}>
            RIZE Balance: {rizeBalance === null ? '...' : rizeBalance}
          </div>
        )}
        {userRole === 'seeker' && (
          <div style={{ width: '100%', marginBottom: 18 }}>
            <label style={{ fontWeight: 500, color: '#2980ef' }}>Upload Resume (PDF):</label>
            <input type="file" accept="application/pdf" onChange={handleResumeUpload} style={{ marginTop: 8 }} />
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input
            type="text"
            name="name"
            placeholder={userRole === 'recruiter' ? 'Recruiter Name' : 'Full Name'}
            value={profile.name}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          />
          {userRole === 'recruiter' && (
            <>
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={profile.company}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
              />
              <input
                type="text"
                name="jobType"
                placeholder="Job Type (e.g. Full-time, Part-time)"
                value={profile.jobType}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
              />
              <input
                type="text"
                name="salary"
                placeholder="Salary Range"
                value={profile.salary}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
              />
            </>
          )}
        {userRole !== 'recruiter' && (
            <>
              <textarea
                name="bio"
                placeholder="Short Bio"
                value={profile.bio}
                onChange={handleChange}
                rows={3}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff', resize: 'vertical' }}
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={profile.linkedin}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
              />
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, color: '#2980ef' }}>Skills:</label>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', padding: 0, margin: '8px 0' }}>
                  {profile.skills.map(skill => (
                    <li key={skill} style={{ background: '#e3f0fc', borderRadius: 16, padding: '4px 12px', display: 'flex', alignItems: 'center' }}>
                      {skill} <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ marginLeft: 6, background: 'none', border: 'none', color: '#e74c3c', fontWeight: 700, cursor: 'pointer' }}>×</button>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Add skill"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
                  />
                  <button type="button" onClick={handleAddSkill} style={{
                    background: 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>Add</button>
                </div>
              </div>
            </>
          )}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, color: '#2980ef' }}>Wallet Address:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                name="walletAddress"
                value={profile.walletAddress || ''}
                onChange={e => setProfile(p => ({ ...p, walletAddress: e.target.value }))}
                style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
                placeholder="0x..."
              />
              <button type="button" onClick={handleConnectWallet} style={{
                background: 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>Connect</button>
            </div>
          </div>
          <button type="submit" style={{
            background: 'linear-gradient(90deg, #2980ef 0%, #66a6ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 0',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 8
          }}>Save Profile</button>
        </form>
        {message && <p style={{ color: '#27ae60', marginTop: 12 }}>{message}</p>}
        <button onClick={onLogout} style={{
          marginTop: 24,
          background: 'none',
          border: 'none',
          color: '#e74c3c',
          fontWeight: 500,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileForm;
