import { Link } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function CreditModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <X size={24} />
        </button>
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Insufficient Credits</h2>
        <p className="text-brand-gray-dark mb-6">You don't have enough credits for this action. Please top up your account to continue.</p>
        <Link 
          to="/credits" 
          onClick={onClose} 
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Buy More Credits
        </Link>
      </div>
    </div>
  );
}
