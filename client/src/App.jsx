// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PasswordGate from './components/PasswordGate';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedPage from './pages/ProtectedPage';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<PasswordGate />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/protected" element={<ProtectedPage />} />
            </Routes>
        </Router>
    );
}

export default App;
