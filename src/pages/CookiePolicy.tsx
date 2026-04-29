import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Cookie Policy</h1>
          <p className="text-slate-700 mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">1. What Are Cookies?</h2>
              <p>
                Cookies are small data files stored on your browser to remember session information and improve website
                functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">2. Types of Cookies We Use</h2>
              <p>
                We use essential cookies for login sessions, preference cookies for UI settings, and analytics cookies to
                understand feature usage and improve performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">3. Managing Cookies</h2>
              <p>
                You can control or delete cookies through browser settings. Disabling essential cookies may impact login and
                dashboard functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">4. Policy Updates</h2>
              <p>
                We may update this policy as the platform evolves. The latest date is shown at the top of this page.
              </p>
            </section>
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/help" className="btn-outline">Contact Support</Link>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}