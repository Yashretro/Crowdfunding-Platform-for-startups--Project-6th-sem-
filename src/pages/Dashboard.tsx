import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { investmentService } from '../services/api';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

interface InvestmentItem {
  id: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  createdAt: string;
  status?: 'pending' | 'confirmed' | 'failed';
}

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(true);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadTrackingData();
  }, [navigate]);

  useRealtimeSync(['investments', 'payments'], (event) => {
    if (event.resource === 'investments' || event.resource === 'payments') {
      loadTrackingData();
    }
  });

  const loadTrackingData = async () => {
    setTrackingLoading(true);
    setTrackingError(null);

    try {
      const response = await investmentService.getAll();
      const apiData = Array.isArray(response.data) ? response.data : [];
      const mappedApiData: InvestmentItem[] = apiData.map((item) => {
        const obj = (typeof item === 'object' && item !== null) ? item as Record<string, unknown> : {};
        const proj = (obj.project && typeof obj.project === 'object') ? (obj.project as Record<string, unknown>) : undefined;
        return {
          id: String(obj.id ?? obj._id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
          projectId: String(obj.projectId ?? proj?.id ?? ''),
          projectTitle: String(obj.projectTitle ?? proj?.title ?? 'Project'),
          amount: Number(obj.amount ?? 0),
          createdAt: String(obj.createdAt ?? new Date().toISOString()),
          status: (String(obj.status ?? obj.paymentStatus ?? 'confirmed') as 'pending' | 'confirmed' | 'failed'),
        };
      });

      if (mappedApiData.length > 0) {
        setInvestments(mappedApiData);
      } else {
        const localTracked = localStorage.getItem('trackedInvestments');
        setInvestments(localTracked ? JSON.parse(localTracked) : []);
      }
    } catch (error) {
      const localTracked = localStorage.getItem('trackedInvestments');
      setInvestments(localTracked ? JSON.parse(localTracked) : []);
      setTrackingError('Using local tracking data. Backend tracking is unavailable right now.');
      console.error('Error loading tracking data:', error);
    } finally {
      setTrackingLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const totalInvested = investments.reduce((sum, investment) => sum + Number(investment.amount || 0), 0);
  const activeInvestments = investments.length;
  const returnsGenerated = totalInvested * 0.08;
  const recentActivityCount = investments.filter((investment) => {
    const createdAt = new Date(investment.createdAt).getTime();
    return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const recentInvestments = [...investments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <div className="section-shell py-12">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <p className="premium-chip w-fit">Performance Dashboard</p>
          <span className="badge-glass">
            {recentActivityCount} new updates this week
          </span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Welcome, {user.firstName}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="card">
            <h3 className="text-xl font-bold text-slate-900 mb-4">My Profile</h3>
            <p className="text-slate-700 mb-2"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p className="text-slate-700 mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="text-slate-700 mb-4"><strong>Type:</strong> {user.userType === 'founder' ? 'Founder' : 'Investor'}</p>
            <button className="btn-primary">Edit Profile</button>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <p className="text-slate-700"><strong>Total Invested:</strong> ₹{totalInvested.toLocaleString('en-IN')}</p>
              <p className="text-slate-700"><strong>Active Investments:</strong> {activeInvestments}</p>
              <p className="text-slate-700"><strong>Est. Returns:</strong> ₹{returnsGenerated.toFixed(2)}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {user.userType === 'founder' && (
                <Link
                  to="/campaigns/new"
                  className="w-full block btn-primary text-left"
                >
                  Start New Campaign
                </Link>
              )}
              <Link
                to="/projects"
                className="w-full block btn-secondary text-left"
              >
                Browse Projects
              </Link>
              <Link to="/transactions" className="w-full block btn-outline text-left">View Transactions</Link>
              <button className="w-full btn-outline text-left">View Wallet</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <span className="badge-glass">{recentActivityCount} recent</span>
          </div>
          {trackingLoading ? (
            <div className="text-center text-slate-600 py-8">Loading tracking activity...</div>
          ) : (
            <div>
              {trackingError && (
                <p className="mb-4 text-sm text-amber-700 bg-amber-50/90 border border-amber-200 rounded-lg px-3 py-2">
                  {trackingError}
                </p>
              )}

              {recentInvestments.length === 0 ? (
                <div className="text-center text-slate-600 py-8">
                  <p>No tracked investments yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInvestments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between border border-white/60 rounded-xl px-4 py-3 bg-white/35">
                      <div>
                        <p className="font-semibold text-slate-900">Invested in {investment.projectTitle || 'Project'}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(investment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                            investment.status === 'failed'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : investment.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {investment.status || 'confirmed'}
                        </span>
                        <p className="font-bold text-sky-700">₹{Number(investment.amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-6">
            <Link to="/transactions" className="btn-outline inline-block">Open Full Transaction History</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
