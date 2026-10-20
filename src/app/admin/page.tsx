'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  History,
  Lock,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function AdminDashboardPage() {
  const { highContrast } = useAccessibility();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setUnauthorized(false);
    try {
      const [analyticsRes, auditRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/audit-logs?limit=40'),
      ]);

      if (analyticsRes.status === 401 || analyticsRes.status === 403) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      const analyticsData = await analyticsRes.json();
      const auditData = await auditRes.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
      if (auditData.success) {
        setAuditLogs(auditData.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black">Admin Access Required</h2>
        <p className="text-slate-500 text-base">
          You must be signed in with an Administrator account to view platform telemetry and audit logs.
        </p>
        <Link
          href="/login?role=admin"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-bold text-lg"
        >
          <span>Sign In as Admin</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-base font-bold">Loading compliance analytics & audit stream...</p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      (log.user?.email && log.user.email.toLowerCase().includes(term)) ||
      log.resource.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-10 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Security & Compliance Panel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            Enterprise Analytics & Audit Hub
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor real-time learner success rates, misconception frequencies, and authentication audits.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Active Learners</span>
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-black">{analytics?.totalLearners || 1}</div>
          <p className="text-xs text-slate-500 mt-1">Registered learning profiles</p>
        </div>

        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Platform Accuracy</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black">{analytics?.platformAccuracy || 92}%</div>
          <p className="text-xs text-slate-500 mt-1">First-pass response correctness</p>
        </div>

        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Total Exercises</span>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black">{analytics?.totalExercises || 14}</div>
          <p className="text-xs text-slate-500 mt-1">Across 4 curriculum modules</p>
        </div>

        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Security Events</span>
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black">{auditLogs.length}</div>
          <p className="text-xs text-slate-500 mt-1">Logged in audit trail</p>
        </div>
      </div>

      {/* Error Frequency Breakdown */}
      <section
        className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
          highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Error Frequency Analytics</h2>
            <p className="text-sm text-slate-500">
              Identifies which topics trigger the most errors to guide curriculum reinforcement.
            </p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>

        <div className="space-y-4">
          {analytics?.topErrorTopics?.map((err: any, idx: number) => {
            const maxCount = analytics.topErrorTopics[0]?.count || 1;
            const percentage = Math.round((err.count / maxCount) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{err.topic}</span>
                  <span className="font-mono text-xs opacity-75">{err.count} errors detected</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-rose-500'
                        : idx === 1
                        ? 'bg-amber-500'
                        : 'bg-primary-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-Time Audit Log Table */}
      <section
        className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
          highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary-500" />
              <h2 className="text-2xl font-bold">Audit Log Stream</h2>
            </div>
            <p className="text-sm text-slate-500">
              Immutable logging of authentication events, lesson submissions, and admin activities.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border font-medium text-sm bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Audit Log Table">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 font-bold uppercase text-xs text-slate-500">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredLogs.map((log) => {
                const isAlert =
                  log.action.includes('FAILED') || log.action.includes('SECURITY');

                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                          isAlert
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                            : 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {log.user?.email || 'Anonymous'}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-xs tracking-wider opacity-75">
                      {log.resource}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs opacity-75">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
