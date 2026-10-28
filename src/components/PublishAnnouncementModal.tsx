import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenApplyRep: () => void;
  defaultOrgId?: string;
}

export const PublishAnnouncementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenApplyRep,
  defaultOrgId
}) => {
  const { userProfile, activeRole, isAdmin, isOrgRep } = useAuth();
  const { organisations, publishOfficialAnnouncement } = useData();

  const [selectedOrgId, setSelectedOrgId] = useState(defaultOrgId || organisations[0]?.id || '');
  const [payrollPeriod, setPayrollPeriod] = useState('October 2026');
  const [title, setTitle] = useState('');
  const [circularNumber, setCircularNumber] = useState('');
  const [status, setStatus] = useState<'official_payment_announcement' | 'salary_expected'>('official_payment_announcement');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Authorization check: Must be org_representative or admin
  const isAuthorized = isOrgRep || isAdmin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      setError('AUTHORIZATION_ERROR: Ordinary employees cannot publish official announcements.');
      return;
    }

    if (!selectedOrgId || !title.trim() || !content.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const targetOrg = organisations.find(o => o.id === selectedOrgId);

      await publishOfficialAnnouncement({
        orgId: selectedOrgId,
        orgName: targetOrg?.name || 'Organisation',
        publisherUid: userProfile?.id || 'admin_uid',
        publisherName: userProfile?.displayName || 'Authorized Representative',
        publisherRole: isAdmin ? 'Platform Administrator' : 'Verified Organisation Representative',
        payrollPeriod,
        title: title.trim(),
        circularNumber: circularNumber.trim() || undefined,
        announcementDate: new Date().toISOString().split('T')[0],
        status,
        content: content.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish official announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Publish Official Payment Announcement
              </h2>
              <p className="text-xs text-slate-400">
                Verified HR & Government Payroll Circulars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200">
          {!isAuthorized ? (
            /* ACCESS RESTRICTED GATE FOR EMPLOYEES */
            <div className="py-6 px-4 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Privileged Operation Restricted</h3>
                <p className="text-xs text-rose-200 leading-relaxed max-w-md mx-auto">
                  You are currently logged in with the <strong>Employee</strong> role. Platform integrity rules strictly prohibit ordinary employees from issuing official announcements on behalf of an employer.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  How to get Verified Representative access:
                </div>
                <p className="text-slate-400 text-[11px]">
                  1. Submit corporate work email (@domain.com / @mda.gov.ng)<br />
                  2. Upload CAC registration / Ministry Appointment letter<br />
                  3. Await audit approval from the DdP Compliance Desk.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenApplyRep();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Apply for Representative Verification
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white">Official Announcement Published!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                The circular has been published with verified employer credentials and dispatched to employees following this organisation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/30 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verified Author Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Posting as: <strong>{userProfile?.displayName}</strong> ({isAdmin ? 'System Administrator' : 'Verified HR Representative'})
                </span>
              </div>

              {/* Organisation Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Organisation *
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                >
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} {org.acronym ? `(${org.acronym})` : ''} {org.isVerifiedOnDdP ? '✓ Verified on DdP' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Announcement Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Announcement Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  >
                    <option value="official_payment_announcement">Official Payment Announcement</option>
                    <option value="salary_expected">Salary Expected / Mandate Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payroll Period *
                  </label>
                  <select
                    value={payrollPeriod}
                    onChange={(e) => setPayrollPeriod(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  >
                    <option value="October 2026">October 2026</option>
                    <option value="November 2026">November 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </div>
              </div>

              {/* Title & Circular Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Disbursement of October 2026 Salaries and Consequential Allowances"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Circular / Reference Code
                </label>
                <input
                  type="text"
                  value={circularNumber}
                  onChange={(e) => setCircularNumber(e.target.value)}
                  placeholder="e.g. CIR/PSO/OCT/2026/088 or HCM/PAYROLL/26-10"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Statement & Instructions *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide precise details: bank clearing timelines, batch schedules, instructions for staff experiencing delays, and relevant contacts..."
                  rows={4}
                  maxLength={2000}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                />
                <p className="text-[11px] text-slate-500 text-right mt-1">{content.length}/2000</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  {submitting ? 'Publishing...' : 'Publish Official Circular'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
