import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import Spinner from '../components/Spinner';
import CreditModal from '../components/CreditModal';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatType, setChatType] = useState('general'); // 'general' or 'diagnosis'
  const [sessionId] = useState(uuidv4());
  const [showCreditModal, setShowCreditModal] = useState(false);

  const { user, updateUserBalance } = useAuth();
  const chatEndRef = useRef(null);

  const GENERAL_COST = 5;
  const DIAGNOSIS_COST = 50;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        role: 'model',
        content: 'Hello! I am Dr. Gemini, your AI health assistant. How can I help you today? You can ask a general health question or request a diagnosis for your symptoms.',
        id: uuidv4()
      }
    ]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const cost = chatType === 'diagnosis' ? DIAGNOSIS_COST : GENERAL_COST;
    if (user.credits < cost) {
      setShowCreditModal(true);
      return;
    }

    const userMessage = { role: 'user', content: input, id: uuidv4() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(({role, content}) => ({role, content}));
      const res = await api.post('/chat', {
        message: input,
        history: chatHistory,
        type: chatType,
        sessionId: sessionId
      });

      const modelMessage = { role: 'model', content: res.data.reply, id: uuidv4() };
      setMessages(prev => [...prev, modelMessage]);
      updateUserBalance(res.data.newBalance);
    } catch (error) {
      console.error('Chat API error:', error);
      if (error.response?.status === 402) {
        setShowCreditModal(true);
      }
      const errorMessage = { 
        role: 'model', 
        content: error.response?.data?.message || 'Sorry, something went wrong. Please try again.', 
        id: uuidv4(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  const handleDiagnosisRequest = () => {
    if (user.credits < DIAGNOSIS_COST) {
        setShowCreditModal(true);
        return;
    }
    setChatType('diagnosis');
    setInput('I would like a diagnosis. Here are my symptoms: ');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-brand-blue-light">
      {showCreditModal && <CreditModal onClose={() => setShowCreditModal(false)} />}
      <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm flex items-center justify-center gap-2">
        <AlertTriangle size={16} />
        Disclaimer: Dr. Gemini is an AI assistant and not a substitute for professional medical advice.
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg lg:max-w-2xl px-4 py-3 rounded-xl ${msg.role === 'user' ? 'bg-brand-blue text-white rounded-br-none' : `bg-white text-brand-gray-dark rounded-bl-none ${msg.isError ? 'bg-red-100 text-red-700' : ''}`}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-lg lg:max-w-2xl px-4 py-3 rounded-xl bg-white text-brand-gray-dark rounded-bl-none flex items-center">
                <Spinner /> <span className="ml-2">Dr. Gemini is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-4 md:p-6 border-t bg-white">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <button 
                    onClick={() => setChatType('general')}
                    className={`px-3 py-1 text-sm rounded-full ${chatType === 'general' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}
                >
                   General Chat (${(GENERAL_COST / 100).toFixed(2)})
                </button>
                <button 
                    onClick={handleDiagnosisRequest}
                    className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${chatType === 'diagnosis' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                >
                    <Sparkles size={14} /> Diagnosis (${(DIAGNOSIS_COST / 100).toFixed(2)})
                </button>
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={chatType === 'diagnosis' ? 'Describe your symptoms...' : 'Ask a health question...'}
                    className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-brand-blue text-white p-3 rounded-full hover:bg-brand-blue-dark disabled:bg-brand-gray transition-colors">
                    <Send size={24} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
