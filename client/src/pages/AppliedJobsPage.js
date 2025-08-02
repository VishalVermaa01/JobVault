import React, { useEffect, useState } from 'react';
import { fetchAppliedJobs } from '../api/jobs';

const AppliedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAppliedJobs();
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch applied jobs');
      }
      setLoading(false);
    };
    getJobs();
  }, []);

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', padding: '2rem' }}>
      <h2 style={{ color: '#2980ef', marginBottom: 24 }}>Applied Jobs</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>You have not applied to any jobs yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobsPage;
