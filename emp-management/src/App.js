import './App.css';
import LoginForm from './pages/LoginForm';
import AdminPage from './pages/AdminPage';
import EmployeePage from './pages/EmployeePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeaveRequest from './pages/LeaveRequest';
import AllEmployees from './pages/AllEmployees';
import RequestLeave from './pages/RequestLeave';

function App() {
  return (
    <div className="App">
        <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/EmployeePage" element={<EmployeePage />} />
        <Route path="/LeaveRequest" element={<LeaveRequest/>} />
        <Route path='/AllEmployees' element ={<AllEmployees/>}/>
        <Route path='/RequestLeave' element ={<RequestLeave/>}/>
      </Routes>
    </Router>
    </div>
  );  
};

export default App;
