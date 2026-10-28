import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PieChart,
  PlusCircle,
  ExternalLink,
  Mail,
  MapPin,
  Heart,
  Flag,
  Share2,
  Users,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Organisation, SectorType } from '../types';
import { StatusBadge } from '../components/StatusBadge';

interface Props {
  onOpenReportModal: (orgId: string) => void;
  onOpenProposeOrgModal: () => void;
  onOpenFlagModal: (targetType: 'organisation', targetId: string, summary: string) => void;
  onOpenInviteModal: (orgName?: string) => void;
  selectedOrgId?: string;
}

export const OrganisationsView: React.FC<Props> = ({
  onOpenReportModal,
  onOpenProposeOrgModal,
  onOpenFlagModal,
  onOpenInviteModal,
  selectedOrgId
}) => {
  const { followedOrgIds, toggleFollowOrg } = useAuth();
  const { organisations, announcements, salaryReports } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'public' | 'private'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unclaimed'>('all');
  const [activeOrgId, setActiveOrgId] = useState<string | null>(selectedOrgId || null);

  // Filtered organisations
  const filteredOrgs = organisations.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.acronym && org.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
      org.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = sectorFilter === 'all' || org.sector === sectorFilter;
    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && org.isVerifiedOnDdP) ||
      (verifiedFilter === 'unclaimed' && !org.isVerifiedOnDdP);

    return matchesSearch && matchesSector && matchesVerified;
  });

  const activeOrg = activeOrgId ? organisations.find(o => o.id === activeOrgId) : null;
  const activeAnnouncements = activeOrg ? announcements.filter(a => a.orgId === activeOrg.id) : [];
  const activeReports = activeOrg ? salaryReports.filter(r => r.orgId === activeOrg.id) : [];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Organisation Directory
          </h1>
          <p className="text-xs text-slate-400">
            Search ministries, agencies, banks and corporations across Nigeria
          </p>
        </div>

        <button
          onClick={onOpenProposeOrgModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose Organisation</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by organisation name, acronym (e.g. NNPC, CBN, LASG) or industry..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sector:
          </span>
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              sectorFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Sectors
          </button>
          <button
            onClick={() => setSectorFilter('public')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              sectorFilter === 'public' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Public (Federal & State MDAs)
          </button>
          <button
            onClick={() => setSectorFilter('private')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              sectorFilter === 'private' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Private Corporate
          </button>

          <span className="text-slate-500 mx-2">|</span>

          <span className="text-slate-400 font-semibold mr-1">Status:</span>
          <button
            onClick={() => setVerifiedFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              verifiedFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setVerifiedFilter('verified')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              verifiedFilter === 'verified' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ✓ Verified HR
          </button>
          <button
            onClick={() => setVerifiedFilter('unclaimed')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              verifiedFilter === 'unclaimed' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Unclaimed / Community
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrgs.map((org) => {
          const isFollowed = followedOrgIds.includes(org.id);
          const rec = org.receivedCount || 0;
          const notRec = org.notReceivedCount || 0;
          const part = org.partialCount || 0;
          const total = rec + notRec + part || 1;

          return (
            <div
              key={org.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between ${
                activeOrgId === org.id
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Org header badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">
                      {org.name}
                    </h3>
                    {org.acronym && (
                      <span className="text-xs text-emerald-400 font-mono font-semibold">
                        {org.acronym}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFollowOrg(org.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      isFollowed
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={isFollowed ? 'Unfollow organisation' : 'Follow for salary alerts'}
                  >
                    <Heart className={`w-4 h-4 ${isFollowed ? 'fill-emerald-400' : ''}`} />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                    {org.sector === 'public' ? 'Public Sector' : 'Private'}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                    {org.industry}
                  </span>
                  {org.isVerifiedOnDdP ? (
                    <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified on DdP
                    </span>
                  ) : (
                    <span className="bg-slate-800/80 text-slate-400 border border-slate-700 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                      Unclaimed (Community Only)
                    </span>
                  )}
                </div>

                {/* Location & Website */}
                <div className="text-[11px] text-slate-400 space-y-1">
                  {org.headquarters && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{org.headquarters}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-1.5 truncate">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline truncate"
                      >
                        {org.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Aggregate reporting breakdown */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">October 2026 Reports:</span>
                    <span className="text-white font-bold">{rec + notRec + part}</span>
                  </div>

                  {/* Progress */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(rec / total) * 100}%` }} className="bg-teal-500 h-full" />
                    <div style={{ width: `${(notRec / total) * 100}%` }} className="bg-rose-500 h-full" />
                    <div style={{ width: `${(part / total) * 100}%` }} className="bg-orange-500 h-full" />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-teal-400 font-medium">✓ {rec} Received</span>
                    <span className="text-rose-400 font-medium">✕ {notRec} Pending</span>
                    {part > 0 && <span className="text-orange-400 font-medium">◐ {part} Partial</span>}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveOrgId(activeOrgId === org.id ? null : org.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {activeOrgId === org.id ? 'Close Details' : 'Company Hub & Circulars'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenReportModal(org.id)}
                    className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>

                  <button
                    onClick={() =>
                      onOpenFlagModal('organisation', org.id, `${org.name} (${org.acronym || ''})`)
                    }
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Flag suspected impersonation or incorrect profile"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Organisation Hub / Drawer */}
      {activeOrg && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{activeOrg.name}</h2>
                {activeOrg.isVerifiedOnDdP ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Official Profile
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full">
                    Unclaimed Organisation Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Company Information Hub, Verified Representative Details, and Salary History
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenInviteModal(activeOrg.name)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-xl flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Invite Colleagues</span>
              </button>
              <button
                onClick={() => setActiveOrgId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close Hub
              </button>
            </div>
          </div>

          {/* Verified Rep Info if present */}
          {activeOrg.isVerifiedOnDdP && activeOrg.verifiedRepName && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Verified HR & Public Service Liaison
                </div>
                <div className="text-sm font-bold text-white">
                  {activeOrg.verifiedRepName} — {activeOrg.verifiedRepTitle}
                </div>
                <div className="text-xs text-slate-400">
                  Institutional contact authorized to publish binding circulars on DdP
                </div>
              </div>
            </div>
          )}

          {/* Official Announcements for this Org */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Official Announcements ({activeAnnouncements.length})
            </h3>
            {activeAnnouncements.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-center">
                No official circular has been published yet for {activeOrg.name}.
              </p>
            ) : (
              activeAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-white text-xs">{ann.title}</span>
                    <StatusBadge status={ann.status} isOfficial={true} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                  <div className="text-[11px] text-slate-500">
                    Ref: {ann.circularNumber || 'N/A'} • Published: {ann.announcementDate}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Employee Reports Stream for this Org */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                Crowdsourced Employee Reports ({activeReports.length})
              </h3>
              <button
                onClick={() => onOpenReportModal(activeOrg.id)}
                className="text-xs text-emerald-400 font-semibold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add My Report</span>
              </button>
            </div>

            {activeReports.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-center">
                No employee reports posted yet for this month. Be the first to report your experience.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white text-xs">{rep.userDisplayName}</span>
                      <StatusBadge status={rep.status} isOfficial={false} size="sm" />
                    </div>
                    {rep.notes && (
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        "{rep.notes}"
                      </p>
                    )}
                    <div className="text-[10px] text-slate-500 font-mono">
                      Period: {rep.payrollPeriod} • Employee-Reported Experience
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
