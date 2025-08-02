import React, { useEffect, useState } from 'react';

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ skill: '', location: '', tag: '' });
  const [applyStatus, setApplyStatus] = useState({});
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      const params = new URLSearchParams();
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.location) params.append('location', filters.location);
      if (filters.tag) params.append('tag', filters.tag);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
    // eslint-disable-next-line
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = async (jobId) => {
    setApplyStatus(s => ({ ...s, [jobId]: 'loading' }));
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setApplyStatus(s => ({ ...s, [jobId]: 'applied' }));
    } else {
      setApplyStatus(s => ({ ...s, [jobId]: data.message || 'error' }));
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2.5rem auto', padding: '0 1rem' }}>
      <h2 style={{ color: '#2980ef', marginBottom: 24, fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>Job Feed</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        <input
          type="text"
          name="skill"
          placeholder="Filter by skill"
          value={filters.skill}
          onChange={handleChange}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', background: '#f8faff', fontSize: 16 }}
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleChange}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', background: '#f8faff', fontSize: 16 }}
        />
        <input
          type="text"
          name="tag"
          placeholder="Filter by tag"
          value={filters.tag}
          onChange={handleChange}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', background: '#f8faff', fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
        {jobs.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No jobs found.</p>}
        {jobs.map(job => (
          <div key={job._id} style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 18px rgba(41,128,239,0.08)',
            padding: '2rem 2rem 1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 220,
            position: 'relative',
            border: '1px solid #e0e7ef',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#2980ef' }}>{job.title}</span>
              {job.tags && job.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {job.tags.map(tag => (
                    <span key={tag} style={{ background: '#e3f0fc', color: '#2980ef', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ color: '#444', fontSize: 15, marginBottom: 8, minHeight: 48 }}>{job.description}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
              {job.skills && job.skills.map(skill => (
                <span key={skill} style={{ background: '#f6d365', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 18 }}>
                <span style={{ color: '#888', fontSize: 14 }}>Location: <b style={{ color: '#333' }}>{job.location || 'Remote'}</b></span>
                <span style={{ color: '#888', fontSize: 14 }}>Budget: <b style={{ color: '#333' }}>{job.budget || 'N/A'}</b></span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
              {isAuthenticated && (
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applyStatus[job._id] === 'applied' || applyStatus[job._id] === 'loading'}
                  style={{
                    background: applyStatus[job._id] === 'applied' ? '#27ae60' : 'linear-gradient(90deg, #2980ef 0%, #66a6ff 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 22px',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: applyStatus[job._id] === 'applied' ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 4px rgba(41,128,239,0.08)'
                  }}
                >
                  {applyStatus[job._id] === 'applied' ? 'Applied' : applyStatus[job._id] === 'loading' ? 'Applying...' : 'Apply'}
                </button>
              )}
              {applyStatus[job._id] && applyStatus[job._id] !== 'applied' && applyStatus[job._id] !== 'loading' && (
                <span style={{ color: '#e74c3c', fontSize: 14 }}>{applyStatus[job._id]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;
