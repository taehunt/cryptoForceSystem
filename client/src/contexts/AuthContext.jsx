import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null: 로딩중, false: 로그아웃 상태
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(false); // ❗ 명확하게 로그아웃 상태로 설정
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setUser(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        await fetch(`${API_BASE}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(false); // ❗ 로그아웃 후 false로 설정
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
