import React from 'react';
import DateTable from './DateTable';
import '../css/Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <DateTable />
    </div>
  );
};

export default Dashboard;
