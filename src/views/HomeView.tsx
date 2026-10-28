import React from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Share2,
  Search,
  PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { OfficialDisclaimerBanner } from '../components/OfficialDisclaimerBanner';
import { StatusBadge } from '../components/StatusBadge';
import { NavTab } from '../components/Navigation';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenReportModal: (defaultOrgId?: string) => void;
  onOpenAnnounceModal: (defaultOrgId?: string) => void;
  onOpenProposeOrgModal: () => void;
  onOpenInviteModal: (orgName?: string) => void;
  onSelectOrg: (orgId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenReportModal,
  onOpenAnnounceModal,
  onOpenProposeOrgModal,
  onOpenInviteModal,
  onSelectOrg,
}) => {
  const { userProfile, followedOrgIds, activeRole, isAdmin, isOrgRep } = useAuth();
  const { organisations, announcements, salaryReports } = useData();

  // Organisations followed by the user
  const followedOrgs = organisations.filter(o => followedOrgIds.includes(o.id));

  // Recent official announcements
  const recentAnnouncements = announcements.slice(0, 3);

  // Recent employee reports
  const recentReports = salaryReports.slice(0, 5);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* 1. Regulatory & Trust Notice */}
      <OfficialDisclaimerBanner />

      {/* 2. Hero Welcome & Fast Actions */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>October 2026 Payday Cycle Live</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dem Don Pay for Your Organisation?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify official salary circulars from authenticated employers or crowdsource your personal receipt status with fellow Nigerian workers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenReportModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report My Salary</span>
            </button>

            <button
              onClick={() => onOpenInviteModal()}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Invite Colleagues</span>
            </button>

            {(isOrgRep || isAdmin) && (
              <button
                onClick={() => onOpenAnnounceModal()}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Publish Circular</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Followed Organisations Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Followed Organisations</h2>
            <span className="text-xs text-slate-400 font-mono">({followedOrgs.length})</span>
          </div>
          <button
            onClick={() => onNavigate('organisations')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {followedOrgs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              You haven't followed any workplace or ministry yet.
            </p>
            <button
              onClick={() => onNavigate('organisations')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              Browse Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedOrgs.map((org) => {
              const rec = org.receivedCount || 0;
              const notRec = org.notReceivedCount || 0;
              const part = org.partialCount || 0;
              const total = rec + notRec + part || 1;
              const recPct = Math.round((rec / total) * 100);

              return (
                <div
                  key={org.id}
                  onClick={() => onSelectOrg(org.id)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition-all hover:shadow-lg cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {org.name}
                        </span>
                        {org.acronym && (
                          <span className="text-xs text-slate-400 font-mono">({org.acronym})</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {org.sector === 'public' ? 'Public Sector (MDA)' : 'Private Corporate'} • {org.industry}
                      </div>
                    </div>

                    {org.isVerifiedOnDdP ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Verified HR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0">
                        Unclaimed
                      </span>
                    )}
                  </div>

                  {/* Aggregate breakdown */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Employee Reports:</span>
                      <span className="text-white font-bold">{rec + notRec + part} posted</span>
                    </div>

                    {/* Multi-segment progress bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(rec / total) * 100}%` }}
                        className="bg-teal-500 h-full"
                        title={`${rec} report received`}
                      />
                      <div
                        style={{ width: `${(notRec / total) * 100}%` }}
                        className="bg-rose-500 h-full"
                        title={`${notRec} report pending`}
                      />
                      <div
                        style={{ width: `${(part / total) * 100}%` }}
                        className="bg-orange-500 h-full"
                        title={`${part} report partial`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-teal-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {rec} Received
                      </span>
                      <span className="text-rose-400 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {notRec} Pending
                      </span>
                      {part > 0 && (
                        <span className="text-orange-400 font-medium flex items-center gap-1">
                          <PieChart className="w-3 h-3" /> {part} Partial
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-500 italic">
                      Employee-reported experience
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReportModal(org.id);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>Report</span>
                      <PlusCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Two-Column Live Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Left: Official Payment Announcements (Strictly Verified HR / Gov) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Official Employer Announcements
              </h2>
            </div>
            <button
              onClick={() => onNavigate('salary_updates')}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-slate-900/90 border border-emerald-900/30 hover:border-emerald-700/50 rounded-2xl p-4 space-y-2.5 transition-all shadow-md"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {ann.orgName}
                  </span>
                  <StatusBadge status={ann.status} isOfficial={true} size="sm" />
                </div>

                <div className="text-xs font-semibold text-emerald-300">
                  {ann.title}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">{ann.publisherName}</span>
                    {ann.circularNumber && (
                      <span className="font-mono text-slate-400">({ann.circularNumber})</span>
                    )}
                  </div>
                  <span className="text-slate-400">{ann.payrollPeriod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Crowdsourced Employee Reports Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Latest Employee Receipts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('salary_updates')}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-white text-xs sm:text-sm">
                    {rep.orgName || 'Organisation'}
                  </div>
                  <StatusBadge status={rep.status} isOfficial={false} size="sm" />
                </div>

                {rep.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    "{rep.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-slate-400">
                    {rep.userDisplayName} • {rep.payrollPeriod}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
                    Employee Report
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Communities & Peer Hub Quick Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Join Workplace Communities</h3>
            <p className="text-xs text-slate-300">
              Employee Community Rooms, Verified Company Q&A, and General Payday Forums.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('communities')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shrink-0"
        >
          Explore Communities
        </button>
      </div>
    </div>
  );
};
