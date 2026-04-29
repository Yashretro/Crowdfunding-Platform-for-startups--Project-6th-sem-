import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';

interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  category: string;
  daysLeft: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trending');

  const categories = ['all', 'Technology', 'Healthcare', 'Retail', 'Finance', 'Education', 'Entertainment'];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, category, searchTerm, sortBy]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'trending') {
      filtered.sort((a, b) => b.raised - a.raised);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    } else if (sortBy === 'closing') {
      filtered.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8">
        <div className="section-shell">
          <div className="glass-strong reveal p-6 sm:p-8">
            <p className="premium-chip mb-3 w-fit">Investment Marketplace</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Projects</h1>
            <p className="text-slate-600">Find high-potential startups with clear traction and transparent milestones.</p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="sticky top-16 z-40 py-2">
        <div className="section-shell py-6">
          <div className="glass-panel reveal p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
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

            {/* Results */}
            <div className="flex items-center justify-end">
              <span className="text-slate-700 font-medium">{filteredProjects.length} projects found</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-600 py-12">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No projects found. Try adjusting your filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card card-race card-tilt hover-lift">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <span className="badge-glass mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-slate-700 mb-4 line-clamp-2">{project.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span>${project.raised.toLocaleString()}</span>
                      <span>{Math.round((project.raised / project.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">of ${project.goal.toLocaleString()} goal</p>
                  </div>

                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-slate-600">{project.daysLeft} days left</span>
                    <span className="text-sky-700 font-semibold">{Math.round((project.raised / project.goal) * 100)}% funded</span>
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
        </div>
      </section>
    </div>
  );
}
