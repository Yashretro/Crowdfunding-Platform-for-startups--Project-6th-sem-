import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">Help Center</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Need help with kickscale?</h1>
          <p className="text-slate-700 max-w-2xl mb-8">
            Reach out anytime if you need support with campaigns, investments, or account access.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card card-race">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-3 text-slate-700">
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Email:</strong> support@kickscale.in</p>
                <p><strong>Support Hours:</strong> Mon - Sat, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div className="card card-race">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Support</h2>
              <p className="text-slate-700 mb-4">
                For fast assistance, use the options below:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+919876543210" className="btn-primary text-center">
                  Call Now
                </a>
                <a href="mailto:support@kickscale.in" className="btn-outline text-center">
                  Email Support
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/" className="btn-outline inline-block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}