import React from 'react';
import {
  Home,
  Building2,
  TrendingUp,
  MessageSquare,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export type NavTab = 'home' | 'organisations' | 'salary_updates' | 'communities' | 'profile' | 'tests' | 'subscriptions';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'organisations' as NavTab, label: 'Organisations', icon: Building2 },
    { id: 'salary_updates' as NavTab, label: 'Salary Updates', icon: TrendingUp },
    { id: 'communities' as NavTab, label: 'Communities', icon: MessageSquare },
    { id: 'profile' as NavTab, label: 'Profile & Desk', icon: User },
    { id: 'tests' as NavTab, label: 'Acceptance Tests', icon: CheckCircle2, badge: '12/12' },
    { id: 'subscriptions' as NavTab, label: 'Plans & Tiers', icon: Sparkles },
  ];

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <div className="hidden md:block bg-slate-900/60 border-b border-slate-800/80 sticky top-16 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-500/30 font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
