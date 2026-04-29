import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Create Campaign',
    detail: 'Founders publish project details, funding goals, and roadmap milestones.',
  },
  {
    title: 'Receive Investments',
    detail: 'Investors review campaigns and fund projects directly through the platform.',
  },
  {
    title: 'Track Progress',
    detail: 'Both founders and investors monitor transactions, status, and campaign momentum.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">How It Works</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Simple 3-step crowdfunding flow</h1>
          <p className="text-slate-700 mb-8 max-w-2xl">From campaign launch to transaction tracking, everything is designed to be clear and transparent.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="card card-race text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 text-white mx-auto flex items-center justify-center text-xl font-bold mb-4">
                  {index + 1}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h2>
                <p className="text-slate-700">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/projects" className="btn-primary">Browse Projects</Link>
            <Link to="/signup" className="btn-outline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
