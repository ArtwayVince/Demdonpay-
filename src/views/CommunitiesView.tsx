import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Building,
  Send,
  Flag,
  AlertCircle,
  HelpCircle,
  Hash,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CommunityMessage, UserRole } from '../types';

interface Props {
  onOpenFlagModal: (
    targetType: 'community_message',
    targetId: string,
    summary: string
  ) => void;
}

export const CommunitiesView: React.FC<Props> = ({ onOpenFlagModal }) => {
  const { userProfile, activeRole, isAdmin, isModerator } = useAuth();
  const { organisations, communityMessages, postCommunityMessage } = useData();

  const [activeChannel, setActiveChannel] = useState<'employee_community' | 'company_employee' | 'general_payday'>('employee_community');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organisations[0]?.id || 'lasg-org');
  const [selectedTopic, setSelectedTopic] = useState<string>('Federal & State Civil Servants');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  const activeOrg = organisations.find(o => o.id === selectedOrgId);

  // Filter messages by active channel and org/topic
  const currentMessages = communityMessages.filter((msg) => {
    if (activeChannel === 'general_payday') {
      return msg.roomType === 'general_payday' && (!selectedTopic || msg.topic === selectedTopic);
    }
    return msg.roomType === activeChannel && msg.orgId === selectedOrgId;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      setSending(true);

      // Determine sender role badge
      let badge: UserRole = 'employee';
      if (isAdmin) badge = 'admin';
      else if (isModerator) badge = 'moderator';
      else if (activeRole === 'org_representative' && activeOrg?.verifiedRepUid === userProfile?.id) {
        badge = 'org_representative';
      }

      await postCommunityMessage({
        roomType: activeChannel,
        orgId: activeChannel !== 'general_payday' ? selectedOrgId : undefined,
        topic: activeChannel === 'general_payday' ? selectedTopic : undefined,
        senderUid: userProfile?.id || 'anon_user',
        senderDisplayName: userProfile?.displayName || 'Anonymous Worker',
        senderRoleBadge: badge,
        content: messageInput.trim(),
      });

      setMessageInput('');
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setSending(false);
    }
  };

  const forumTopics = [
    'Federal & State Civil Servants',
    'Banking, Tech & Corporate',
    'Healthcare & Education Payday',
    'Workplace Advice & Salary Delays',
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Workplace Communities & Forums
        </h1>
        <p className="text-xs text-slate-400">
          Independent peer rooms, verified company Q&A desks, and cross-sector payday forums
        </p>
      </div>

      {/* Main Mode Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveChannel('employee_community')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeChannel === 'employee_community'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Community Room</span>
        </button>

        <button
          onClick={() => setActiveChannel('company_employee')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeChannel === 'company_employee'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company–Employee Q&A</span>
        </button>

        <button
          onClick={() => setActiveChannel('general_payday')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeChannel === 'general_payday'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>General Payday Forum</span>
        </button>
      </div>

      {/* Sub-selector / Filter row */}
      {activeChannel !== 'general_payday' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Organisation Channel:</span>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg font-medium focus:outline-hidden focus:border-emerald-500"
            >
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.acronym ? `(${org.acronym})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-400 text-[11px]">
            {activeOrg?.isVerifiedOnDdP ? '✓ Verified Employer Account' : 'Unregistered Employer Profile'}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {forumTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTopic === topic
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{topic}
            </button>
          ))}
        </div>
      )}

      {/* Mandatory Room Legal & Transparency Banner */}
      {activeChannel === 'employee_community' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-teal-300">Employee-Led Room:</strong> Messages here reflect independent conversations among colleagues. This room functions even if your employer has not registered on DdP. Employee posts are strictly <strong>not official company statements</strong>.
          </p>
        </div>
      )}

      {activeChannel === 'company_employee' && (
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Official Q&A Room:</strong> Verified Company Representatives appear with a distinctive blue seal. Use this channel to ask clarifying questions about payroll schedules, vouchers, and circulars.
          </p>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col h-[480px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2 p-6">
              <MessageSquare className="w-10 h-10 text-slate-700" />
              <p className="text-xs">No discussions posted yet in this channel.</p>
              <p className="text-[11px] text-slate-600 max-w-xs">
                Start the conversation with your colleagues or ask about payment timelines.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{msg.senderDisplayName}</span>

                    {msg.senderRoleBadge === 'org_representative' && (
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        Verified HR
                      </span>
                    )}

                    {msg.senderRoleBadge === 'admin' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Admin
                      </span>
                    )}

                    {msg.senderRoleBadge === 'moderator' && (
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        Moderator
                      </span>
                    )}

                    {msg.senderRoleBadge === 'employee' && (
                      <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                        Employee
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={() =>
                        onOpenFlagModal(
                          'community_message',
                          msg.id,
                          `Message from ${msg.senderDisplayName}: "${msg.content.slice(0, 40)}..."`
                        )
                      }
                      className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                      title="Flag message for moderation"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={
              activeChannel === 'company_employee'
                ? 'Type your inquiry for verified company representatives...'
                : 'Share an update or question with fellow workers (respectful, no bank details)...'
            }
            maxLength={1000}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !messageInput.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
