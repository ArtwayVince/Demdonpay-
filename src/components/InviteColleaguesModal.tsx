import React, { useState } from 'react';
import { X, Share2, Copy, Check, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orgName?: string;
}

export const InviteColleaguesModal: React.FC<Props> = ({ isOpen, onClose, orgName }) => {
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const inviteText = orgName
    ? `Dem don pay for your side? Check on Dem Don Pay (DdP) to see verified announcements and employee reports for ${orgName}: ${appUrl}`
    : `Dem don pay for your side? Join Dem Don Pay (DdP) to track official salary announcements and employee reports: ${appUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(inviteText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Invite Colleagues to DdP</h2>
              <p className="text-xs text-slate-400">Crowdsource salary transparency together</p>
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
        <div className="p-6 space-y-4 text-slate-200">
          <p className="text-xs text-slate-300 leading-relaxed">
            The more verified employees participate on Dem Don Pay, the faster and more reliable salary tracking becomes for everyone in your ministry, agency, or corporation.
          </p>

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Preview Message:</span>
              <span className="text-emerald-400 font-mono text-[10px]">Nigerian Workplace Dispatch</span>
            </div>
            <p className="text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 font-sans leading-relaxed">
              "{inviteText}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-white transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold text-white shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center pt-2">
            Invited colleagues can register independently without requiring HR approval.
          </p>
        </div>
      </div>
    </div>
  );
};
