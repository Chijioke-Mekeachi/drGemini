import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle, Shield, Lock, Zap, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const CreditPackage = ({ amount, nairaAmount, credits, description, popular, onSelect, loading, duration = "1 Month" }) => (
  <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
    popular 
      ? 'border-brand-blue shadow-xl border-2' 
      : 'border-gray-200 hover:border-brand-blue shadow-lg'
  }`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-semibold">
          MOST POPULAR
        </span>
      </div>
    )}
    <button 
      onClick={() => onSelect(nairaAmount)}
      disabled={loading}
      className="w-full p-8 text-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="mb-4">
        <h3 className="text-5xl font-bold text-brand-blue-dark mb-2">₦{nairaAmount?.toLocaleString()}</h3>
        <p className="text-lg text-brand-gray-dark font-semibold">{credits} Credits</p>
        <p className="text-sm text-gray-500">≈ ${amount} USD</p>
      </div>
      <div className="space-y-2 mb-6 text-left">
        <p className="text-brand-gray-dark text-sm leading-relaxed">{description}</p>
        <div className="flex items-center gap-2 text-brand-blue font-semibold">
          <Calendar size={16} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <Zap size={16} />
          <span>Full Access to Cura</span>
        </div>
      </div>
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
  const [error, setError] = useState('');

  const validatePayment = () => {
    if (!email || !email.includes('@')) {
      return 'Valid email is required';
    }
    
    if (!amount || amount < 1000) {
      return 'Amount must be at least ₦1,000';
    }
    
    if (!window.PaystackPop) {
      return 'Payment system not loaded';
    }
    
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey || !paystackKey.startsWith('pk_')) {
      return 'Payment configuration error';
    }
    
    return null;
  };

  const initializePayment = () => {
    setProcessing(true);
    setError('');
    
    const validationError = validatePayment();
    if (validationError) {
      setError(validationError);
      setProcessing(false);
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount,
        currency: 'NGN',
        ref: `SUB_${Date.now()}`,
        callback: function(response) {
          console.log('Paystack success:', response);
          setProcessing(false);
          
          // Convert NGN to USD equivalent for backend
          // Using rough conversion: ₦1000 ≈ $1
          const equivalentUSD = Math.round((amount / 1000) * 100); // Convert to cents
          onSuccess(response.reference, equivalentUSD);
          onClose();
        },
        onClose: function() {
          console.log('Paystack modal closed');
          setProcessing(false);
          setError('Payment was cancelled');
        },
        onError: function(error) {
          console.error('Paystack error:', error);
          setError('Payment failed: ' + (error.message || 'Unknown error'));
          setProcessing(false);
        }
      });
      
      handler.openIframe();
    } catch (err) {
      console.error('Paystack setup error:', err);
      setError('Failed to initialize payment: ' + err.message);
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-brand-blue-dark mb-2">Confirm Payment</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <p className="text-brand-gray-dark mb-6">
          You are about to purchase ₦{(amount).toLocaleString()} worth of credits
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-brand-gray-dark">Amount:</span>
            <span className="text-2xl font-bold text-brand-blue-dark">₦{(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-brand-gray-dark mb-2">
            <span>Email:</span>
            <span className="font-semibold">{email}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-brand-gray-dark mb-2">
            <span>Currency:</span>
            <span className="font-semibold">Naira (NGN)</span>
          </div>
          <div className="flex justify-between items-center text-sm text-brand-gray-dark">
            <span>Payment Processor:</span>
            <span className="font-semibold">Paystack</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setError('');
              onClose();
            }}
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
                Pay Now
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Use test card: 4187 4274 1556 4246
          </p>
        </div>
      </div>
    </div>
  );
};

const SubscriptionStatus = ({ subscription }) => {
  if (!subscription) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading subscription status...</p>
      </div>
    );
  }

  if (!subscription.has_active_subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-1">No Active Subscription</h3>
        <p className="text-yellow-700">Choose a package below to get started</p>
      </div>
    );
  }

  const daysRemaining = subscription.days_remaining;
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <div className={`border rounded-xl p-6 text-center ${
      isExpiringSoon 
        ? 'bg-orange-50 border-orange-200' 
        : 'bg-green-50 border-green-200'
    }`}>
      <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${
        isExpiringSoon ? 'text-orange-600' : 'text-green-600'
      }`} />
      <h3 className="text-lg font-semibold mb-1 capitalize">
        {subscription.subscription_type} Subscription Active
      </h3>
      <p className={isExpiringSoon ? 'text-orange-700' : 'text-green-700'}>
        {isExpiringSoon 
          ? `Expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
          : `Active for ${daysRemaining} more days`
        }
      </p>
      {isExpiringSoon && (
        <p className="text-orange-600 text-sm mt-2">
          Renew now to continue uninterrupted access
        </p>
      )}
    </div>
  );
};

export default function CreditsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [message, setMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    console.log('=== PAYSTACK DEBUG ===');
    console.log('Paystack available:', !!window.PaystackPop);
    console.log('Paystack key:', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY);
    console.log('User:', user);
    
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoadingSubscription(true);
      const response = await api.get('/credits/subscription', {
        params: { _: Date.now() },
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      console.log('Subscription response:', response.data);
      setSubscription(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const testPayment = () => {
    if (!window.PaystackPop) {
      alert('Paystack script not loaded! Check the script in index.html');
      return;
    }
    
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    console.log('Paystack Key:', paystackKey);
    
    if (!paystackKey || !paystackKey.startsWith('pk_')) {
      alert('Paystack public key not found or invalid! Check your .env file');
      return;
    }

    const userEmail = user?.email || 'customer@example.com';
    const amountInNaira = 5000; // ₦5,000
    
    console.log('Payment details:', {
      key: paystackKey.substring(0, 10) + '...',
      email: userEmail,
      amount: amountInNaira,
      currency: 'NGN'
    });

    try {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: userEmail,
        amount: amountInNaira,
        currency: 'NGN',
        ref: 'TEST_' + Date.now(),
        callback: function(response) {
          console.log('Paystack success:', response);
          alert('✅ Payment successful! Reference: ' + response.reference);
          
          // Convert NGN to USD equivalent for backend
          const equivalentUSD = 500; // $5.00 equivalent in cents
          handlePaymentSuccess(response.reference, equivalentUSD);
        },
        onClose: function() {
          console.log('Payment modal closed');
        },
        onError: function(error) {
          console.error('Paystack error:', error);
          alert('Payment error occurred');
        }
      });
      
      handler.openIframe();
    } catch (error) {
      console.error('Paystack setup error:', error);
      alert('Failed to initialize payment: ' + error.message);
    }
  };

  const handlePackageSelect = (amountInNaira) => {
    setSelectedAmount(amountInNaira);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (reference, amountInUSD) => {
    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Verifying payment with backend:', {
        reference,
        amountInUSD,
        amountInUSDdollars: amountInUSD / 100
      });

      const response = await api.post('/credits/verify-payment', {
        reference,
        amount: amountInUSD
      });
      
      console.log('Backend verification response:', response.data);
      
      updateUser({
        ...user,
        credits: response.data.newBalance,
        subscription_ends_at: response.data.subscription_ends_at,
        subscription_type: response.data.subscription_type
      });

      await fetchSubscriptionStatus();

      setMessage({
        type: 'success',
        text: `Success! ${response.data.creditsAdded} credits added to your account. Subscription active until ${new Date(response.data.subscription_ends_at).toLocaleDateString()}.`
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Payment verification failed. Please contact support.';
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const packages = [
    {
      amount: 5,
      nairaAmount: 5000,
      credits: 50,
      description: "Perfect for getting started with Cura",
      popular: false,
      duration: "1 Month"
    },
    {
      amount: 15,
      nairaAmount: 15000,
      credits: 120,
      description: "Great value for regular users",
      popular: true,
      duration: "1 Month"
    },
    {
      amount: 25,
      nairaAmount: 25000,
      credits: 260,
      description: "Best value for power users",
      popular: false,
      duration: "1 Month"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <Zap className="text-yellow-500" size={20} />
            <span className="font-semibold text-brand-blue-dark">Subscription Plans</span>
          </div>
          
          {/* Test Payment Button */}
          

          <h1 className="text-5xl font-bold text-brand-blue-dark mb-4">
            Upgrade Your Account
          </h1>
          <p className="text-xl text-brand-gray-dark max-w-2xl mx-auto leading-relaxed">
            Get unlimited access to Cura with our subscription plans. 
            Choose the package that fits your needs.
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="max-w-2xl mx-auto mb-12">
          {loadingSubscription ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading subscription status...</p>
            </div>
          ) : (
            <SubscriptionStatus subscription={subscription} />
          )}
        </div>

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {packages.map((pkg, index) => (
            <CreditPackage
              key={index}
              amount={pkg.amount}
              nairaAmount={pkg.nairaAmount}
              credits={pkg.credits}
              description={pkg.description}
              popular={pkg.popular}
              duration={pkg.duration}
              onSelect={handlePackageSelect}
              loading={isLoading}
            />
          ))}
        </div>

        {/* Current Balance */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={24} />
              <div className="text-left">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-brand-blue-dark">
                  {user?.credits || 0} Credits
                </p>
              </div>
            </div>
          </div>
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
              {message.type === 'success' ? (
                <CheckCircle size={24} />
              ) : (
                <div className="w-6 h-6 border-2 border-red-800 border-t-transparent rounded-full animate-spin" />
              )}
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

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-brand-blue-dark mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">How does billing work?</h3>
              <p className="text-brand-gray-dark text-sm">
                Subscriptions are billed in Naira (NGN). You'll get instant access to your credits 
                and features immediately after payment.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-brand-gray-dark text-sm">
                Yes! You can cancel your subscription at any time. You'll keep your credits 
                until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">What payment methods are accepted?</h3>
              <p className="text-brand-gray-dark text-sm">
                We accept all major credit/debit cards, bank transfers, and mobile money 
                through our secure Paystack integration.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Do credits roll over?</h3>
              <p className="text-brand-gray-dark text-sm">
                Yes! Unused credits roll over to the next month as long as your subscription 
                remains active.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-brand-gray-dark text-sm">
            Need help with payment? Contact our support team at support@cura.com
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