import API from '../api';

export const fetchAppliedJobs = async () => {
  const res = await API.get('/jobs/applied');
  return res.data;
};
