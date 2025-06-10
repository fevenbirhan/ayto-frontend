import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

interface Government {
  id: string;
  name: string;
  type: 'national' | 'state' | 'local' | 'agency';
  adminUsername: string;
  status: 'active' | 'suspended';
  createdAt: Date;
  email: string;
  jurisdiction?: string;
}

const AdminDashboard: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Government management state
  const [governments, setGovernments] = useState<Government[]>([]);
  const [filteredGovernments, setFilteredGovernments] = useState<Government[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const governmentsPerPage = 10;

  // Form state for creating new government
  const [govName, setGovName] = useState('');
  const [govType, setGovType] = useState<'national' | 'state' | 'local' | 'agency'>('national');
  const [govUsername, setGovUsername] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [govEmail, setGovEmail] = useState('');
  const [govJurisdiction, setGovJurisdiction] = useState('');

  // Mock authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'sysadmin' && adminPassword === 'securepassword123') {
      setIsAuthenticated(true);
      setLoginError('');
      // In a real app, you would set a token or session here
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // Mock data loading
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would be an API call
      const mockGovernments: Government[] = [
        {
          id: '1',
          name: 'United States Federal Government',
          type: 'national',
          adminUsername: 'usadmin',
          status: 'active',
          createdAt: new Date('2020-01-15'),
          email: 'admin@usa.gov',
          jurisdiction: 'United States'
        },
        // Add more mock data as needed
      ];
      setGovernments(mockGovernments);
    }
  }, [isAuthenticated]);

  // Filter and search logic
  useEffect(() => {
    let result = governments;
    
    if (filterStatus !== 'all') {
      result = result.filter(gov => gov.status === filterStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(gov => 
        gov.name.toLowerCase().includes(term) || 
        gov.adminUsername.toLowerCase().includes(term))
    }
    
    setFilteredGovernments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [governments, filterStatus, searchTerm]);

  // Pagination logic
  const indexOfLastGov = currentPage * governmentsPerPage;
  const indexOfFirstGov = indexOfLastGov - governmentsPerPage;
  const currentGovernments = filteredGovernments.slice(indexOfFirstGov, indexOfLastGov);
  const totalPages = Math.ceil(filteredGovernments.length / governmentsPerPage);

  const handleCreateGovernment = (e: React.FormEvent) => {
    e.preventDefault();
    const newGovernment: Government = {
      id: Date.now().toString(),
      name: govName,
      type: govType,
      adminUsername: govUsername,
      status: 'active',
      createdAt: new Date(),
      email: govEmail,
      jurisdiction: govJurisdiction || undefined
    };
    
    setGovernments([...governments, newGovernment]);
    
    // Reset form
    setGovName('');
    setGovType('national');
    setGovUsername('');
    setGovPassword('');
    setGovEmail('');
    setGovJurisdiction('');
  };

  const toggleGovernmentStatus = (id: string) => {
    setGovernments(governments.map(gov => 
      gov.id === id 
        ? { ...gov, status: gov.status === 'active' ? 'suspended' : 'active' } 
        : gov
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>System Administrator Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="adminUsername">Username:</label>
            <input 
              type="text" 
              id="adminUsername" 
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminPassword">Password:</label>
            <input 
              type="password" 
              id="adminPassword" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required 
            />
          </div>
          {loginError && <div className="error-message">{loginError}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="admin-profile">
          <img src="admin-avatar.png" alt="Admin" />
          <span>System Admin</span>
        </div>
        <nav>
          <ul>
            <li className="active"><a href="#dashboard">Dashboard</a></li>
            <li><a href="#create-gov">Create Government</a></li>
            <li><a href="#manage-gov">Manage Governments</a></li>
            <li><a href="#audit-logs">Audit Logs</a></li>
            <li><a href="#admin-settings">Admin Settings</a></li>
            <li><a href="#logout">Logout</a></li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Government Management System</h1>
          <div className="stats">
            <div className="stat-card">
              <h3>Total Governments</h3>
              <p>{governments.length}</p>
            </div>
            <div className="stat-card">
              <h3>Active Governments</h3>
              <p>{governments.filter(g => g.status === 'active').length}</p>
            </div>
            <div className="stat-card">
              <h3>Suspended</h3>
              <p>{governments.filter(g => g.status === 'suspended').length}</p>
            </div>
          </div>
        </div>

        <section id="create-gov-section" className="card">
          <h2>Create New Government Entity</h2>
          <form onSubmit={handleCreateGovernment}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="govName">Government Name</label>
                <input 
                  type="text" 
                  id="govName" 
                  value={govName}
                  onChange={(e) => setGovName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="govType">Government Type</label>
                <select 
                  id="govType" 
                  value={govType}
                  onChange={(e) => setGovType(e.target.value as any)}
                  required
                >
                  <option value="national">National</option>
                  <option value="state">State/Province</option>
                  <option value="local">Local/Municipal</option>
                  <option value="agency">Government Agency</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="govUsername">Admin Username</label>
                <input 
                  type="text" 
                  id="govUsername" 
                  value={govUsername}
                  onChange={(e) => setGovUsername(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="govPassword">Admin Password</label>
                <input 
                  type="password" 
                  id="govPassword" 
                  value={govPassword}
                  onChange={(e) => setGovPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="govEmail">Contact Email</label>
              <input 
                type="email" 
                id="govEmail" 
                value={govEmail}
                onChange={(e) => setGovEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="govJurisdiction">Jurisdiction</label>
              <input 
                type="text" 
                id="govJurisdiction" 
                value={govJurisdiction}
                onChange={(e) => setGovJurisdiction(e.target.value)}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Government</button>
            </div>
          </form>
        </section>

        <section id="manage-gov-section" className="card">
          <h2>Manage Government Entities</h2>
          <div className="table-controls">
            <input 
              type="text" 
              id="govSearch" 
              placeholder="Search governments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              id="govFilter" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Governments</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <table id="governmentsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Admin Username</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGovernments.map(gov => (
                <tr key={gov.id}>
                  <td>{gov.id}</td>
                  <td>{gov.name}</td>
                  <td>{gov.type}</td>
                  <td>{gov.adminUsername}</td>
                  <td>
                    <span className={`status-badge ${gov.status}`}>
                      {gov.status}
                    </span>
                  </td>
                  <td>{gov.createdAt.toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => toggleGovernmentStatus(gov.id)}
                      className={`btn-sm ${gov.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                    >
                      {gov.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            <button 
              id="prevPage" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span id="pageInfo">Page {currentPage} of {totalPages}</span>
            <button 
              id="nextPage" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;