import { useState } from 'react';
import { paymentService } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess: (paymentId: string, amount: number) => void;
}

type PaymentStep = 'amount' | 'processing' | 'success' | 'error';

export default function PaymentModal({
  isOpen,
  amount: initialAmount,
  projectId,
  projectTitle,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('amount');
  const [amount, setAmount] = useState(initialAmount.toString());
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');
    setLoading(true);
    setStep('processing');

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await paymentService.initiatePayment({
        amount: numAmount,
        projectId,
      });

      setPaymentId(response.data.paymentId);

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await paymentService.verifyPayment({
        paymentId: response.data.paymentId,
        amount: numAmount,
      });

      setStep('success');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Payment failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onSuccess(paymentId, parseFloat(amount));
    resetModal();
  };

  const resetModal = () => {
    setStep('amount');
    setAmount(initialAmount.toString());
    setError('');
    setPaymentId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        {step === 'amount' && (
          <>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Invest in {projectTitle}</h3>
            <p className="text-slate-600 mb-6">Enter your investment amount</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Investment Amount</p>
                <p className="text-2xl font-bold text-sky-700">₹{parseFloat(amount || '0').toLocaleString('en-IN')}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4 animate-pulse">
              <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
            <p className="text-slate-600 text-sm">Please wait while we process your investment...</p>
          </div>
        )}

        {step === 'success' && (
          <>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
              <p className="text-slate-600 text-sm mb-6">Your investment has been confirmed.</p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-bold text-slate-900">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">Project</span>
                  <span className="font-bold text-slate-900">{projectTitle}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200">
                  <span className="text-slate-600">Payment ID</span>
                  <span className="font-mono text-xs text-slate-600">{paymentId.slice(0, 8)}...</span>
                </div>
              </div>

              <button
                onClick={handleSuccess}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Done
              </button>
            </div>
          </>
        )}

        {step === 'error' && (
          <>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h3>
              <p className="text-red-600 text-sm mb-6">{error}</p>

              <button
                onClick={() => setStep('amount')}
                className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
