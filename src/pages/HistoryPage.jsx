import { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { MessageSquare, DollarSign, Trash2, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
                                <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                                    <h3 className="font-bold mb-2 text-brand-blue-dark">Consultation from {new Date(session[0].created_at).toLocaleString()}</h3>
                                    {session.map((msg, msgIndex) => (
                                        <div key={msgIndex} className={`my-1 p-2 rounded-lg ${msg.role === 'user' ? 'bg-gray-100 text-right' : 'bg-blue-50'}`}>
                                            <p className={`text-sm font-semibold ${msg.role === 'user' ? 'text-gray-600' : 'text-blue-600'}`}>{msg.role === 'user' ? 'You' : 'Dr. Gemini'}</p>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    ))}
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
