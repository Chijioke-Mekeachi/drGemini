import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { MessageSquare, DollarSign, Trash2, AlertCircle, RotateCcw } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/history');
                setHistory(response.data);
            } catch (err) {
                setError('Failed to fetch history. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear your entire chat history? This action cannot be undone.')) {
            try {
                await api.delete('/history');
                setHistory(prev => ({ ...prev, chatHistory: [] }));
            } catch (err) {
                alert('Failed to clear history.');
            }
        }
    }

    const handleRestoreChat = (session) => {
        // Convert the session data to the format expected by ChatPage
        const messages = session.map(msg => ({
            role: msg.role,
            content: msg.content,
            id: msg.id || `restored-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

        // Store the restored chat in sessionStorage
        sessionStorage.setItem('restoredChat', JSON.stringify(messages));
        sessionStorage.setItem('restoredSessionId', session[0]?.session_id || `restored-${Date.now()}`);

        // Navigate to chat page
        navigate('/chat');
    }

    if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-80px)]"><Spinner size="large" /></div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-brand-blue-dark">Your History</h1>
                {history?.chatHistory?.length > 0 && (
                    <button onClick={handleClearHistory} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        <Trash2 size={16} /> Clear Chat History
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><MessageSquare className="text-brand-blue"/> Chat History</h2>
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                        {history?.chatHistory?.length > 0 ? (
                            history.chatHistory.map((session, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:border-brand-blue transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-brand-blue-dark flex-1">
                                            Consultation from {new Date(session[0].created_at).toLocaleString()}
                                        </h3>
                                        <button 
                                            onClick={() => handleRestoreChat(session)}
                                            className="flex items-center gap-1 bg-brand-blue text-white px-3 py-1 rounded-lg text-sm hover:bg-brand-blue-dark transition-colors ml-2"
                                            title="Restore this chat"
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto">
                                        {session.slice(0, 3).map((msg, msgIndex) => (
                                            <div key={msgIndex} className={`my-1 p-2 rounded-lg ${msg.role === 'user' ? 'bg-gray-100 text-right' : 'bg-blue-50'}`}>
                                                <p className={`text-sm font-semibold ${msg.role === 'user' ? 'text-gray-600' : 'text-blue-600'}`}>
                                                    {msg.role === 'user' ? 'You' : 'Dr. Gemini'}
                                                </p>
                                                <p className="whitespace-pre-wrap text-sm line-clamp-2">
                                                    {msg.content.length > 100 ? `${msg.content.substring(0, 100)}...` : msg.content}
                                                </p>
                                            </div>
                                        ))}
                                        {session.length > 3 && (
                                            <p className="text-center text-sm text-gray-500 mt-2">
                                                ... and {session.length - 3} more messages
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-xl shadow-md flex flex-col items-center">
                                <AlertCircle className="text-gray-400 mb-2" size={40}/>
                                <p>No chat history found.</p>
                                <p className="text-sm text-gray-500">Start a new conversation on the Chat page.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><DollarSign className="text-green-500"/> Payment History</h2>
                     <div className="space-y-4 bg-white p-4 rounded-xl shadow-md">
                        {history?.transactionHistory?.length > 0 ? (
                             history.transactionHistory.map((tx, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold text-green-600">Credit Top-up</p>
                                        <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                                    </div>
                                    <p className="font-bold text-lg text-green-700">+${(tx.amount/100).toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                             <div className="text-center py-10 flex flex-col items-center">
                                <AlertCircle className="text-gray-400 mb-2" size={40}/>
                                <p>No transactions found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}