import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import { defaultProjects, type DefaultProject } from '../data/defaultProjects';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

type Project = DefaultProject;

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.getAll({ featured: true, limit: 6 });
      const apiProjects = Array.isArray(response.data) ? response.data : [];
      setFeaturedProjects(apiProjects.length > 0 ? apiProjects : defaultProjects.slice(0, 3));
    } catch (error) {
      console.error('Error fetching projects:', error);
      setFeaturedProjects(defaultProjects.slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  useRealtimeSync(['projects', 'investments'], () => {
    fetchFeaturedProjects();
  });

  return (
    <div className="min-h-screen">
      <section className="py-16 sm:py-20">
        <div className="section-shell">
          <div className="glass-strong hero-glow reveal p-6 sm:p-10 lg:p-12">
            <div className="speed-divider mb-7"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="premium-chip-accent mb-4">Curated Startup Funding Network</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight text-slate-900">
                  Build, Fund, and <span className="text-gradient-hot">Accelerate</span> with <span className="text-gradient">kickscale</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-700 mb-8 max-w-xl shimmer-text">
                  A premium crowdfunding ecosystem where visionary founders meet high-intent backers and data-driven growth support.
                </p>
                <div className="flex gap-4 flex-wrap mb-8">
                  <Link to="/projects" className="btn-primary">Explore Projects</Link>
                  <Link to="/signup" className="btn-outline">Launch Campaign</Link>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="badge-glass">Verified Founders</span>
                  <span className="badge-glass">Smart Matchmaking</span>
                  <span className="badge-glass">Secure Transactions</span>
                </div>
              </div>

              <div className="stagger">
                <div className="kpi-card mb-4">
                  <p className="text-sm text-slate-600 mb-1">Live Funding Velocity</p>
                  <p className="text-3xl font-bold text-slate-900">₹1.2M <span className="text-base text-emerald-600">+18% this week</span></p>
                </div>
                <div className="kpi-card mb-4">
                  <p className="text-sm text-slate-600 mb-1">Founder Success Probability</p>
                  <p className="text-3xl font-bold text-slate-900">94%</p>
                </div>
                <div className="kpi-card">
                  <p className="text-sm text-slate-600 mb-1">Avg. Time to First Backer</p>
                  <p className="text-3xl font-bold text-slate-900">3.6 days</p>
                </div>
              </div>
            </div>

            <div className="ticker-wrap mt-8">
              <div className="ticker-track">
                <span className="ticker-item">LIVE: Fintech campaign crossed 82% in 9 days</span>
                <span className="ticker-item">TRENDING: Healthcare AI up +34% weekly traction</span>
                <span className="ticker-item">NEW: 14 high-potential founders verified today</span>
                <span className="ticker-item">LIVE: Community backers deployed ₹420K in 24h</span>
                <span className="ticker-item">LIVE: Fintech campaign crossed 82% in 9 days</span>
                <span className="ticker-item">TRENDING: Healthcare AI up +34% weekly traction</span>
                <span className="ticker-item">NEW: 14 high-potential founders verified today</span>
                <span className="ticker-item">LIVE: Community backers deployed ₹420K in 24h</span>
              </div>
            </div>

            <div className="telemetry-grid mt-8">
              <div className="telemetry-item">
                <p className="telemetry-label">Pipeline Health</p>
                <p className="telemetry-value">A+</p>
              </div>
              <div className="telemetry-item">
                <p className="telemetry-label">Weekly Backer Demand</p>
                <p className="telemetry-value">12.7K</p>
              </div>
              <div className="telemetry-item">
                <p className="telemetry-label">Avg. Campaign Momentum</p>
                <p className="telemetry-value">+22%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger">
            <div className="card card-race card-tilt hover-lift text-center">
              <h3 className="text-4xl font-bold text-sky-700 mb-2">₹50M+</h3>
              <p className="text-slate-600">Total Funded</p>
            </div>
            <div className="card card-race card-tilt hover-lift text-center">
              <h3 className="text-4xl font-bold text-sky-700 mb-2">5000+</h3>
              <p className="text-slate-600">Successful Projects</p>
            </div>
            <div className="card card-race card-tilt hover-lift text-center">
              <h3 className="text-4xl font-bold text-sky-700 mb-2">50K+</h3>
              <p className="text-slate-600">Active Investors</p>
            </div>
            <div className="card card-race card-tilt hover-lift text-center">
              <h3 className="text-4xl font-bold text-sky-700 mb-2">95%</h3>
              <p className="text-slate-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="premium-chip mb-3 w-fit">Handpicked This Week</p>
              <h2 className="section-title mb-0">Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn-outline w-fit">Browse Portfolio</Link>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-600">Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
              {featuredProjects.map((project) => (
                <div key={project.id} className="card card-race card-tilt hover-lift">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <span className="badge-glass mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-slate-700 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>₹{project.raised.toLocaleString('en-IN')}</span>
                      <span>{Math.round((project.raised / project.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">of ₹{project.goal.toLocaleString('en-IN')} goal</p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-600">{project.daysLeft} days left</span>
                    <span className="text-sm text-slate-600">({Math.round((project.raised / project.goal) * 100)}%)</span>
                  </div>

                  <Link 
                    to={`/projects/${project.id}`}
                    className="w-full block text-center btn-primary"
                  >
                    View Project
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-outline">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <div className="lg:col-span-2 glass-strong hero-glow p-8 flex flex-col justify-between">
              <div>
                <p className="premium-chip-accent mb-4 w-fit">Community Proof</p>
                <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  Why founders and backers choose kickscale
                </h2>
                <p className="text-slate-700 text-lg mb-8">
                  A cleaner funding experience, stronger project visibility, and a polished dashboard that makes every campaign feel more trustworthy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Active backers</p>
                  <p className="telemetry-value">50K+</p>
                </div>
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Campaign success</p>
                  <p className="telemetry-value">95%</p>
                </div>
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Avg. funding time</p>
                  <p className="telemetry-value">3.6 days</p>
                </div>
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Verified founders</p>
                  <p className="telemetry-value">1.4K</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
              <div className="glass-panel p-6 rounded-2xl hover-lift">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-slate-900 font-semibold">Aarav Mehta</p>
                    <p className="text-sm text-slate-500">Founder, SolarGrid Mini</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold">
                    AM
                  </div>
                </div>
                <p className="text-slate-700 mb-4">
                  “The dashboard made it easy to show traction, and the campaign page made my startup look instantly more credible.”
                </p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Raised ₹32,000</span>
                  <span>18 days left</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl hover-lift">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-slate-900 font-semibold">Sara Khan</p>
                    <p className="text-sm text-slate-500">Investor, HealthNest AI</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold">
                    SK
                  </div>
                </div>
                <p className="text-slate-700 mb-4">
                  “The project cards are easy to scan, and the progress visuals make it simple to decide where to invest next.”
                </p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Backed 4 campaigns</span>
                  <span>Top supporter</span>
                </div>
              </div>

              <div className="md:col-span-2 glass-panel p-6 rounded-2xl bg-white/50 border-white/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="premium-chip mb-3 w-fit">Live Momentum</p>
                    <h3 className="text-2xl font-bold text-slate-900">Built to feel active, credible, and investor-ready</h3>
                  </div>
                  <Link to="/signup" className="btn-primary w-fit">Join the Platform</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="telemetry-item">
                    <p className="telemetry-label mb-1">New campaigns today</p>
                    <p className="telemetry-value">14</p>
                  </div>
                  <div className="telemetry-item">
                    <p className="telemetry-label mb-1">Funds deployed</p>
                    <p className="telemetry-value">₹420K</p>
                  </div>
                  <div className="telemetry-item">
                    <p className="telemetry-label mb-1">Average rating</p>
                    <p className="telemetry-value">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell">
          <div className="text-center mb-12">
            <p className="premium-chip mx-auto mb-3 w-fit">Founder Journey</p>
            <h2 className="section-title mb-3">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">A visual three-step pipeline from idea validation to funded execution.</p>
          </div>

          <div className="glass-panel p-5 mb-8 hidden md:block">
            <div className="relative grid grid-cols-3 items-center">
              <div className="text-center">
                <p className="telemetry-label mb-1">Step 01</p>
                <p className="font-semibold text-slate-800">Create Campaign</p>
              </div>
              <div className="text-center">
                <p className="telemetry-label mb-1">Step 02</p>
                <p className="font-semibold text-slate-800">Receive Backing</p>
              </div>
              <div className="text-center">
                <p className="telemetry-label mb-1">Step 03</p>
                <p className="font-semibold text-slate-800">Scale Business</p>
              </div>

              <div className="absolute left-[20%] right-[20%] top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-sky-500 via-blue-600 to-orange-400 rounded-full"></div>
              <div className="absolute left-[16%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-500 shadow"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 shadow"></div>
              <div className="absolute right-[16%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-400 shadow"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">1</div>
              <svg className="w-12 h-12 text-sky-700 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M7 4v6M17 4v6M5 10h14v10H5z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Project</h3>
              <p className="text-slate-600 text-sm">Share your startup vision, roadmap, and funding target in a polished campaign profile.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">2</div>
              <svg className="w-12 h-12 text-blue-700 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="3" />
                <path d="M4 20c1.5-3 4.2-5 8-5s6.5 2 8 5" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get Funded</h3>
              <p className="text-slate-600 text-sm">Backers discover your campaign, review traction, and invest through secure checkout.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">3</div>
              <svg className="w-12 h-12 text-orange-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 18h16M6 16V8m6 8V5m6 11v-6" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Build & Grow</h3>
              <p className="text-slate-600 text-sm">Use capital to execute milestones, publish updates, and scale with community trust.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-shell text-center">
          <div className="glass-panel reveal py-12 px-6 sm:px-10">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Ready to Scale Like a Category Leader?</h2>
            <p className="text-xl text-slate-700 mb-8">Join ambitious founders building durable startups with the backing they deserve.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/signup" className="btn-primary inline-block">Get Started Today</Link>
              <Link to="/projects" className="btn-outline inline-block">See Live Campaigns</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
