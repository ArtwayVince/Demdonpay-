import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Building,
  HelpCircle,
  FileText,
  Users,
  BellRing,
  Info
} from 'lucide-react';

interface Props {
  onOpenApplyRepModal: () => void;
}

export const SubscriptionsView: React.FC<Props> = ({ onOpenApplyRepModal }) => {
  const tiers = [
    {
      id: 'community',
      name: 'Employee Community',
      subtitle: 'Free Forever for Workers & Unclaimed Profiles',
      price: '₦0',
      period: 'permanent',
      description: 'Transparent crowdsourcing and peer discussion for all Nigerian civil servants and private sector workers.',
      features: [
        'Search all federal, state, and corporate organisations',
        'Follow unlimited organisations for salary updates',
        'Submit personal salary status and notes for every payroll cycle',
        'Participate in Employee Community Rooms and General Payday Forums',
        'In-app notification alerts when colleagues report receipts',
        'Flag suspected pranks and false alarm claims',
      ],
      cta: 'Current Plan (Free)',
      isPopular: false,
      isAvailable: true,
    },
    {
      id: 'verified_basic',
      name: 'Verified Organisation Basic',
      subtitle: 'For SMEs & Mid-Sized Employers',
      price: '₦45,000',
      period: 'per month',
      description: 'Official presence, verified employer seal, and authoritative payment circular publishing.',
      features: [
        'Green "Verified on DdP" trust badge on directory profile',
        'Publish official payment announcements with reference circulars',
        'Direct Company–Employee Q&A Desk with authenticated HR badge',
        'Real-time employee sentiment and payment dispute monitoring',
        'Up to 2 authorized representative accounts',
        'Official email domain credential verification',
      ],
      cta: 'Apply for Verified HR',
      isPopular: true,
      isAvailable: true,
      onCtaClick: onOpenApplyRepModal,
    },
    {
      id: 'enterprise_portal',
      name: 'Enterprise & Public Sector Portal',
      subtitle: 'For Federal Ministries, Parastatals & Large Banks',
      price: '₦180,000',
      period: 'per month',
      description: 'Multi-MDA administration, dedicated payroll dispatch alerts, and priority compliance auditing.',
      features: [
        'Everything in Verified Organisation Basic',
        'Multi-department / MDA sub-unit management (e.g., State Secretariats)',
        'Direct push & SMS alert broadcast to thousands of followed staff',
        'Dedicated compliance officer liaison for fraud & prank mitigation',
        'Historical payroll audit analytics & exportable dispute reports',
        'Custom circular document attachments & gazette citations',
      ],
      cta: 'Contact Compliance Desk',
      isPopular: false,
      isAvailable: true,
      onCtaClick: onOpenApplyRepModal,
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Organisation Subscription Architecture
        </h1>
        <p className="text-xs text-slate-400">
          Planned institutional subscription plans and employer transparency tools
        </p>
      </div>

      {/* Notice Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Architecture Preview Notice:</strong> As directed in the foundation build brief, billing is not yet live. You can apply for representative verification directly without payment during the initial rollout.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between space-y-6 relative transition-all ${
              tier.isPopular
                ? 'border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                : 'border-slate-800'
            }`}
          >
            {tier.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Recommended For Employers
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-white text-base">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{tier.subtitle}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{tier.price}</span>
                <span className="text-xs text-slate-400 font-medium">/{tier.period}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {tier.description}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Features Included:
                </span>
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={tier.onCtaClick}
              disabled={tier.id === 'community'}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                tier.isPopular
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : tier.id === 'community'
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
