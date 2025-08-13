import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
            <main className="flex-1 max-w-5xl mx-auto px-4 py-16">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        CryptoForce System
                    </h1>
                    <p className="text-lg text-gray-600">
                        실시간 승인 기반 입금 시스템으로 안전한 Web3 결제를 지원합니다.
                    </p>

                    <button
                        onClick={() => navigate('/pay')}
                        className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded hover:bg-indigo-700"
                    >
                        결제 요청하러 가기 →
                    </button>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                            승인되면 실시간 알림을 받을 수 있습니다.
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

            <footer className="bg-white border-t mt-16">
                <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} CryptoForce System. All rights reserved.
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-800 text-white ml-5 px-3 py-2 rounded hover:bg-gray-700"
                    >
                        관리자
                    </button>
                </div>
            </footer>
        </div>
    );
}
