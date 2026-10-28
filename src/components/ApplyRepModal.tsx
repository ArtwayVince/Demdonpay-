import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Building2, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultOrgId?: string;
}

export const ApplyRepModal: React.FC<Props> = ({ isOpen, onClose, defaultOrgId }) => {
  const { userProfile } = useAuth();
  const { organisations, applyForRepVerification } = useData();

  const [selectedOrgId, setSelectedOrgId] = useState(defaultOrgId || organisations[0]?.id || '');
  const [applicantName, setApplicantName] = useState(userProfile?.displayName || '');
  const [officialWorkEmail, setOfficialWorkEmail] = useState('');
  const [cacNumberOrGovId, setCacNumberOrGovId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [documentNotes, setDocumentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !applicantName.trim() || !officialWorkEmail.trim() || !jobTitle.trim()) {
      setError('Please provide all mandatory verification details.');
      return;
    }

    // Email domain validation hint
    if (!officialWorkEmail.includes('@') || officialWorkEmail.endsWith('@gmail.com') || officialWorkEmail.endsWith('@yahoo.com')) {
      setError('Please use your official institutional email (e.g. name@company.com or name@mda.gov.ng) rather than a personal webmail address.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const targetOrg = organisations.find(o => o.id === selectedOrgId);

      await applyForRepVerification({
        orgId: selectedOrgId,
        orgName: targetOrg?.name || 'Organisation',
        applicantUid: userProfile?.id || 'applicant_uid',
        applicantName: applicantName.trim(),
        officialWorkEmail: officialWorkEmail.trim(),
        cacNumberOrGovId: cacNumberOrGovId.trim() || 'RC-CAC-VERIFICATION-PENDING',
        jobTitle: jobTitle.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Apply for Representative Verification</h2>
              <p className="text-xs text-slate-400">Official HR & Public Service Credentialing</p>
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
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 leading-relaxed">
            Verified Representatives have the exclusive privilege to publish <strong>Official Payment Announcements</strong>, answer staff queries with an official badge, and manage public corporate information on DdP.
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white">Verification Request Submitted!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your application is in the queue for compliance audit. You will receive an alert once our team has verified your credentials.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Organisation You Represent *
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                >
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} {org.acronym ? `(${org.acronym})` : ''} {org.isVerifiedOnDdP ? '(Already Verified)' : '(Unclaimed)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Dr. Amina Bello"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Head of HR / Payroll Lead"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Institutional Email *
                </label>
                <input
                  type="email"
                  value={officialWorkEmail}
                  onChange={(e) => setOfficialWorkEmail(e.target.value)}
                  placeholder="e.g. hr@nnpcgroup.com or payroll@lagosstate.gov.ng"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be an institutional or government email domain, not personal Gmail/Yahoo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  CAC Registration / Official Gov Gazetted Ref Number
                </label>
                <input
                  type="text"
                  value={cacNumberOrGovId}
                  onChange={(e) => setCacNumberOrGovId(e.target.value)}
                  placeholder="e.g. RC-123456 or FGN/MD/HR/AUTH/2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Verification Reference Notes
                </label>
                <textarea
                  value={documentNotes}
                  onChange={(e) => setDocumentNotes(e.target.value)}
                  placeholder="Provide reference numbers, staff portal link, or official desk phone for verification contact..."
                  rows={2}
                  maxLength={300}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
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
                  <UploadCloud className="w-4 h-4" />
                  {submitting ? 'Submitting Application...' : 'Submit Verification Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
