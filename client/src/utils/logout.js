// client/src/utils/logout.js (🆕 생성)
export async function logout() {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
    await fetch(`${API_BASE}/api/users/logout`, { method: 'POST' });
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 이동
}
