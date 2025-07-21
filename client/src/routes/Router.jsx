import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import MerchantList from '../pages/MerchantList';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/merchants" element={<MerchantList />} />
            </Routes>
        </BrowserRouter>
    );
}
