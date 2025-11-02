import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { 
  Stethoscope, 
  LogOut, 
  Coins, 
  History, 
  User, 
  Menu, 
  X 
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition border border-1 border-black${
      isActive 
        ? 'bg-brand-blue-light text-brand-blue-dark' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 h-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/icon.png" alt="Dr. Gemini Logo" className="w-20 rounded"/>
            <span className="text-2xl font-bold text-brand-blue-dark">Dr. Gemini</span>
          </Link>
        

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
                <NavLink to="/history" className={navLinkClass}>
                  <History size={16}/> History
                </NavLink>
                <NavLink to="/credits" className={navLinkClass}>
                  <Coins size={16}/> Buy Credits
                </NavLink>

                <div className="flex items-center gap-4 pl-4 border-l">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="font-semibold text-green-600">
                      Balance: ${(user.credits / 100).toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-600 hover:text-red-500 transition-colors" 
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  <User size={16}/> Log In
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-blue-dark transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden text-gray-600 hover:text-brand-blue transition-colors p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28}/> : <Menu size={28}/>}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 border-t border-gray-200 pt-2 pb-4 space-y-2 bg-blue-300 p-2 rounded-md">
            {user ? (
              <>
                <NavLink 
                  to="/chat" 
                  className={navLinkClass} 
                  onClick={() => setMenuOpen(false)}
                >
                  Chat
                </NavLink>
                <NavLink 
                  to="/history" 
                  className={navLinkClass} 
                  onClick={() => setMenuOpen(false)}
                >
                  <History size={16}/> History
                </NavLink>
                <NavLink 
                  to="/credits" 
                  className={navLinkClass} 
                  onClick={() => setMenuOpen(false)}
                >
                  <Coins size={16}/> Buy Credits
                </NavLink>

                <div className="flex items-center justify-between px-3 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="font-semibold text-green-600">
                      Balance: ${(user.credits / 100).toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="text-gray-600 hover:text-red-500 transition-colors" 
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={navLinkClass} 
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16}/> Log In
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="block bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-blue-dark transition-colors mx-3 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}