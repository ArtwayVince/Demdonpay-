import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, PieChart, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultOrgId?: string;
}

export const ReportSalaryModal: React.FC<Props> = ({ isOpen, onClose, defaultOrgId }) => {
  const { userProfile } = useAuth();
  const { organisations, submitSalaryReport } = useData();

  const [selectedOrgId, setSelectedOrgId] = useState(defaultOrgId || organisations[0]?.id || '');
  const [payrollPeriod, setPayrollPeriod] = useState('October 2026');
  const [status, setStatus] = useState<'salary_received' | 'salary_not_received' | 'partial_payment'>('salary_received');
  const [partialPercentage, setPartialPercentage] = useState(60);
  const [notes, setNotes] = useState('');
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certified) {
      setError('You must certify that this describes your personal experience as an employee.');
      return;
    }

    if (!selectedOrgId) {
      setError('Please select an organisation.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const targetOrg = organisations.find(o => o.id === selectedOrgId);

      await submitSalaryReport({
        orgId: selectedOrgId,
        orgName: targetOrg?.name || 'Selected Organisation',
        userId: userProfile?.id || 'emp_guest',
        userDisplayName: userProfile?.displayName || 'Anonymous Employee',
        payrollPeriod,
        status,
        partialPercentage: status === 'partial_payment' ? partialPercentage : undefined,
        notes: notes.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Report Your Salary Experience
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Crowdsource payment transparency for fellow workers
            </p>
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
          {/* Important Boundary Notice */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Strict Transparency Boundary:</strong> This submission will be visibly labeled as an <em>Employee Report</em>. It will NEVER be represented as an official announcement on behalf of your employer.
            </div>
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
              <h3 className="text-base font-semibold text-white">Salary Report Submitted!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Thank you for contributing transparent, factual information for fellow employees.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Organisation Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Organisation *
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                >
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} {org.acronym ? `(${org.acronym})` : ''} — {org.sector === 'public' ? 'Public Sector' : 'Private'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payroll Period */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payroll Period *
                </label>
                <select
                  value={payrollPeriod}
                  onChange={(e) => setPayrollPeriod(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                >
                  <option value="October 2026">October 2026 (Current)</option>
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
              </div>

              {/* Status Radio Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is your salary status for this period? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStatus('salary_received')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      status === 'salary_received'
                        ? 'bg-teal-950/60 border-teal-500 text-teal-300 shadow-md ring-1 ring-teal-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mb-1.5 text-teal-400" />
                    <span className="text-xs font-semibold">Dem Don Pay</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Salary Received</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('salary_not_received')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      status === 'salary_not_received'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 mb-1.5 text-rose-400" />
                    <span className="text-xs font-semibold">Salary Pending</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Not Received Yet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('partial_payment')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      status === 'partial_payment'
                        ? 'bg-orange-950/60 border-orange-500 text-orange-300 shadow-md ring-1 ring-orange-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <PieChart className="w-5 h-5 mb-1.5 text-orange-400" />
                    <span className="text-xs font-semibold">Partial / Cut</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Deduction or Half</span>
                  </button>
                </div>
              </div>

              {/* Partial Payment Percentage Slider */}
              {status === 'partial_payment' && (
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Estimated Percentage Received:</span>
                    <span className="text-orange-400 font-bold">{partialPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={partialPercentage}
                    onChange={(e) => setPartialPercentage(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    E.g. basic pay received without allowances, or 50% staggered payment.
                  </p>
                </div>
              )}

              {/* Optional Experience Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Context / Bank Details (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Access Bank alert arrived at 2:30 PM. Colleagues on Zenith still waiting on batch 2."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Do NOT include your bank account number or personal salary amount.</span>
                  <span>{notes.length}/500</span>
                </p>
              </div>

              {/* Employee Certification Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={certified}
                    onChange={(e) => setCertified(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-sm border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                    I certify that this submission represents my honest personal experience as an employee. I understand this will be published under the <strong>Employee-Reported</strong> label and is subject to community moderation.
                  </span>
                </label>
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
                  disabled={submitting || !certified}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting...' : 'Submit Salary Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
