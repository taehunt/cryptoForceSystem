// 경로: client/src/hooks/useAuth.js
import { useEffect, useState } from 'react';

export default function useAuth() {
    const [user, setUser] = useState(null);        // 로그인된 유저 정보
    const [loading, setLoading] = useState(true);  // 초기 로딩 플래그
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/users/me`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { user, loading };
}
