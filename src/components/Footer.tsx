import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-6 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">KS</span>
              </div>
              <span className="text-xl font-bold text-slate-900">kickscale</span>
            </div>
            <p className="text-slate-600">Empowering startups through community funding</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Quick Links</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/" className="hover:text-slate-900 transition">Home</Link></li>
              <li><Link to="/projects" className="hover:text-slate-900 transition">Projects</Link></li>
              <li><Link to="/how-it-works" className="hover:text-slate-900 transition">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-slate-900 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Resources</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/blog" className="hover:text-slate-900 transition">Blog</Link></li>
              <li><Link to="/help" className="hover:text-slate-900 transition">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-slate-900 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-slate-900 transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-slate-900 transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 mb-4 md:mb-0">&copy; 2024 kickscale. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 11.4-2.2c.4.6.7 1.2 1 1.9a7 7 0 01-2 2m-1.4-1.6l2.8-3m0 0l2.8 3m-2.8-3v9.5" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" stroke="currentColor" strokeWidth="2" fill="none" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.829 0-9.74h3.554v1.379l-.022.033h.022v-.033c.43-.664 1.199-1.61 2.915-1.61 2.132 0 3.729 1.39 3.729 4.377v5.594zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.968-1.715 1.197 0 1.915.762 1.915 1.715 0 .953-.718 1.715-1.968 1.715zm1.581 11.597H3.715V9.567h3.203v10.885zM22.225 0H1.771C.798 0 0 .774 0 1.729v20.542C0 23.226.798 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
            </a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
