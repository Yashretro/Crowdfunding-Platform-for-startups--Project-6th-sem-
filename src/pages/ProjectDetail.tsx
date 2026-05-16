import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { investmentService, projectService, userService } from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { defaultProjects } from '../data/defaultProjects';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

interface TrackedInvestment {
  id: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface Project {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  category: string;
  daysLeft: number;
  founder: { name: string; bio: string };
  updates: Array<{ date: string; content: string }>;
}

interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  role?: string;
  watchlist?: string[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projectInvestments, setProjectInvestments] = useState<TrackedInvestment[]>([]);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      const response = await projectService.getById(id!);
      setProject(response.data as Project);
    } catch (error) {
      console.error('Error fetching project:', error);
      // If backend returns 404 (project not found), fall back to local seeded/default projects
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        const fallback = defaultProjects.find((p) => p.id === id);
        if (fallback) setProject(fallback as Project);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadProjectInvestments = useCallback(async () => {
    if (!id) return;

    try {
      const response = await investmentService.getProjectInvestments(id);
      const apiData = Array.isArray(response.data) ? response.data : [];
      const mappedInvestments: TrackedInvestment[] = apiData.map((item) => {
        const obj = (typeof item === 'object' && item !== null) ? item as Record<string, unknown> : {};
        return {
          id: String(obj.id ?? obj._id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
          projectId: String(obj.projectId ?? id),
          projectTitle: String(obj.projectTitle ?? project?.title ?? 'Project'),
          amount: Number(obj.amount ?? 0),
          createdAt: String(obj.createdAt ?? new Date().toISOString()),
          status: (String(obj.status ?? obj.paymentStatus ?? 'confirmed') as 'pending' | 'confirmed' | 'failed'),
        };
      });
      setProjectInvestments(mappedInvestments);
    } catch (error) {
      console.error('Error loading project investments:', error);
      setProjectInvestments([]);
    }
  }, [id, project?.title]);

  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setProfile(null);
      return;
    }

    try {
      const response = await userService.getProfile();
      setProfile(response.data as UserProfile);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    loadProfile();
    loadProjectInvestments();
  }, [fetchProject]);

  useRealtimeSync(['projects', 'investments', 'payments'], (event) => {
    if (event.resource === 'projects' && (!event.projectId || event.projectId === id)) {
      fetchProject();
    }
    if (event.resource === 'investments' && event.projectId === id) {
      fetchProject();
      loadProjectInvestments();
    }
  });

  const isSavedCampaign = Boolean(profile?.watchlist?.includes(id ?? ''));
  const canManageCampaign = Boolean(
    profile && project && (profile.role === 'admin' || profile.userType === 'admin' || project.ownerId === profile.id)
  );

  const toggleSavedCampaign = async () => {
    if (!id) return;

    if (!profile) {
      navigate('/login');
      return;
    }

    try {
      const response = await userService.toggleWatchlist(id);
      const nextUser = (response.data?.user ?? response.data) as UserProfile;
      setProfile(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setActionMessage(response.data?.saved ? 'Campaign saved.' : 'Campaign removed from saved list.');
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handlePostUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !canManageCampaign || !updateText.trim()) return;

    setUpdateSubmitting(true);
    setActionMessage('');

    try {
      await projectService.addUpdate(id, { content: updateText.trim() });
      setUpdateText('');
      await fetchProject();
      await loadProjectInvestments();
      setActionMessage('Update published successfully.');
    } catch (error) {
      console.error('Error posting project update:', error);
      setActionMessage('Could not publish the update right now.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  const saveTrackedInvestment = (amount: number, status: 'pending' | 'confirmed' | 'failed' = 'confirmed') => {
    if (!project || !id) return;

    const existing = localStorage.getItem('trackedInvestments');
    const investments: TrackedInvestment[] = existing ? JSON.parse(existing) : [];

    const newInvestment: TrackedInvestment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: id,
      projectTitle: project.title,
      amount,
      createdAt: new Date().toISOString(),
      status,
    };

    investments.unshift(newInvestment);
    localStorage.setItem('trackedInvestments', JSON.stringify(investments));
  };

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);

    if (!investmentAmount || Number.isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!project || !id) {
      alert('Project is not available right now.');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (_paymentId: string, amount: number) => {
    if (!project || !id) return;

    try {
      await investmentService.create({
        projectId: id,
        projectTitle: project.title,
        amount,
        status: 'confirmed',
      });

      setProject((currentProject) =>
        currentProject
          ? { ...currentProject, raised: currentProject.raised + amount }
          : currentProject
      );
      saveTrackedInvestment(amount, 'confirmed');
      setInvestmentAmount('');
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error saving investment:', error);
      saveTrackedInvestment(amount, 'pending');
      setInvestmentAmount('');
      setIsPaymentModalOpen(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
  const totalBackers = projectInvestments.length;
  const recentUpdate = project.updates?.[0] ?? null;

  return (
    <div className="min-h-screen">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        amount={parseFloat(investmentAmount) || 0}
        projectId={id || ''}
        projectTitle={project?.title || ''}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <div className="relative h-96 overflow-hidden">
        <img
          src={!imageError && project.image ? project.image : 'https://via.placeholder.com/1200x600?text=No+Image'}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <span className="inline-block bg-white/30 backdrop-blur-sm border border-white/50 text-white px-3 py-1 rounded-full text-sm mb-3">
              {project.category}
            </span>
            <h1 className="text-5xl font-bold text-white">{project.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Project</h2>
              <p className="text-slate-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="card">
                <p className="telemetry-label mb-1">Backers</p>
                <p className="text-3xl font-bold text-slate-900">{totalBackers}</p>
              </div>
              <div className="card">
                <p className="telemetry-label mb-1">Updates</p>
                <p className="text-3xl font-bold text-slate-900">{project.updates?.length || 0}</p>
              </div>
              <div className="card">
                <p className="telemetry-label mb-1">Saved</p>
                <p className="text-3xl font-bold text-slate-900">{isSavedCampaign ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates</h2>
              {actionMessage && (
                <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sky-800">
                  {actionMessage}
                </div>
              )}

              {canManageCampaign && (
                <form onSubmit={handlePostUpdate} className="mb-6 space-y-3">
                  <textarea
                    className="glass-input min-h-28"
                    value={updateText}
                    onChange={(event) => setUpdateText(event.target.value)}
                    placeholder="Share a milestone, progress note, or investor update..."
                  />
                  <button type="submit" disabled={updateSubmitting} className="btn-primary disabled:opacity-60">
                    {updateSubmitting ? 'Publishing...' : 'Publish Update'}
                  </button>
                </form>
              )}

              {project.updates && project.updates.length > 0 ? (
                <div className="space-y-4">
                  {project.updates.map((update, index) => (
                    <div key={index} className="border-b border-white/50 pb-4 last:border-b-0">
                      <p className="text-sm text-slate-600 mb-2">{update.date}</p>
                      <p className="text-slate-700">{update.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No updates yet</p>
              )}
              {recentUpdate && (
                <p className="mt-4 text-sm text-slate-500">
                  Latest update: {recentUpdate.date}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="card mb-8 sticky top-20">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Invest Now</h3>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold text-slate-900">₹{project.raised.toLocaleString('en-IN')}</span>
                  <span className="text-lg font-bold text-sky-700">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-3 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-600">of ₹{project.goal.toLocaleString('en-IN')} goal</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/55">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{project.daysLeft}</p>
                  <p className="text-sm text-slate-600">Days Left</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalBackers}</p>
                  <p className="text-sm text-slate-600">Backers</p>
                </div>
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  onClick={toggleSavedCampaign}
                  className={`w-full rounded-xl px-4 py-3 font-semibold transition ${
                    isSavedCampaign
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-white/45 text-slate-700 border border-white/70 hover:bg-white/70'
                  }`}
                >
                  {profile ? (isSavedCampaign ? 'Saved Campaign' : 'Save Campaign') : 'Sign in to save campaign'}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount to invest"
                  min="1"
                  className="glass-input"
                />
                <button
                  onClick={handleInvest}
                  className="w-full btn-primary py-2"
                >
                  Invest Now
                </button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-600 mb-2">Founded by</p>
                <p className="font-semibold text-slate-900">{project.founder?.name || 'Founder Name'}</p>
                <p className="text-sm text-slate-600 mt-2">{project.founder?.bio || 'Founder bio'}</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Share</h3>
              <div className="flex gap-2">
                <button className="flex-1 btn-outline py-2">Facebook</button>
                <button className="flex-1 btn-outline py-2">Twitter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
