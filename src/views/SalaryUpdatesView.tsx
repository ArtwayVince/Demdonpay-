import React, { useState } from 'react';
import {
  TrendingUp,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  PieChart,
  PlusCircle,
  Flag,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatusBadge } from '../components/StatusBadge';
import { OfficialDisclaimerBanner } from '../components/OfficialDisclaimerBanner';

interface Props {
  onOpenReportModal: (defaultOrgId?: string) => void;
  onOpenFlagModal: (
    targetType: 'salary_report' | 'official_announcement',
    targetId: string,
    summary: string
  ) => void;
}

export const SalaryUpdatesView: React.FC<Props> = ({ onOpenReportModal, onOpenFlagModal }) => {
  const { organisations, announcements, salaryReports } = useData();

  const [feedType, setFeedType] = useState<'all' | 'official' | 'employee' | 'disputed'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Combine feeds with explicit source tagging
  const combinedItems = [
    ...announcements.map((ann) => ({
      id: ann.id,
      type: 'official' as const,
      orgId: ann.orgId,
      orgName: ann.orgName,
      title: ann.title,
      content: ann.content,
      status: ann.status,
      payrollPeriod: ann.payrollPeriod,
      authorName: ann.publisherName,
      circularNumber: ann.circularNumber,
      isOfficial: true,
      isDisputed: false,
      timestamp: ann.createdAt,
    })),
    ...salaryReports.map((rep) => ({
      id: rep.id,
      type: 'employee' as const,
      orgId: rep.orgId,
      orgName: rep.orgName || 'Organisation',
      title: `${rep.userDisplayName} reported: ${
        rep.status === 'salary_received'
          ? 'Salary Received'
          : rep.status === 'partial_payment'
          ? `Partial Payment (${rep.partialPercentage || 50}%)`
          : 'Salary Pending'
      }`,
      content: rep.notes || 'No additional note provided.',
      status: rep.status,
      payrollPeriod: rep.payrollPeriod,
      authorName: rep.userDisplayName,
      circularNumber: undefined,
      isOfficial: false,
      isDisputed: rep.isDisputed || false,
      timestamp: rep.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply filters
  const filteredItems = combinedItems.filter((item) => {
    const matchesFeed =
      feedType === 'all' ||
      (feedType === 'official' && item.isOfficial) ||
      (feedType === 'employee' && !item.isOfficial) ||
      (feedType === 'disputed' && (item.isDisputed || item.status === 'disputed_by_moderator'));

    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;

    const matchesSearch =
      item.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFeed && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Banner */}
      <OfficialDisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Live Salary Status & Reports Stream
          </h1>
          <p className="text-xs text-slate-400">
            Real-time verified official employer circulars alongside crowdsourced employee experiences
          </p>
        </div>

        <button
          onClick={() => onOpenReportModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report My Salary</span>
        </button>
      </div>

      {/* Filter and Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search updates by organisation, bank, or keyword..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold mr-1">Source:</span>
            <button
              onClick={() => setFeedType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                feedType === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => setFeedType('official')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                feedType === 'official'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Circulars Only
            </button>
            <button
              onClick={() => setFeedType('employee')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                feedType === 'employee'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Employee Reports
            </button>
            <button
              onClick={() => setFeedType('disputed')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                feedType === 'disputed'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Disputed Claims
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Showing {filteredItems.length} records
          </div>
        </div>
      </div>

      {/* Stream Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No updates match your selected filter criteria.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-3 transition-all ${
                item.isDisputed
                  ? 'border-red-500/50 bg-red-950/10'
                  : item.isOfficial
                  ? 'border-emerald-700/50 hover:border-emerald-600 shadow-md shadow-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-white text-base">
                      {item.orgName}
                    </span>
                    <StatusBadge
                      status={item.status as any}
                      isOfficial={item.isOfficial}
                      size="sm"
                    />
                    {item.isDisputed && (
                      <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        Flagged / Under Dispute
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onOpenFlagModal(
                      item.isOfficial ? 'official_announcement' : 'salary_report',
                      item.id,
                      `${item.orgName}: ${item.title}`
                    )
                  }
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                  title="Flag suspicious item, prank, or false claim"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Content body */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                {item.content}
              </p>

              {/* Verification & Metadata footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  {item.isOfficial ? (
                    <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Official Employer Circular
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Reported by <strong>{item.authorName}</strong> (Self-reported experience)
                    </span>
                  )}
                  {item.circularNumber && (
                    <span className="text-slate-500 font-mono">
                      • Circular Ref: {item.circularNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span>Period: <strong>{item.payrollPeriod}</strong></span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
