import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { investmentService, projectService } from '../services/api';
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

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useRealtimeSync(['projects', 'investments', 'payments'], (event) => {
    if (event.resource === 'projects' && (!event.projectId || event.projectId === id)) {
      fetchProject();
    }
    if (event.resource === 'investments' && event.projectId === id) {
      fetchProject();
    }
  });

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

            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates</h2>
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
                  <p className="text-2xl font-bold text-slate-900">1.2K</p>
                  <p className="text-sm text-slate-600">Backers</p>
                </div>
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
