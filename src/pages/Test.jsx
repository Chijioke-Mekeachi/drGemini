import useAuth from '../hooks/useAuth';
// In your CreditsPage component, add a test button
export default function TestPaymentButton (){
  const { user } = useAuth();
  
  const testPayment = () => {
  if (!window.PaystackPop) {
    alert('Paystack script not loaded!');
    return;
  }
  
  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  console.log('Paystack Key:', paystackKey);
  
  if (!paystackKey || !paystackKey.startsWith('pk_')) {
    alert('Paystack public key not found!');
    return;
  }

  const userEmail = user?.email || 'customer@example.com';
  
  // Use NGN instead of USD and appropriate amount
  const amountInNaira = 5000; // ₦5,000 (about $5-6 USD)
  
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
      amount: amountInNaira, // Amount in kobo (₦5,000 = 500000)
      currency: 'NGN', // Change to NGN
      ref: 'TEST_' + Date.now(),
      callback: function(response) {
        console.log('Paystack success:', response);
        alert('✅ Payment successful! Reference: ' + response.reference);
        
        // Convert back to your expected amount for verification
        const equivalentUSD = 500; // $5.00 equivalent
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

  return (
    <button 
      onClick={testPayment}
      className="bg-green-500 text-white px-4 py-2 rounded-lg"
    >
      Test Paystack
    </button>
  );
};