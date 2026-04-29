import { Link } from 'react-router-dom';

const posts = [
  {
    title: 'How to build investor trust in your first campaign',
    excerpt: 'A practical guide for founders on storytelling, validation, and milestone communication.',
    date: 'April 08, 2026',
  },
  {
    title: 'What smart backers evaluate before investing',
    excerpt: 'Key metrics investors check before they fund startup campaigns.',
    date: 'April 05, 2026',
  },
  {
    title: 'Campaign update templates that keep momentum high',
    excerpt: 'Use structured updates to keep your community engaged through the campaign journey.',
    date: 'April 02, 2026',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">kickscale Blog</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Insights for founders and investors</h1>
          <p className="text-slate-700 mb-8">Tips, trends, and practical playbooks to run better campaigns.</p>

          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.title} className="card card-race">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{post.date}</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{post.title}</h2>
                <p className="text-slate-700">{post.excerpt}</p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/help" className="btn-outline inline-block">Need help? Visit Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
