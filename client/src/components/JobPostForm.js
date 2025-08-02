import React, { useState } from 'react';
import { ethers } from 'ethers';

const JobPostForm = ({ onJobPosted }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    budget: '',
    location: '',
    tags: ''
  });
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('not_paid'); // not_paid | pending | paid
  const [txHash, setTxHash] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      setMessage('MetaMask not found');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setMessage('Wallet connected');
    } catch (err) {
      setMessage('Wallet connection failed');
    }
  };

  const handlePayFee = async () => {
    if (!window.ethereum) {
      setMessage('MetaMask not found');
      return;
    }
    try {
      setPaymentStatus('pending');
      setMessage('Awaiting payment confirmation...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const adminAddress = process.env.REACT_APP_ADMIN_ETH_ADDRESS;
      const tx = await signer.sendTransaction({
        to: adminAddress,
        value: ethers.parseEther('0.001')
      });
      await tx.wait();
      setTxHash(tx.hash);
      setPaymentStatus('paid');
      setMessage('Payment successful! You can now post a job.');
    } catch (err) {
      setPaymentStatus('not_paid');
      setMessage('Payment failed or cancelled');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (paymentStatus !== 'paid') {
      setMessage('Please pay the platform fee before posting a job.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        walletAddress,
        paymentTxHash: txHash
      })
    });
    if (res.ok) {
      setMessage('Job posted!');
      setForm({ title: '', description: '', skills: '', budget: '', location: '', tags: '' });
      if (onJobPosted) onJobPosted();
    } else {
      setMessage('Error posting job');
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      padding: '2rem 2.5rem',
      minWidth: 340,
      maxWidth: 440,
      width: '100%',
      margin: '2rem auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h2 style={{ color: '#2980ef', marginBottom: 24 }}>Post a Job</h2>
      <div style={{ width: '100%', marginBottom: 16 }}>
        <button
          type="button"
          onClick={handleConnectWallet}
          style={{
            background: walletAddress ? '#27ae60' : 'linear-gradient(90deg, #fda085 0%, #f6d365 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 0',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            width: '100%'
          }}
          disabled={!!walletAddress}
        >
          {walletAddress ? `Wallet Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
      <div style={{ width: '100%', marginBottom: 16 }}>
        <button
          type="button"
          onClick={handlePayFee}
          style={{
            background: paymentStatus === 'paid' ? '#27ae60' : 'linear-gradient(90deg, #2980ef 0%, #66a6ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 0',
            fontWeight: 600,
            fontSize: 15,
            cursor: paymentStatus === 'paid' ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
          disabled={!walletAddress || paymentStatus === 'paid' || paymentStatus === 'pending'}
        >
          {paymentStatus === 'paid' ? 'Fee Paid' : paymentStatus === 'pending' ? 'Paying...' : 'Pay Platform Fee (0.001 ETH)'}
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          disabled={paymentStatus !== 'paid'}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff', resize: 'vertical' }}
          disabled={paymentStatus !== 'paid'}
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          disabled={paymentStatus !== 'paid'}
        />
        <input
          type="text"
          name="budget"
          placeholder="Budget/Salary"
          value={form.budget}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          disabled={paymentStatus !== 'paid'}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          disabled={paymentStatus !== 'paid'}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #eee', background: '#f8faff' }}
          disabled={paymentStatus !== 'paid'}
        />
        <button type="submit" style={{
          background: 'linear-gradient(90deg, #2980ef 0%, #66a6ff 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 0',
          fontWeight: 600,
          fontSize: 16,
          cursor: paymentStatus !== 'paid' ? 'not-allowed' : 'pointer',
          marginTop: 8
        }} disabled={paymentStatus !== 'paid'}>Post Job</button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? '#e74c3c' : '#27ae60', marginTop: 12 }}>{message}</p>}
      {txHash && <p style={{ fontSize: 13, color: '#888' }}>Tx Hash: {txHash}</p>}
    </div>
  );
};

export default JobPostForm;
