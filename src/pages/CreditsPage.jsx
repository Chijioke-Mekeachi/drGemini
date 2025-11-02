import { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, Shield, Lock, Zap } from 'lucide-react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const CreditPackage = ({ amount, credits, description, popular, onSelect, loading }) => (
  <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
    popular 
      ? 'border-brand-blue shadow-xl border-2' 
      : 'border-gray-200 hover:border-brand-blue shadow-lg'
  }`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-brand-blue text-white p-1 rounded-full text-sm font-semibold w-full">
          MOST POPULAR
        </span>
      </div>
    )}
    <button 
      onClick={() => onSelect(amount * 100)}
      disabled={loading}
      className="w-full p-8 text-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="mb-4">
        <h3 className="text-5xl font-bold text-brand-blue-dark mb-2">${amount}</h3>
        <p className="text-lg text-brand-gray-dark font-semibold">{credits} Credits</p>
      </div>
      <p className="text-brand-gray-dark text-sm mb-6 leading-relaxed text-left">{description}</p>
      <p className="text-brand-gray-dark text-sm mb-6 leading-relaxed text-left">For 1 Month</p>
      <p className="text-brand-gray-dark text-sm mb-6 leading-relaxed text-left">Full Access to GemiDoc</p>
      <div className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
        popular 
          ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' 
          : 'bg-gray-100 text-brand-blue-dark hover:bg-gray-200'
      }`}>
        {loading ? 'Processing...' : 'Get Started'}
      </div>
    </button>
  </div>
);

const PaystackPaymentModal = ({ isOpen, onClose, amount, email, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const initializePayment = () => {
    setProcessing(true);
    
    // Paystack integration
    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount,
      currency: 'USD',
      ref: `CRD_${Math.floor((Math.random() * 1000000000) + 1)}`,
      callback: function(response) {
        setProcessing(false);
        onSuccess(response.reference, amount);
        onClose();
      },
      onClose: function() {
        setProcessing(false);
        onClose();
      }
    });
    
    handler.openIframe();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-brand-blue-dark mb-2">Confirm Payment</h3>
        <p className="text-brand-gray-dark mb-6">
          You are about to purchase ${(amount / 100).toFixed(2)} worth of credits
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-brand-gray-dark">Amount:</span>
            <span className="text-2xl font-bold text-brand-blue-dark">${(amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-brand-gray-dark">
            <span>Payment Processor:</span>
            <span className="font-semibold">Paystack</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={initializePayment}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Pay Securely
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CreditsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const { user, updateUserBalance } = useAuth();

  const handlePackageSelect = (amountInCents) => {
    setSelectedAmount(amountInCents);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (reference, amountInCents) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Verify payment with your backend
      const response = await api.post('/credits/verify-payment', {
        reference,
        amount: amountInCents
      });
      
      updateUserBalance(response.data.newBalance);
      setMessage({
        type: 'success',
        text: `Successfully added $${(amountInCents / 100).toFixed(2)} to your account!`
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Payment verification failed. Please contact support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const packages = [
    {
      amount: 5,
      credits: 50,
      description: "Perfect for getting started with Dr. Gemini",
      popular: false
    },
    {
      amount: 15,
      credits: 120,
      description: "Great value for regular users",
      popular: true
    },
    {
      amount: 25,
      credits: 260,
      description: "Best value for power users",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <Zap className="text-yellow-500" size={20} />
            <span className="font-semibold text-brand-blue-dark">Instant Credit Top-up</span>
          </div>
          <h1 className="text-5xl font-bold text-brand-blue-dark mb-4">
            Add Credits to Your Account
          </h1>
          <p className="text-xl text-brand-gray-dark max-w-2xl mx-auto leading-relaxed">
            Continue your conversations with Dr. Gemini. Choose a package that fits your needs.
          </p>
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {packages.map((pkg, index) => (
            <CreditPackage
              key={index}
              amount={pkg.amount}
              credits={pkg.credits}
              description={pkg.description}
              popular={pkg.popular}
              onSelect={handlePackageSelect}
              loading={isLoading}
            />
          ))}
        </div>

        {/* Status Messages */}
        <div className="max-w-2xl mx-auto mb-12">
          {isLoading && (
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-6 shadow-lg">
              <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-semibold text-brand-blue-dark">
                Processing your payment...
              </span>
            </div>
          )}
          
          {message && (
            <div className={`flex items-center justify-center gap-3 p-6 rounded-xl shadow-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <CheckCircle size={24} />
              <span className="text-lg font-semibold">{message.text}</span>
            </div>
          )}
        </div>

        {/* Features & Security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Shield className="text-brand-blue" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Bank-Level Security</h3>
            <p className="text-brand-gray-dark text-sm">
              All payments processed through Paystack with PCI DSS compliance
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Zap className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Activation</h3>
            <p className="text-brand-gray-dark text-sm">
              Credits added immediately after successful payment verification
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Multiple Payments</h3>
            <p className="text-brand-gray-dark text-sm">
              Credit/debit cards, bank transfers, and mobile money supported
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-brand-gray-dark text-sm">
            Need help with payment? Contact our support team at support@drgemini.com
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaystackPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedAmount}
        email={user?.email}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}