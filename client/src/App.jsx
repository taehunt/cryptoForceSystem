// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // ✅ 추가

import Navbar from './components/Navbar';
import Home from './pages/Home';
import PasswordGate from './components/PasswordGate';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedPage from './pages/ProtectedPage';
import MerchantList from './pages/MerchantList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyPage from './pages/MyPage';
import AdminApprovals from './pages/AdminApprovals';

function App() {
    return (
        <AuthProvider> {/* ✅ 전역 사용자 상태 관리 적용 */}
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<PasswordGate />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/approvals" element={<AdminApprovals />} />
                    <Route path="/admin/merchants" element={<MerchantList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/protected" element={<ProtectedPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
