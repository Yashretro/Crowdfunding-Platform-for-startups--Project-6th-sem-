import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { investmentService } from '../services/api';

interface TransactionItem {
  id: string;
  projectId?: string;
  projectTitle?: string;
  amount: number;
  createdAt: string;
  status?: 'pending' | 'confirmed' | 'failed';
}

type DateFilter = 'all' | 'today' | '7d' | '30d';

export default function Transactions() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest'>('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadTransactions();
  }, [navigate]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await investmentService.getAll();
      const apiData = Array.isArray(response.data) ? response.data : [];
      const mappedApiData: TransactionItem[] = apiData.map((item) => {
        const obj = (typeof item === 'object' && item !== null) ? item as Record<string, unknown> : {};
        const proj = (obj.project && typeof obj.project === 'object') ? (obj.project as Record<string, unknown>) : undefined;
        return {
          id: String(obj.id ?? obj._id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
          projectId: String(obj.projectId ?? proj?.id ?? ''),
          projectTitle: String(obj.projectTitle ?? proj?.title ?? 'Project'),
          amount: Number(obj.amount ?? 0),
          createdAt: String(obj.createdAt ?? new Date().toISOString()),
          status: (String(obj.status ?? obj.paymentStatus ?? 'confirmed') as 'pending' | 'confirmed' | 'failed'),
        };
      });

      if (mappedApiData.length > 0) {
        setTransactions(mappedApiData);
      } else {
        const localTracked = localStorage.getItem('trackedInvestments');
        setTransactions(localTracked ? JSON.parse(localTracked) : []);
      }
    } catch (err) {
      const localTracked = localStorage.getItem('trackedInvestments');
      setTransactions(localTracked ? JSON.parse(localTracked) : []);
      setError('Showing local tracked investments because the backend is unavailable.');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const minAmountValue = Number(minAmount || 0);

    return [...transactions]
      .filter((transaction) => {
        const matchesSearch = transaction.projectTitle?.toLowerCase().includes(search.toLowerCase()) ?? true;
        const matchesAmount = !minAmount || Number(transaction.amount) >= minAmountValue;

        let matchesDate = true;
        const createdDate = new Date(transaction.createdAt);
        const differenceInMs = now.getTime() - createdDate.getTime();
        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'today') {
          matchesDate = createdDate.toDateString() === now.toDateString();
        } else if (dateFilter === '7d') {
          matchesDate = differenceInDays <= 7;
        } else if (dateFilter === '30d') {
          matchesDate = differenceInDays <= 30;
        }

        return matchesSearch && matchesAmount && matchesDate;
      })
      .sort((a, b) => {
        if (sortOrder === 'highest') {
          return Number(b.amount) - Number(a.amount);
        }

        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();

        return sortOrder === 'oldest' ? timeA - timeB : timeB - timeA;
      });
  }, [transactions, search, minAmount, dateFilter, sortOrder]);

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  const averageAmount = filteredTransactions.length ? totalAmount / filteredTransactions.length : 0;
  const latestTransaction = filteredTransactions[0];

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="section-shell space-y-8">
        <div className="glass-strong p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="premium-chip mb-4 w-fit">Transaction History</p>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">Track every investment in one place</h1>
              <p className="text-slate-700 max-w-2xl">
                Review all tracked investments, filter them by project or date, and monitor your funding activity over time.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/dashboard" className="btn-outline">Back to Dashboard</Link>
              <Link to="/projects" className="btn-primary">Browse Projects</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-race">
            <p className="telemetry-label mb-2">Filtered Total</p>
            <p className="text-3xl font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="card card-race">
            <p className="telemetry-label mb-2">Transaction Count</p>
            <p className="text-3xl font-bold text-slate-900">{filteredTransactions.length}</p>
          </div>
          <div className="card card-race">
            <p className="telemetry-label mb-2">Average Amount</p>
            <p className="text-3xl font-bold text-slate-900">₹{averageAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project title"
              className="glass-input"
            />
            <input
              type="number"
              value={minAmount}
              onChange={(event) => setMinAmount(event.target.value)}
              placeholder="Minimum amount"
              min="0"
              className="glass-input"
            />
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as DateFilter)}
              className="glass-input"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'newest' | 'oldest' | 'highest')}
              className="glass-input"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest amount</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center text-slate-600 py-10">Loading transaction history...</div>
          ) : error ? (
            <p className="mb-4 text-sm text-amber-700 bg-amber-50/90 border border-amber-200 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-slate-600 py-12">
                <p>No transactions found for the selected filters.</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/60 rounded-2xl bg-white/35 px-4 py-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{transaction.projectTitle || 'Project'}</p>
                    <p className="text-sm text-slate-600">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                          transaction.status === 'failed'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : transaction.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {transaction.status || 'confirmed'}
                      </span>
                      <p className="text-lg font-bold text-slate-900">₹{Number(transaction.amount).toLocaleString('en-IN')}</p>
                      <p className="text-sm text-slate-600">Tracked investment</p>
                    </div>
                    <Link to={transaction.projectId ? `/projects/${transaction.projectId}` : '/projects'} className="btn-outline">
                      View Project
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {latestTransaction && (
            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
              <p className="telemetry-label mb-1">Latest Transaction</p>
              <p className="font-semibold text-slate-900">{latestTransaction.projectTitle || 'Project'}</p>
              <p className="text-sm text-slate-600">
                ₹{Number(latestTransaction.amount).toLocaleString('en-IN')} on {new Date(latestTransaction.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}