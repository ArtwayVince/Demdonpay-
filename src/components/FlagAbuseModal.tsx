import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'salary_report' | 'official_announcement' | 'community_message' | 'organisation';
  targetId: string;
  targetSummary: string;
}

export const FlagAbuseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetSummary
}) => {
  const { userProfile } = useAuth();
  const { flagAbuse } = useData();

  const [reason, setReason] = useState<'suspected_prank' | 'impersonation' | 'false_claim' | 'harassment' | 'other'>('suspected_prank');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide specific details explaining why this item is suspected or abusive.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await flagAbuse({
        targetType,
        targetId,
        targetSummary,
        reporterUid: userProfile?.id || 'anon_reporter',
        reporterName: userProfile?.displayName || 'Anonymous Reporter',
        reason,
        description: description.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit moderation flag.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Report Suspected Abuse or Prank</h2>
              <p className="text-xs text-slate-400">Dem Don Pay Community Protection Desk</p>
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
          {/* Target Item Pill */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs space-y-1">
            <span className="text-slate-400 font-medium">Flagging Target:</span>
            <div className="text-white font-semibold truncate">{targetSummary}</div>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Fair Review Policy:</strong> DdP moderators distinguish between genuine bank delays/partial payments and deliberate falsehoods. Submissions are audited by our compliance desk.
            </span>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white">Report Received for Audit</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Thank you for safeguarding the community against false information. A moderator will review this item.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason for Flagging *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                >
                  <option value="suspected_prank">Suspected Prank / Fabricated Alert ("April Fool / Clout")</option>
                  <option value="impersonation">Impersonation of Verified Representative or Official</option>
                  <option value="false_claim">Deliberately False or Misleading Claim</option>
                  <option value="harassment">Harassment, Doxxing or Inappropriate Language</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Explanation & Context *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this post is incorrect or suspect (e.g. 'This circular has no valid reference and claims salaries were paid on a Sunday when banks were closed')."
                  rows={3}
                  maxLength={500}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                />
                <p className="text-[11px] text-slate-500 text-right mt-1">{description.length}/500</p>
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
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting...' : 'Submit Flag to Moderators'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
