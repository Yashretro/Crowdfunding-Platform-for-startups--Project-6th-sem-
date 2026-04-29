import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    image:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    daysLeft: '30',
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const goalValue = Number(formData.goal);
    const daysLeftValue = Number(formData.daysLeft);

    if (!formData.title || !formData.description || !formData.image || !formData.category || !goalValue || goalValue <= 0) {
      setError('Please fill all required fields with valid values.');
      return;
    }

    setLoading(true);

    try {
      const response = await projectService.create({
        title: formData.title,
        description: formData.description,
        goal: goalValue,
        image: formData.image,
        category: formData.category,
        daysLeft: Number.isNaN(daysLeftValue) || daysLeftValue <= 0 ? 30 : daysLeftValue,
        featured: false,
      });

      const createdProjectId = response?.data?.id;

      if (createdProjectId) {
        navigate(`/projects/${createdProjectId}`);
      } else {
        navigate('/projects');
      }
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || 'Could not create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8 max-w-3xl mx-auto">
          <p className="premium-chip mb-4 w-fit">Founder Action</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Start New Campaign</h1>
          <p className="text-slate-700 mb-8">Create your campaign and publish it to the projects marketplace.</p>

          {error && (
            <div className="bg-red-50/90 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={onChange}
                className="glass-input"
                placeholder="e.g. AgriSense IoT"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                className="glass-input min-h-28"
                placeholder="Tell investors what you are building and why it matters."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Funding Goal (₹)</label>
                <input
                  type="number"
                  name="goal"
                  min="1"
                  value={formData.goal}
                  onChange={onChange}
                  className="glass-input"
                  placeholder="500000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Duration (days)</label>
                <input
                  type="number"
                  name="daysLeft"
                  min="1"
                  value={formData.daysLeft}
                  onChange={onChange}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={onChange} className="glass-input">
                  <option value="Technology">Technology</option>
                  <option value="Health Tech">Health Tech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="Clean Tech">Clean Tech</option>
                  <option value="Food Tech">Food Tech</option>
                  <option value="FinTech">FinTech</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={onChange}
                  className="glass-input"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3 flex-wrap">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
              <Link to="/dashboard" className="btn-outline">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
