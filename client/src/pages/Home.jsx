import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <main className="max-w-4xl mx-auto px-4 py-12">
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">신뢰할 수 있는 입금 신청 시스템</h2>
                    <p className="text-gray-600">
                        본 플랫폼은 사용자의 암호화폐 입금 요청을 안전하게 처리하고,
                        관리자가 확인 및 승인을 통해 자동화된 다음 단계를 연결해줍니다.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">1. 입금 요청</h3>
                        <p className="text-gray-700">
                            유저는 지갑 주소와 금액을 입력하여 입금을 신청합니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">2. 관리자 승인</h3>
                        <p className="text-gray-700">
                            관리자는 모든 입금 요청을 검토하고 승인할 수 있습니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">3. 승인 알림</h3>
                        <p className="text-gray-700">
                            승인되면 Discord나 이메일로 실시간 알림을 받을 수 있습니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">4. 자동화 연동</h3>
                        <p className="text-gray-700">
                            승인된 입금은 자동으로 토큰 전송, 영수증 발행 등의 후속 작업과 연동됩니다.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t mt-12">
                <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} CryptoForce System. All rights reserved.
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-black text-white ml-5 px-3 py-2 rounded"
                    >
                        관리자
                    </button>
                </div>
            </footer>
        </div>
    );
}
