import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
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
  // Context hooks
  const { theme } = useTheme()
  const { language } = useAuth();
  
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

  // Translations
  const translations = {
    loginTitle: language === 'am' ? 'የስርዓት አስተዳዳሪ መግቢያ' : 'System Administrator Login',
    username: language === 'am' ? 'የተጠቃሚ ስም' : 'Username',
    password: language === 'am' ? 'የይለፍ ቃል' : 'Password',
    login: language === 'am' ? 'ግባ' : 'Login',
    invalidCredentials: language === 'am' ? 'ልክ ያልሆኑ የይለፍ መረጃዎች' : 'Invalid credentials',
    dashboardTitle: language === 'am' ? 'የመንግስት አስተዳደር ስርዓት' : 'Government Management System',
    // Add more translations as needed
  };

  const mockGovernmentsData: Government[] = language === 'am' 
  ? [
      {
        id: '1',
        name: 'የአሜሪካ ፌዴራላዊ መንግስት',
        type: 'national',
        adminUsername: 'usadmin',
        status: 'active',
        createdAt: new Date('2020-01-15'),
        email: 'admin@usa.gov',
        jurisdiction: 'አሜሪካ'
      }
    ]
  : [
      {
        id: '1',
        name: 'United States Federal Government',
        type: 'national',
        adminUsername: 'usadmin',
        status: 'active',
        createdAt: new Date('2020-01-15'),
        email: 'admin@usa.gov',
        jurisdiction: 'United States'
      }
    ];


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'sysadmin' && adminPassword === 'securepassword123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError(translations.invalidCredentials);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setGovernments(
        mockGovernmentsData.map((gov) => ({
          ...gov,
          type: gov.type as "national" | "state" | "local" | "agency", // ✅ type cast
        }))
      );
      
    }
  }, [isAuthenticated, language]);

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
    setCurrentPage(1);
  }, [governments, filterStatus, searchTerm]);

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
      <div className={`login-container ${theme}`}>
        <div className="login-card">
          <h2>{translations.loginTitle}</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="adminUsername">{translations.username}</label>
              <input 
                type="text" 
                id="adminUsername" 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminPassword">{translations.password}</label>
              <input 
                type="password" 
                id="adminPassword" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required 
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            <button type="submit" className="btn-primary">{translations.login}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${theme}`}>
      <div className={`sidebar ${theme}`}>
        <div className="admin-profile">
          <div className="avatar">
            <span className="initials">SA</span>
          </div>
          <span>System Admin</span>
        </div>
        <nav>
          <ul>
            <li className="active">
              <i className="icon-dashboard"></i>
              <span>{language === 'am' ? 'ዳሽቦርድ' : 'Dashboard'}</span>
            </li>
            <li>
              <i className="icon-create"></i>
              <span>{language === 'am' ? 'መንግስት ፍጠር' : 'Create Government'}</span>
            </li>
            <li>
              <i className="icon-manage"></i>
              <span>{language === 'am' ? 'መንግስታትን አስተዳድር' : 'Manage Governments'}</span>
            </li>
            <li>
              <i className="icon-audit"></i>
              <span>{language === 'am' ? 'ኦዲት ምዝገባዎች' : 'Audit Logs'}</span>
            </li>
            <li>
              <i className="icon-settings"></i>
              <span>{language === 'am' ? 'ቅንብሮች' : 'Settings'}</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>{translations.dashboardTitle}</h1>
          <div className="stats">
            <div className={`stat-card ${theme}`}>
              <h3>{language === 'am' ? 'ጠቅላላ መንግስታት' : 'Total Governments'}</h3>
              <p>{governments.length}</p>
            </div>
            <div className={`stat-card ${theme}`}>
              <h3>{language === 'am' ? 'ንቁ መንግስታት' : 'Active Governments'}</h3>
              <p>{governments.filter(g => g.status === 'active').length}</p>
            </div>
            <div className={`stat-card ${theme}`}>
              <h3>{language === 'am' ? 'የተቆጠቁ' : 'Suspended'}</h3>
              <p>{governments.filter(g => g.status === 'suspended').length}</p>
            </div>
          </div>
        </div>

        <section id="create-gov-section" className={`card ${theme}`}>
          <h2>{language === 'am' ? 'አዲስ የመንግስት አካል ፍጠር' : 'Create New Government Entity'}</h2>
          <form onSubmit={handleCreateGovernment}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="govName">{language === 'am' ? 'የመንግስት ስም' : 'Government Name'}</label>
                <input 
                  type="text" 
                  id="govName" 
                  value={govName}
                  onChange={(e) => setGovName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="govType">{language === 'am' ? 'የመንግስት አይነት' : 'Government Type'}</label>
                <select 
                  id="govType" 
                  value={govType}
                  onChange={(e) => setGovType(e.target.value as any)}
                  required
                >
                  <option value="national">{language === 'am' ? 'ብሔራዊ' : 'National'}</option>
                  <option value="state">{language === 'am' ? 'ክልል' : 'State/Province'}</option>
                  <option value="local">{language === 'am' ? 'አካባቢያዊ' : 'Local/Municipal'}</option>
                  <option value="agency">{language === 'am' ? 'የመንግስት ኤጀንሲ' : 'Government Agency'}</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="govUsername">{language === 'am' ? 'የአስተዳዳሪ ተጠቃሚ ስም' : 'Admin Username'}</label>
                <input 
                  type="text" 
                  id="govUsername" 
                  value={govUsername}
                  onChange={(e) => setGovUsername(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="govPassword">{language === 'am' ? 'የአስተዳዳሪ የይለፍ ቃል' : 'Admin Password'}</label>
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
              <label htmlFor="govEmail">{language === 'am' ? 'የእውቂያ ኢሜይል' : 'Contact Email'}</label>
              <input 
                type="email" 
                id="govEmail" 
                value={govEmail}
                onChange={(e) => setGovEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="govJurisdiction">{language === 'am' ? 'የስልጣን ክልል' : 'Jurisdiction'}</label>
              <input 
                type="text" 
                id="govJurisdiction" 
                value={govJurisdiction}
                onChange={(e) => setGovJurisdiction(e.target.value)}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {language === 'am' ? 'መንግስት ፍጠር' : 'Create Government'}
              </button>
            </div>
          </form>
        </section>

        <section id="manage-gov-section" className={`card ${theme}`}>
          <div className="section-header">
            <h2>{language === 'am' ? 'የመንግስት አካላትን አስተዳድር' : 'Manage Government Entities'}</h2>
            <div className="table-controls">
              <div className="search-input">
                <i className="icon-search"></i>
                <input 
                  type="text" 
                  id="govSearch" 
                  placeholder={language === 'am' ? 'መንግስታትን ፈልግ...' : 'Search governments...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                id="govFilter" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className={`select-${theme}`}
              >
                <option value="all">{language === 'am' ? 'ሁሉም መንግስታት' : 'All Governments'}</option>
                <option value="active">{language === 'am' ? 'ንቁ' : 'Active'}</option>
                <option value="suspended">{language === 'am' ? 'የተቆጠቁ' : 'Suspended'}</option>
              </select>
            </div>
          </div>
          
          <div className="table-container">
            <table id="governmentsTable">
              <thead>
                <tr>
                  <th>{language === 'am' ? 'መለያ' : 'ID'}</th>
                  <th>{language === 'am' ? 'ስም' : 'Name'}</th>
                  <th>{language === 'am' ? 'ዓይነት' : 'Type'}</th>
                  <th>{language === 'am' ? 'የአስተዳዳሪ ተጠቃሚ ስም' : 'Admin Username'}</th>
                  <th>{language === 'am' ? 'ሁኔታ' : 'Status'}</th>
                  <th>{language === 'am' ? 'የተፈጠረ' : 'Created'}</th>
                  <th>{language === 'am' ? 'ድርጊቶች' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {currentGovernments.map(gov => (
                  <tr key={gov.id}>
                    <td>{gov.id}</td>
                    <td>{gov.name}</td>
                    <td>{language === 'am' ? 
                      gov.type === 'national' ? 'ብሔራዊ' :
                      gov.type === 'state' ? 'ክልል' :
                      gov.type === 'local' ? 'አካባቢያዊ' : 'ኤጀንሲ'
                      : gov.type}</td>
                    <td>{gov.adminUsername}</td>
                    <td>
                      <span className={`status-badge ${gov.status}`}>
                        {language === 'am' ? 
                          gov.status === 'active' ? 'ንቁ' : 'የተቆጠቀ'
                          : gov.status}
                      </span>
                    </td>
                    <td>{gov.createdAt.toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => toggleGovernmentStatus(gov.id)}
                        className={`btn-sm ${gov.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                      >
                        {language === 'am' ? 
                          gov.status === 'active' ? 'አቆም' : 'አግባ'
                          : gov.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary"
            >
              {language === 'am' ? 'ወደ ኋላ' : 'Previous'}
            </button>
            <span className="page-info">
              {language === 'am'
                ? `ገፅ ${currentPage} / ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="btn-secondary"
            >
              {language === 'am' ? 'ወደ ፊት' : 'Next'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
