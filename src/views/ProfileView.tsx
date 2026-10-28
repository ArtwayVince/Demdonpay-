import React, { useState } from 'react';
import {
  User,
  Shield,
  ShieldCheck,
  Lock,
  Bell,
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { StatusBadge } from '../components/StatusBadge';
import { UserRole } from '../types';

interface Props {
  onOpenReportModal: (defaultOrgId?: string) => void;
  onOpenApplyRepModal: () => void;
}

export const ProfileView: React.FC<Props> = ({ onOpenReportModal, onOpenApplyRepModal }) => {
  const {
    userProfile,
    userPrivate,
    activeRole,
    isAdmin,
    isModerator,
    isOrgRep,
    switchTestingRole,
    updateProfile,
    updatePrivateSettings,
    followedOrgIds,
    toggleFollowOrg,
  } = useAuth();

  const {
    organisations,
    salaryReports,
    moderationReports,
    moderationLogs,
    repVerifications,
    resolveModerationReport,
    reviewRepVerification,
  } = useData();

  // Local state for editing private settings
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userPrivate?.phone || '+234 803 000 1234');
  const [emailAlerts, setEmailAlerts] = useState(userPrivate?.emailNotifications ?? true);
  const [pushAlerts, setPushAlerts] = useState(userPrivate?.pushNotifications ?? true);
  const [digest, setDigest] = useState<'immediate' | 'daily' | 'weekly'>(userPrivate?.digestFrequency === 'none' ? 'daily' : userPrivate?.digestFrequency || 'immediate');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Moderation action modal state
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [actionChoice, setActionChoice] = useState('Mark as Disputed Payment Claim');
  const [modNotes, setModNotes] = useState('');
  const [modBusy, setModBusy] = useState(false);

  // User's own salary reports
  const myReports = salaryReports.filter(
    r => r.userId === (userProfile?.id || 'emp_tunde_01')
  );

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ displayName: displayName.trim() });
    await updatePrivateSettings({
      phone: phone.trim(),
      emailNotifications: emailAlerts,
      pushNotifications: pushAlerts,
      digestFrequency: digest,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResolveFlag = async (flagId: string) => {
    try {
      setModBusy(true);
      await resolveModerationReport(flagId, actionChoice, modNotes || 'Audit review completed by Compliance Desk.');
      setSelectedFlagId(null);
      setModNotes('');
    } catch (err) {
      console.error('Failed to resolve flag:', err);
    } finally {
      setModBusy(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          Employee Profile & Account Desk
        </h1>
        <p className="text-xs text-slate-400">
          Personal identity, isolated contact settings, reported history and moderation audit
        </p>
      </div>

      {/* Role and Permissions Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white">{userProfile?.displayName || 'Nigerian Worker'}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize">
                {activeRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Country: Nigeria • Joined Dem Don Pay
            </p>
          </div>
        </div>

        {/* Test switcher */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Role Perspective:</span>
          <select
            value={activeRole}
            onChange={(e) => switchTestingRole(e.target.value as UserRole)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
          >
            <option value="employee">Employee (Default)</option>
            <option value="org_representative">Verified Org Representative</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Platform Administrator</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Private Settings & My Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Private Settings & Notification Preferences (Isolated PII) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Private Settings & Contact PII
              </h3>
            </div>
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
              PII Isolated
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
            <strong className="text-emerald-300">Privacy Guarantee:</strong> Your email and phone are stored in an isolated Firestore subcollection (<code className="text-slate-400">/users/{'{uid}'}/private/info</code>) restricted to your account alone. They are never rendered publicly or shared with employers.
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Display Name (Publicly visible on community reports)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Private Phone Number (For SMS alert dispatches only)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="block text-slate-300 font-semibold">
                Notification Channels & Digest:
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded-sm bg-slate-800 border-slate-700 text-emerald-500"
                />
                <span>Email alerts on official circulars for followed organisations</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded-sm bg-slate-800 border-slate-700 text-emerald-500"
                />
                <span>In-app notifications when colleagues report salary receipts</span>
              </label>

              <div className="pt-2">
                <label className="block text-slate-400 mb-1">Digest Frequency:</label>
                <select
                  value={digest}
                  onChange={(e) => setDigest(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="immediate">Immediate Dispatch (As reports break)</option>
                  <option value="daily">Daily 6:00 PM Summary</option>
                  <option value="weekly">Weekly Payday Round-up</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              {savedSuccess ? (
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Settings updated securely!
                </span>
              ) : <span></span>}

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* My Reported Salary Updates */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                My Salary Reports ({myReports.length})
              </h3>
            </div>
            <button
              onClick={() => onOpenReportModal()}
              className="text-xs text-emerald-400 font-semibold"
            >
              + Submit Report
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {myReports.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p>You have not submitted any salary reports yet.</p>
                <button
                  onClick={() => onOpenReportModal()}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Report October 2026 Salary
                </button>
              </div>
            ) : (
              myReports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-xs">{rep.orgName}</span>
                    <StatusBadge status={rep.status} isOfficial={false} size="sm" />
                  </div>

                  {rep.notes && (
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      "{rep.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>{rep.payrollPeriod} • Employee-reported</span>
                    <button
                      onClick={() => onOpenReportModal(rep.orgId)}
                      className="text-emerald-400 hover:underline text-[11px]"
                    >
                      Update / Correct
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Moderation Desk & Representative Auditing (Visible for Moderator / Admin) */}
      {(isModerator || isAdmin) && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Moderator & Compliance Desk
                </h3>
                <p className="text-xs text-slate-400">
                  Audit flagged pranks, resolve disputed claims, and review representative applications
                </p>
              </div>
            </div>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {activeRole.toUpperCase()} DESK
            </span>
          </div>

          {/* Pending Flags Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Flagged Abuse & Prank Queue ({moderationReports.filter(r => r.status === 'pending').length} Pending)
              </h4>
            </div>

            <div className="space-y-2.5">
              {moderationReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.2 rounded-full font-bold uppercase text-[10px]">
                        {report.reason.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-white">Target: {report.targetSummary || report.targetId}</span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      report.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <strong>Report Note:</strong> {report.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Reported by: {report.reporterName || 'User'}</span>

                    {report.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedFlagId(report.id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold"
                        >
                          Take Action
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-400">
                        Action Taken: <strong>{report.actionTaken}</strong> ({report.resolvedBy})
                      </span>
                    )}
                  </div>

                  {selectedFlagId === report.id && (
                    <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-3 mt-2 space-y-2.5">
                      <span className="block font-bold text-white text-xs">Execute Auditable Moderation Action:</span>
                      <select
                        value={actionChoice}
                        onChange={(e) => setActionChoice(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5"
                      >
                        <option value="Mark as Disputed Payment Claim">Mark as Disputed Payment Claim</option>
                        <option value="Dismissed as Genuine Variance">Dismiss as Genuine Payment Variance</option>
                        <option value="Restrict Account for Deliberate Falsehood">Restrict Account for Deliberate Falsehood</option>
                      </select>

                      <textarea
                        value={modNotes}
                        onChange={(e) => setModNotes(e.target.value)}
                        placeholder="Log compliance reasoning for audit trail..."
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedFlagId(null)}
                          className="px-3 py-1 text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResolveFlag(report.id)}
                          disabled={modBusy}
                          className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold"
                        >
                          {modBusy ? 'Saving...' : 'Commit Audit Action'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Representative Applications Queue */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Organisation Representative Applications ({repVerifications.length})
            </h4>

            <div className="space-y-2.5">
              {repVerifications.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">{req.orgName}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : req.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-slate-300 space-y-0.5">
                    <div>Applicant: <strong>{req.applicantName}</strong> ({req.jobTitle})</div>
                    <div>Work Email: <code className="text-emerald-400">{req.officialWorkEmail}</code></div>
                    <div>CAC / Gazetted Ref: <code className="text-slate-400">{req.cacNumberOrGovId}</code></div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => reviewRepVerification(req.id, 'rejected', 'Institutional credentials could not be verified with ministry registry.')}
                        className="px-3 py-1 bg-rose-950/60 text-rose-300 border border-rose-600/40 rounded-lg hover:bg-rose-900"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => reviewRepVerification(req.id, 'approved')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                      >
                        Approve & Grant Verified HR Seal
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Moderation Audit Log */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-400" />
              Immutable Moderation Audit Trail ({moderationLogs.length} Records)
            </h4>

            <div className="space-y-2">
              {moderationLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 text-[11px] flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{log.action}</span>
                    <p className="text-slate-400">{log.notes}</p>
                  </div>
                  <div className="text-right text-slate-500 font-mono shrink-0">
                    <div>{log.moderatorName}</div>
                    <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
