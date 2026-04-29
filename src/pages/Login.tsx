import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full glass-strong reveal p-8">
        <p className="premium-chip mb-4 w-fit mx-auto">Investor + Founder Access</p>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-center text-slate-600 mb-6">Sign in to manage campaigns, investments, and growth insights.</p>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="glass-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="glass-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-sky-600 rounded" />
              <span className="ml-2 text-sm text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-sky-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sky-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-white/50">
          <p className="text-sm text-slate-600 mb-3">Demo Credentials:</p>
          <p className="text-sm text-slate-700">Email: demo@example.com</p>
          <p className="text-sm text-slate-700">Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
