import React, { useState } from 'react';
import {
  Bell,
  Shield,
  ShieldCheck,
  User,
  PlusCircle,
  LogOut,
  ChevronDown,
  CheckCircle,
  Database,
  Building,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenReportModal: () => void;
  onOpenAnnounceModal: () => void;
  onOpenProposeOrgModal: () => void;
  onOpenApplyRepModal: () => void;
  onNavigateToNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReportModal,
  onOpenAnnounceModal,
  onOpenProposeOrgModal,
  onOpenApplyRepModal,
}) => {
  const {
    firebaseUser,
    userProfile,
    activeRole,
    isAdmin,
    isModerator,
    isOrgRep,
    switchTestingRole,
    signInWithGoogle,
    signInQuickEmployee,
    signOut,
    isBackendConnected
  } = useAuth();

  const { notifications, markNotificationRead } = useData();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    employee: {
      label: 'Employee',
      badge: 'Worker',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    org_representative: {
      label: 'Verified Org Rep',
      badge: 'HR / Rep',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    moderator: {
      label: 'Moderator',
      badge: 'Mod Desk',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    admin: {
      label: 'Platform Admin',
      badge: 'Admin',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/40">
              <span className="text-white font-black text-sm tracking-tighter">DdP</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight leading-none">
                  DEM DON PAY
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 font-mono">
                  NG
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
                Salary Announcements & Employee Community
              </span>
            </div>
          </div>

          {/* Backend Status indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-slate-900 border border-slate-800 text-slate-400"
            title="Real-time multi-user synchronization powered by Cloud Firestore"
          >
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>Firestore Live</span>
          </div>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Action Buttons */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/30 transition-all hover:scale-[1.02]"
            title="Submit personal salary experience"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Salary</span>
          </button>

          {/* Interactive Role Switcher for verification */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${roleLabels[activeRole].color}`}
              title="Switch user role for testing permissions"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{roleLabels[activeRole].label}</span>
              <span className="sm:hidden">{roleLabels[activeRole].badge}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Test Role Perspectives
                </div>
                {(['employee', 'org_representative', 'moderator', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchTestingRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      activeRole === r ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>{roleLabels[r].label}</span>
                    {activeRole === r && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
                <div className="px-3 pt-2 text-[10px] text-slate-500 leading-normal border-t border-slate-800 mt-1">
                  Enforces real backend role rules in Firestore Security Rules.
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Notifications ({unreadCount})</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Followed Orgs</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No alerts right now</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-800/50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu / Quick sign-in */}
          <div className="relative">
            {userProfile ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={() => signInQuickEmployee()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white rounded-xl font-medium transition-colors"
              >
                Sign In
              </button>
            )}

            {showUserMenu && userProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-bold text-white truncate">{userProfile.displayName}</div>
                  <div className="text-[11px] text-slate-400 font-mono capitalize">{activeRole.replace('_', ' ')}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenProposeOrgModal();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Propose Organisation</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenApplyRepModal();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Apply for Verified HR</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAnnounceModal();
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Publish Announcement</span>
                  </button>
                )}

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-300 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
