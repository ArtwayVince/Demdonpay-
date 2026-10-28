import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { HomeView } from './views/HomeView';
import { OrganisationsView } from './views/OrganisationsView';
import { SalaryUpdatesView } from './views/SalaryUpdatesView';
import { CommunitiesView } from './views/CommunitiesView';
import { ProfileView } from './views/ProfileView';
import { AcceptanceTestsView } from './views/AcceptanceTestsView';
import { SubscriptionsView } from './views/SubscriptionsView';

// Modals
import { ReportSalaryModal } from './components/ReportSalaryModal';
import { PublishAnnouncementModal } from './components/PublishAnnouncementModal';
import { ProposeOrgModal } from './components/ProposeOrgModal';
import { FlagAbuseModal } from './components/FlagAbuseModal';
import { ApplyRepModal } from './components/ApplyRepModal';
import { InviteColleaguesModal } from './components/InviteColleaguesModal';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  // Modal visibility states
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [defaultReportOrgId, setDefaultReportOrgId] = useState<string | undefined>(undefined);

  const [announceModalOpen, setAnnounceModalOpen] = useState(false);
  const [defaultAnnounceOrgId, setDefaultAnnounceOrgId] = useState<string | undefined>(undefined);

  const [proposeOrgModalOpen, setProposeOrgModalOpen] = useState(false);
  const [applyRepModalOpen, setApplyRepModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteOrgName, setInviteOrgName] = useState<string | undefined>(undefined);

  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagTarget, setFlagTarget] = useState<{
    targetType: 'salary_report' | 'official_announcement' | 'community_message' | 'organisation';
    targetId: string;
    summary: string;
  }>({
    targetType: 'salary_report',
    targetId: '',
    summary: '',
  });

  const handleOpenReportModal = (orgId?: string) => {
    setDefaultReportOrgId(orgId);
    setReportModalOpen(true);
  };

  const handleOpenAnnounceModal = (orgId?: string) => {
    setDefaultAnnounceOrgId(orgId);
    setAnnounceModalOpen(true);
  };

  const handleOpenInviteModal = (orgName?: string) => {
    setInviteOrgName(orgName);
    setInviteModalOpen(true);
  };

  const handleOpenFlagModal = (
    targetType: 'salary_report' | 'official_announcement' | 'community_message' | 'organisation',
    targetId: string,
    summary: string
  ) => {
    setFlagTarget({ targetType, targetId, summary });
    setFlagModalOpen(true);
  };

  const handleSelectOrgFromHome = (orgId: string) => {
    setSelectedOrgId(orgId);
    setActiveTab('organisations');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        onOpenReportModal={() => handleOpenReportModal()}
        onOpenAnnounceModal={() => handleOpenAnnounceModal()}
        onOpenProposeOrgModal={() => setProposeOrgModalOpen(true)}
        onOpenApplyRepModal={() => setApplyRepModalOpen(true)}
      />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={setActiveTab}
            onOpenReportModal={handleOpenReportModal}
            onOpenAnnounceModal={handleOpenAnnounceModal}
            onOpenProposeOrgModal={() => setProposeOrgModalOpen(true)}
            onOpenInviteModal={handleOpenInviteModal}
            onSelectOrg={handleSelectOrgFromHome}
          />
        )}

        {activeTab === 'organisations' && (
          <OrganisationsView
            selectedOrgId={selectedOrgId}
            onOpenReportModal={handleOpenReportModal}
            onOpenProposeOrgModal={() => setProposeOrgModalOpen(true)}
            onOpenFlagModal={(targetType, targetId, summary) =>
              handleOpenFlagModal(targetType, targetId, summary)
            }
            onOpenInviteModal={handleOpenInviteModal}
          />
        )}

        {activeTab === 'salary_updates' && (
          <SalaryUpdatesView
            onOpenReportModal={handleOpenReportModal}
            onOpenFlagModal={(targetType, targetId, summary) =>
              handleOpenFlagModal(targetType, targetId, summary)
            }
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesView
            onOpenFlagModal={(targetType, targetId, summary) =>
              handleOpenFlagModal(targetType, targetId, summary)
            }
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            onOpenReportModal={handleOpenReportModal}
            onOpenApplyRepModal={() => setApplyRepModalOpen(true)}
          />
        )}

        {activeTab === 'tests' && <AcceptanceTestsView />}

        {activeTab === 'subscriptions' && (
          <SubscriptionsView onOpenApplyRepModal={() => setApplyRepModalOpen(true)} />
        )}
      </main>

      {/* Interactive Global Modals */}
      <ReportSalaryModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultOrgId={defaultReportOrgId}
      />

      <PublishAnnouncementModal
        isOpen={announceModalOpen}
        onClose={() => setAnnounceModalOpen(false)}
        onOpenApplyRep={() => setApplyRepModalOpen(true)}
        defaultOrgId={defaultAnnounceOrgId}
      />

      <ProposeOrgModal
        isOpen={proposeOrgModalOpen}
        onClose={() => setProposeOrgModalOpen(false)}
        onOrgProposed={(newId) => {
          setSelectedOrgId(newId);
          setActiveTab('organisations');
        }}
      />

      <ApplyRepModal
        isOpen={applyRepModalOpen}
        onClose={() => setApplyRepModalOpen(false)}
      />

      <InviteColleaguesModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        orgName={inviteOrgName}
      />

      <FlagAbuseModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        targetType={flagTarget.targetType}
        targetId={flagTarget.targetId}
        targetSummary={flagTarget.summary}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
