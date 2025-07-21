import PaymentRequest from '../models/paymentRequest.model.js';

export const getPendingPayments = async (req, res) => {
    try {
        const pending = await PaymentRequest.find({ approved: false }).populate('userId');
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
};

export const approvePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await PaymentRequest.findById(id);
        if (!payment) return res.status(404).json({ error: '요청 없음' });

        payment.approved = true;
        payment.approvedAt = new Date();
        await payment.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: '서버 오류' });
    }
};
