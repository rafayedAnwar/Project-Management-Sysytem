import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import TaskAssignment from './pages/TaskAssignment';
import AssignedTasks from './pages/AssignedTasks';
import StaffReview from './pages/StaffReview';
import ManagerReview from './pages/managerReview';
import TestAuth from './pages/TestAuth';
import { isAuthenticated } from './services/api';

// Protected route component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/:projectId" 
            element={
              <ProtectedRoute>
                <TaskAssignment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-auth" 
            element={
              <ProtectedRoute>
                <TestAuth />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff-review" 
            element={
              <ProtectedRoute>
                <StaffReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager-review" 
            element={
              <ProtectedRoute>
                <ManagerReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assigned-tasks/:userId" 
            element={
              <ProtectedRoute>
                <AssignedTasks />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
