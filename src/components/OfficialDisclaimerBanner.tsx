import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const OfficialDisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 rounded-lg px-3 py-2 text-xs flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-emerald-300">DdP Transparency Standard:</strong> Employee reports reflect individual self-reported experiences and are strictly separate from official employer circulars.
          </span>
        </div>
        <span className="hidden sm:inline-block bg-emerald-800/60 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide">
          Non-Payroll Platform
        </span>
      </div>
    );
  }

  return (
    <aside aria-label="Official platform disclaimer" className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-600/30 rounded-xl p-3.5 sm:p-4 text-slate-200 shadow-md">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white tracking-tight">Dem Don Pay (DdP) Regulatory & Trust Notice</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
              Community & Verification Platform
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            DdP is an independent workplace information platform. DdP does <strong>not</strong> process payroll, disburse funds, or act as a payment gateway. Official announcements require verified representative credentials, while crowdsourced salary updates represent personal accounts from fellow workers.
          </p>
        </div>
      </div>
    </aside>
  );
};
