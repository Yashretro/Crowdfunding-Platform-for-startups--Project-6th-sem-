import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { defaultProjects, type DefaultProject } from '../data/defaultProjects';
import { investmentService, projectService, userService } from '../services/api';
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
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  role?: string;
  watchlist?: string[];
}

type CampaignCard = DefaultProject & { ownerId?: string };

interface UserProfile extends User {
  watchlist?: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignCard[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<CampaignCard[]>([]);
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

    loadDashboardData();
  }, [navigate]);

  useRealtimeSync(['investments', 'payments'], (event) => {
    if (event.resource === 'investments' || event.resource === 'payments') {
      loadDashboardData();
    }
  });

  const loadDashboardData = async () => {
    setTrackingLoading(true);
    setTrackingError(null);

    try {
      const storedUser = localStorage.getItem('user');
      let profile: UserProfile | null = storedUser ? JSON.parse(storedUser) : null;

      if (localStorage.getItem('token')) {
        try {
          const profileResponse = await userService.getProfile();
          profile = profileResponse.data as UserProfile;
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (profileError) {
          console.error('Error loading profile:', profileError);
        }
      }

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

      const projectsResponse = await projectService.getAll();
      const apiProjects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
      const allProjects: CampaignCard[] = (apiProjects.length > 0 ? apiProjects : defaultProjects) as CampaignCard[];
      const watchlist = Array.isArray(profile?.watchlist) ? profile.watchlist : [];

      setSavedCampaigns(allProjects.filter((project) => watchlist.includes(project.id)).slice(0, 6));
      setMyCampaigns(
        profile?.id
          ? allProjects.filter((project) => project.ownerId === profile.id).slice(0, 6)
          : []
      );
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

          <div className="card">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Saved Campaigns</h3>
            <p className="text-slate-700 mb-4"><strong>Saved:</strong> {savedCampaigns.length}</p>
            <Link to="/projects" className="btn-primary inline-block">Browse Projects</Link>
          </div>
        </div>

        {user.userType === 'founder' && (
          <div className="card mb-12">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">My Campaigns</h3>
              <Link to="/campaigns/new" className="btn-primary">Create Campaign</Link>
            </div>
            {myCampaigns.length === 0 ? (
              <p className="text-slate-600">No campaigns yet. Start one from the campaign builder.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {myCampaigns.map((campaign) => (
                  <Link key={campaign.id} to={`/projects/${campaign.id}`} className="border border-white/60 rounded-2xl p-4 bg-white/35 hover:bg-white/60 transition block">
                    <p className="font-semibold text-slate-900 mb-1">{campaign.title}</p>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{campaign.description}</p>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>₹{campaign.raised.toLocaleString('en-IN')}</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="card mb-12">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h3 className="text-xl font-bold text-slate-900">Saved Campaigns</h3>
            <span className="badge-glass">{savedCampaigns.length} saved</span>
          </div>
          {savedCampaigns.length === 0 ? (
            <p className="text-slate-600">No saved campaigns yet. Use the save button on a project card or campaign page.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedCampaigns.map((campaign) => (
                <Link key={campaign.id} to={`/projects/${campaign.id}`} className="border border-white/60 rounded-2xl p-4 bg-white/35 hover:bg-white/60 transition block">
                  <p className="font-semibold text-slate-900 mb-1">{campaign.title}</p>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{campaign.description}</p>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>₹{campaign.raised.toLocaleString('en-IN')}</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
