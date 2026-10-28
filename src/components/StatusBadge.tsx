import React from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart,
  Search,
  AlertTriangle
} from 'lucide-react';
import { SalaryStatus } from '../types';

interface StatusBadgeProps {
  status: SalaryStatus | 'salary_received' | 'salary_not_received' | 'partial_payment' | 'official_payment_announcement' | 'salary_expected' | 'disputed_by_moderator';
  isOfficial?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isOfficial = false,
  showIcon = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'official_payment_announcement':
        return {
          label: 'Official Payment Announcement',
          badgeText: 'Official Circular',
          icon: ShieldCheck,
          className: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
          sourceTag: 'Verified Employer / Government Memo',
        };
      case 'salary_expected':
        return {
          label: 'Salary Expected',
          badgeText: 'Payroll Window Open',
          icon: Clock,
          className: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
          sourceTag: 'Scheduled Timeline',
        };
      case 'employee_reports_received':
      case 'salary_received':
        return {
          label: 'Salary Received',
          badgeText: 'Dem Don Pay',
          icon: CheckCircle2,
          className: 'bg-teal-500/15 text-teal-300 border border-teal-500/40',
          sourceTag: 'Employee Reported Experience',
        };
      case 'employee_reports_not_received':
      case 'salary_not_received':
        return {
          label: 'Salary Not Received',
          badgeText: 'Salary Pending',
          icon: XCircle,
          className: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
          sourceTag: 'Employee Reported Experience',
        };
      case 'employee_reports_partial':
      case 'partial_payment':
        return {
          label: 'Partial Payment',
          badgeText: 'Partial / Deduction',
          icon: PieChart,
          className: 'bg-orange-500/15 text-orange-300 border border-orange-500/40',
          sourceTag: 'Employee Reported Experience',
        };
      case 'payment_under_review':
        return {
          label: 'Payment Under Review',
          badgeText: 'Under Review',
          icon: Search,
          className: 'bg-purple-500/15 text-purple-300 border border-purple-500/40',
          sourceTag: 'Moderation Investigation',
        };
      case 'disputed_payment_information':
      case 'disputed_by_moderator':
        return {
          label: 'Disputed Payment Info',
          badgeText: 'Disputed Info',
          icon: AlertTriangle,
          className: 'bg-red-500/20 text-red-300 border border-red-500/50',
          sourceTag: 'Conflicting Claims Logged',
        };
      default:
        return {
          label: 'Status Pending',
          badgeText: 'Pending',
          icon: Clock,
          className: 'bg-slate-700/50 text-slate-300 border border-slate-600',
          sourceTag: 'System',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.className} transition-all`}
      title={`${config.label} (${config.sourceTag})`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />}
      <span className="whitespace-nowrap">{config.label}</span>
      {isOfficial && (
        <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ml-1">
          Official
        </span>
      )}
    </span>
  );
};
