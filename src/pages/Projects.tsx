import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectService, userService } from '../services/api';
import { defaultProjects, type DefaultProject } from '../data/defaultProjects';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

type Project = DefaultProject;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const categories = ['all', 'Clean Tech', 'Health Tech', 'EdTech', 'Food Tech', 'Entertainment', 'Finance'];

  const filterAndSortProjects = useCallback(() => {
    let filtered = [...projects];

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'trending') {
      filtered.sort((a, b) => b.raised - a.raised);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'closing') {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    setFilteredProjects(filtered);
  }, [projects, category, searchTerm, sortBy]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setWatchlist([]);
      return;
    }

    const loadWatchlist = async () => {
      setWatchlistLoading(true);
      try {
        const response = await userService.getProfile();
        const profile = response.data as { watchlist?: string[] };
        setWatchlist(Array.isArray(profile.watchlist) ? profile.watchlist : []);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setWatchlistLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

  useRealtimeSync(['projects', 'investments'], () => {
    fetchProjects();
  });

  const categoryCounts = useMemo(() => {
    return projects.reduce<Record<string, number>>((counts, project) => {
      const key = project.category;
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }, [projects]);

  const hasActiveFilters = category !== 'all' || searchTerm.trim().length > 0 || sortBy !== 'trending';

  const clearFilters = () => {
    setCategory('all');
    setSearchTerm('');
    setSortBy('trending');
  };

  const toggleWatchlist = async (projectId: string) => {
    if (!localStorage.getItem('token')) {
      return;
    }

    try {
      const response = await userService.toggleWatchlist(projectId);
      const nextWatchlist = Array.isArray(response.data?.watchlist) ? response.data.watchlist : [];
      setWatchlist(nextWatchlist);
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      const apiProjects = Array.isArray(response.data) ? response.data : [];
      setProjects(apiProjects.length > 0 ? apiProjects : defaultProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-8">
        <div className="section-shell">
          <div className="glass-strong reveal p-6 sm:p-8">
            <p className="premium-chip mb-3 w-fit">Investment Marketplace</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Projects</h1>
            <p className="text-slate-600">Find high-potential startups with clear traction and transparent milestones.</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="section-shell">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
            <aside className="glass-strong reveal p-6 sticky top-24 space-y-6">
              <div>
                <p className="premium-chip mb-3 w-fit">Filter Sidebar</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Refine your discovery</h2>
                <p className="text-sm text-slate-600">Use quick filters to move faster through the marketplace.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Search</label>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-input"
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="closing">Closing Soon</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-700">Categories</label>
                  <button type="button" onClick={clearFilters} className="text-xs font-semibold text-sky-700 hover:underline">
                    Clear all
                  </button>
                </div>

                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                        category === cat
                          ? 'bg-sky-600 text-white shadow-lg'
                          : 'bg-white/35 text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      <span className="font-medium">{cat === 'all' ? 'All Categories' : cat}</span>
                      <span className={`text-xs font-semibold rounded-full px-2 py-1 ${category === cat ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                        {cat === 'all' ? projects.length : categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="telemetry-grid">
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Projects</p>
                  <p className="telemetry-value">{projects.length}</p>
                </div>
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Visible</p>
                  <p className="telemetry-value">{filteredProjects.length}</p>
                </div>
                <div className="telemetry-item">
                  <p className="telemetry-label mb-1">Status</p>
                  <p className="telemetry-value">Live</p>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {category !== 'all' && <span className="badge-glass">Category: {category}</span>}
                  {searchTerm && <span className="badge-glass">Search: {searchTerm}</span>}
                  {sortBy !== 'trending' && <span className="badge-glass">Sort: {sortBy}</span>}
                </div>
              )}
            </aside>

            <div className="space-y-5">
              <div className="glass-panel reveal p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-[0.14em] mb-1">Marketplace View</p>
                  <h3 className="text-2xl font-bold text-slate-900">{filteredProjects.length} projects found</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge-glass">Trending UI</span>
                  <span className="badge-glass">Animated cards</span>
                  <span className="badge-glass">Fast filtering</span>
                </div>
              </div>

              {loading ? (
            <div className="text-center text-gray-600 py-12">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No projects found. Reset filters or reload the page.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 stagger">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card card-race card-tilt hover-lift">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = 'https://via.placeholder.com/600x300?text=No+Image';
                    }}
                  />
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

                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-slate-600">{project.daysLeft} days left</span>
                    <span className="text-sky-700 font-semibold">{Math.round((project.raised / project.goal) * 100)}% funded</span>
                  </div>

                  {localStorage.getItem('token') && (
                    <button
                      type="button"
                      onClick={() => toggleWatchlist(project.id)}
                      disabled={watchlistLoading}
                      className={`w-full mb-3 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        watchlist.includes(project.id)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white/45 text-slate-700 border border-white/70 hover:bg-white/70'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {watchlist.includes(project.id) ? 'Saved Campaign' : 'Save Campaign'}
                    </button>
                  )}

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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
