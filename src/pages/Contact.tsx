export default function Contact() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">Contact Us</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">We are here to help</h1>
          <p className="text-slate-700 mb-8 max-w-2xl">
            Reach our team for support, partnership requests, or campaign guidance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card card-race">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Support Contact</h2>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> support@kickscale.in</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Hours:</strong> Mon - Sat, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div className="card card-race">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Business Contact</h2>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> partnerships@kickscale.in</p>
                <p><strong>Phone:</strong> +91 98111 22334</p>
                <p><strong>Location:</strong> Uttar Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
