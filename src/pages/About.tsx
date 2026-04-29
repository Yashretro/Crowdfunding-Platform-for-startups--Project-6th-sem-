import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">About kickscale</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Built to connect founders and backers</h1>
          <p className="text-slate-700 mb-8 max-w-3xl">
            kickscale is a crowdfunding platform focused on helping early-stage startups raise funds while giving investors
            transparent project tracking and investment visibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-race">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h2>
              <p className="text-slate-700">Make startup fundraising more transparent, data-driven, and community-powered.</p>
            </div>
            <div className="card card-race">
              <h2 className="text-xl font-bold text-slate-900 mb-2">For Founders</h2>
              <p className="text-slate-700">Launch campaigns, share milestones, and build trust with consistent updates.</p>
            </div>
            <div className="card card-race">
              <h2 className="text-xl font-bold text-slate-900 mb-2">For Investors</h2>
              <p className="text-slate-700">Discover curated projects, invest with confidence, and track transactions clearly.</p>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/projects" className="btn-primary inline-block">Explore Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
