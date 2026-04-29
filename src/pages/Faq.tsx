import { Link } from 'react-router-dom';

const faqItems = [
  {
    question: 'How do I start a campaign on kickscale?',
    answer:
      'Create an account as a founder, go to your dashboard, and use the campaign creation flow to add your goal, story, category, and campaign media.',
  },
  {
    question: 'How do investors fund a project?',
    answer:
      'Open any project detail page, enter the investment amount, and click Invest Now. The transaction is then tracked in your dashboard and transaction history.',
  },
  {
    question: 'Where can I see my transaction history?',
    answer:
      'Go to the Transactions page from the navbar or dashboard. You can search, filter by amount/date, and sort transactions by newest, oldest, or highest amount.',
  },
  {
    question: 'What do transaction statuses mean?',
    answer:
      'Confirmed means the investment is saved and counted, Pending means it is temporarily saved locally, and Failed means the transaction did not complete.',
  },
  {
    question: 'Can I use kickscale on mobile?',
    answer:
      'Yes. The platform is responsive and supports campaign browsing, investing, and account actions on mobile and desktop screens.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'Use the Help Center page for support details. You can call +91 98765 43210 or email support@kickscale.in during support hours.',
  },
];

export default function Faq() {
  return (
    <div className="min-h-screen py-12">
      <div className="section-shell">
        <div className="glass-strong p-6 sm:p-8">
          <p className="premium-chip mb-4 w-fit">FAQ</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-700 mb-8 max-w-2xl">
            Quick answers to common questions from founders and investors using kickscale.
          </p>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={item.question} className="card card-race group" open={index === 0}>
                <summary className="cursor-pointer list-none font-semibold text-slate-900 text-lg flex items-center justify-between">
                  {item.question}
                  <span className="ml-4 text-slate-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/help" className="btn-outline">Contact Support</Link>
            <Link to="/projects" className="btn-primary">Explore Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}