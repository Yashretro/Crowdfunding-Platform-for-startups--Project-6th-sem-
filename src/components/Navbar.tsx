import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = parsedUser && (parsedUser.role === 'admin' || parsedUser.userType === 'admin');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="glass-nav reveal sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-300/50">
              <span className="text-white font-bold">KS</span>
            </div>
            <span className="text-xl font-bold text-gradient">kickscale</span>
            <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-amber-500 shadow shadow-amber-300 live-dot"></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
            
            {isLoggedIn ? (
              <>
                {isAdmin ? <Link to="/admin" className="nav-link">Admin</Link> : null}
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col space-y-1"
          >
            <span className="w-8 h-0.5 bg-slate-700"></span>
            <span className="w-8 h-0.5 bg-slate-700"></span>
            <span className="w-8 h-0.5 bg-slate-700"></span>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2">
            <Link to="/" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Home</Link>
            <Link to="/projects" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Projects</Link>
            <Link to="/how-it-works" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">How It Works</Link>
            {isLoggedIn ? (
              <>
                {isAdmin ? <Link to="/admin" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Admin</Link> : null}
                <Link to="/dashboard" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Dashboard</Link>
                <Link to="/transactions" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Transactions</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sky-700 font-semibold hover:bg-white/45 rounded-xl">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-slate-700 hover:bg-white/45 rounded-xl">Login</Link>
                <Link to="/signup" className="block px-4 py-2 text-sky-700 font-semibold hover:bg-white/45 rounded-xl">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
