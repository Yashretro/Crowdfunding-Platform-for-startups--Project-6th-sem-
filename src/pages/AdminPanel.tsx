import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

interface ProjectPreview {
  id?: string;
  title?: string;
  category?: string;
  raised?: number;
  goal?: number;
  description?: string;
}

export default function AdminPanel() {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/projects');
      setProjects((res.data as ProjectPreview[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function approve(id: string) {
    await apiClient.post(`/admin/projects/${id}/approve`);
    fetchProjects();
  }

  async function reject(id: string) {
    await apiClient.post(`/admin/projects/${id}/reject`);
    fetchProjects();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {loading ? <div>Loading...</div> : null}
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{p.title}</h2>
                <div className="text-sm text-gray-600">{p.category} • ₹{p.raised}/{p.goal}</div>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => p.id && approve(p.id)}>Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => p.id && reject(p.id)}>Reject</button>
              </div>
            </div>
            {p.description ? <p className="mt-2 text-sm">{p.description}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
