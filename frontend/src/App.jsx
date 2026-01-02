import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import SubmissionList from "./components/submissions/SubmissionList";
import SubmissionDetails from "./components/submissions/SubmissionDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:projectId/submissions" element={<SubmissionList />} />
        <Route path="/projects/:projectId/submissions/:submissionId" element={<SubmissionDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
