import logo from './logo.svg';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NoPage from "./pages/NoPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SignIn from './components/SignIn.jsx';
import './App.css';


function App() {
  return (
    <Router basename="/GraphQL/">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route index path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
