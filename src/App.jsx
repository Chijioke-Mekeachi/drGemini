import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import CreditsPage from './pages/CreditsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
