import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-700 mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
              <p>
                We collect account details such as name, email, profile type (founder or investor), and platform activity
                data such as projects viewed, investments made, and transaction history.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">2. How We Use Information</h2>
              <p>
                Your information is used to create accounts, process investments, improve user experience, provide support,
                and secure the platform from misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">3. Data Sharing</h2>
              <p>
                We do not sell personal data. We may share limited operational information with trusted service providers
                only for hosting, analytics, and payment-related support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">4. Data Security</h2>
              <p>
                We apply reasonable technical and organizational safeguards to protect your data. No internet service is
                completely risk-free, but we continuously improve security practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">5. Your Rights</h2>
              <p>
                You may request profile updates, account deletion, or clarification about data usage by contacting support.
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