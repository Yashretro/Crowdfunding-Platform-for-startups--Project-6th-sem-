import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-700 mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing kickscale, you agree to these terms. If you do not agree, please discontinue use of the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">2. User Accounts</h2>
              <p>
                You are responsible for maintaining account credentials and for activity performed under your account.
                Provide accurate information during registration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">3. Campaign and Investment Rules</h2>
              <p>
                Founders must provide truthful campaign information. Investors should evaluate risks before funding.
                kickscale is a platform facilitator and does not guarantee returns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">4. Prohibited Activity</h2>
              <p>
                Fraud, misrepresentation, abusive behavior, unauthorized access attempts, and unlawful content are strictly
                prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, kickscale is not liable for indirect or consequential damages arising
                from platform use.
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