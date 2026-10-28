import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import {
  Organisation,
  SalaryReport,
  OfficialAnnouncement,
  CommunityMessage,
  ModerationReport,
  ModerationLog,
  RepVerificationRequest,
  AppNotification
} from '../types';
import {
  INITIAL_ORGANISATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_REPORTS,
  INITIAL_MESSAGES
} from '../data/seedData';
import { useAuth } from './AuthContext';

interface DataContextType {
  organisations: Organisation[];
  announcements: OfficialAnnouncement[];
  salaryReports: SalaryReport[];
  communityMessages: CommunityMessage[];
  moderationReports: ModerationReport[];
  moderationLogs: ModerationLog[];
  repVerifications: RepVerificationRequest[];
  notifications: AppNotification[];
  submitSalaryReport: (data: Omit<SalaryReport, 'id' | 'createdAt' | 'sourceType'>) => Promise<SalaryReport>;
  publishOfficialAnnouncement: (data: Omit<OfficialAnnouncement, 'id' | 'createdAt' | 'isOfficial'>) => Promise<OfficialAnnouncement>;
  proposeOrganisation: (data: Omit<Organisation, 'id' | 'createdAt' | 'followerCount' | 'totalReportsCount' | 'isVerifiedOnDdP' | 'verificationStatus' | 'createdBy'>) => Promise<Organisation>;
  flagAbuse: (data: Omit<ModerationReport, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  resolveModerationReport: (reportId: string, actionTaken: string, moderatorNotes: string) => Promise<void>;
  applyForRepVerification: (data: Omit<RepVerificationRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  reviewRepVerification: (reqId: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
  postCommunityMessage: (data: Omit<CommunityMessage, 'id' | 'createdAt'>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  clearNotification: (id: string) => void;
  getOrganisationById: (id: string) => Organisation | undefined;
  getReportsForOrg: (orgId: string) => SalaryReport[];
  getAnnouncementsForOrg: (orgId: string) => OfficialAnnouncement[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, activeRole, isAdmin, isModerator } = useAuth();

  const [organisations, setOrganisations] = useState<Organisation[]>(INITIAL_ORGANISATIONS);
  const [announcements, setAnnouncements] = useState<OfficialAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>(INITIAL_REPORTS);
  const [communityMessages, setCommunityMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([
    {
      id: 'flag-demo-1',
      targetType: 'salary_report',
      targetId: 'rep-7',
      targetSummary: 'Report for University of Ibadan',
      reporterUid: 'emp_usman_04',
      reporterName: 'Dr. Usman M.',
      reason: 'suspected_prank',
      description: 'Report claiming UI non-receipt was posted before expected senate payroll date. Please cross-verify.',
      status: 'pending',
      createdAt: '2026-10-27T10:00:00Z',
    }
  ]);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([
    {
      id: 'log-demo-1',
      action: 'Verified Organization Representative',
      targetType: 'organisation',
      targetId: 'lasg-org',
      moderatorUid: 'sys_admin',
      moderatorName: 'Dem Don Pay Compliance Desk',
      notes: 'Verified CAC documents & official LASG letterhead credentials.',
      createdAt: '2026-09-02T10:00:00Z',
    }
  ]);
  const [repVerifications, setRepVerifications] = useState<RepVerificationRequest[]>([
    {
      id: 'req-fmoh-1',
      orgId: 'fmoh-org',
      orgName: 'Federal Ministry of Health',
      applicantUid: 'user_rep_fmoh_candidate',
      applicantName: 'Bolanle Balogun',
      officialWorkEmail: 'b.balogun@health.gov.ng',
      cacNumberOrGovId: 'FMoH/HR/2026/AUTH-77',
      jobTitle: 'Assistant Director, Personnel & Payroll Liaison',
      status: 'pending',
      createdAt: '2026-10-26T14:00:00Z',
    }
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Official Circular: Lagos State Civil Service',
      message: 'Disbursement of October 2026 Salaries announced by verified Public Service Office.',
      type: 'official',
      orgId: 'lasg-org',
      read: false,
      timestamp: '2026-10-25T11:30:00Z',
    },
    {
      id: 'notif-2',
      title: 'Peer Reports: NNPC Ltd',
      message: '38 colleagues report receiving salaries for October 2026.',
      type: 'report',
      orgId: 'nnpc-org',
      read: false,
      timestamp: '2026-10-24T16:00:00Z',
    }
  ]);

  // Firestore sync with local fallback
  useEffect(() => {
    // Sync organisations
    const unsubOrgs = onSnapshot(collection(db, 'organisations'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => doc.data() as Organisation);
        setOrganisations(loaded);
      }
    }, (error) => {
      console.warn('Realtime organisations listener notice:', error.message);
    });

    // Sync announcements
    const unsubAnn = onSnapshot(collection(db, 'official_announcements'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => doc.data() as OfficialAnnouncement);
        setAnnouncements(loaded);
      }
    }, (error) => {
      console.warn('Realtime announcements listener notice:', error.message);
    });

    // Sync salary reports
    const unsubRep = onSnapshot(collection(db, 'salary_reports'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => doc.data() as SalaryReport);
        setSalaryReports(loaded);
      }
    }, (error) => {
      console.warn('Realtime salary reports listener notice:', error.message);
    });

    // Sync messages
    const unsubMsg = onSnapshot(collection(db, 'community_messages'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => doc.data() as CommunityMessage);
        setCommunityMessages(loaded);
      }
    }, (error) => {
      console.warn('Realtime community messages listener notice:', error.message);
    });

    return () => {
      unsubOrgs();
      unsubAnn();
      unsubRep();
      unsubMsg();
    };
  }, []);

  // Recalculate org counts when reports change
  const recalculateOrgCounts = (orgId: string, allReports: SalaryReport[]) => {
    const orgReps = allReports.filter(r => r.orgId === orgId);
    const rec = orgReps.filter(r => r.status === 'salary_received').length;
    const notRec = orgReps.filter(r => r.status === 'salary_not_received').length;
    const part = orgReps.filter(r => r.status === 'partial_payment').length;

    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          receivedCount: rec,
          notReceivedCount: notRec,
          partialCount: part,
          totalReportsCount: orgReps.length
        };
      }
      return org;
    }));
  };

  // Submit personal salary report
  const submitSalaryReport = async (data: Omit<SalaryReport, 'id' | 'createdAt' | 'sourceType'>): Promise<SalaryReport> => {
    const id = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newReport: SalaryReport = {
      ...data,
      id,
      sourceType: 'employee_reported',
      isDisputed: false,
      createdAt: new Date().toISOString(),
    };

    // Update in memory first
    const updated = [newReport, ...salaryReports.filter(r => !(r.orgId === data.orgId && r.userId === data.userId))];
    setSalaryReports(updated);
    recalculateOrgCounts(data.orgId, updated);

    // Try Firestore
    try {
      await setDoc(doc(db, 'salary_reports', id), newReport);
    } catch (err) {
      console.warn('Direct firestore write notice (running with state):', err);
    }

    return newReport;
  };

  // Publish official announcement - strictly checks authorization!
  const publishOfficialAnnouncement = async (
    data: Omit<OfficialAnnouncement, 'id' | 'createdAt' | 'isOfficial'>
  ): Promise<OfficialAnnouncement> => {
    // ENFORCE AUTHORISATION: Ordinary employee cannot publish official announcement
    if (activeRole === 'employee' && !isAdmin) {
      throw new Error(
        'AUTHORIZATION_DENIED: An ordinary employee cannot publish an official company announcement. Only verified organisation representatives or platform administrators possess this credential.'
      );
    }

    const id = `ann_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAnnouncement: OfficialAnnouncement = {
      ...data,
      id,
      isOfficial: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);

    // Add in-app notification for employees
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Official Circular: ${data.orgName}`,
      message: `${data.title} (${data.payrollPeriod})`,
      type: 'official',
      orgId: data.orgId,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'official_announcements', id), newAnnouncement);
    } catch (err) {
      console.warn('Announcement firestore write notice:', err);
    }

    return newAnnouncement;
  };

  // Propose an unlisted organisation
  const proposeOrganisation = async (
    data: Omit<Organisation, 'id' | 'createdAt' | 'followerCount' | 'totalReportsCount' | 'isVerifiedOnDdP' | 'verificationStatus' | 'createdBy'>
  ): Promise<Organisation> => {
    // Duplicate check
    const existing = organisations.find(o =>
      o.name.toLowerCase().trim() === data.name.toLowerCase().trim() ||
      (data.acronym && o.acronym?.toLowerCase().trim() === data.acronym.toLowerCase().trim())
    );

    if (existing) {
      throw new Error(`An organisation matching "${existing.name}" is already catalogued in the directory.`);
    }

    const cleanId = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + '-' + Math.random().toString(36).substring(2, 5);
    const newOrg: Organisation = {
      ...data,
      id: cleanId,
      isVerifiedOnDdP: false,
      verificationStatus: 'unclaimed',
      followerCount: 1,
      totalReportsCount: 0,
      receivedCount: 0,
      notReceivedCount: 0,
      partialCount: 0,
      createdBy: userProfile?.id || 'anonymous_employee',
      createdAt: new Date().toISOString(),
    };

    setOrganisations(prev => [newOrg, ...prev]);

    try {
      await setDoc(doc(db, 'organisations', cleanId), newOrg);
    } catch (err) {
      console.warn('Organisation firestore write notice:', err);
    }

    return newOrg;
  };

  // Flag abuse or suspected prank
  const flagAbuse = async (data: Omit<ModerationReport, 'id' | 'createdAt' | 'status'>) => {
    const id = `flag_${Date.now()}`;
    const newFlag: ModerationReport = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setModerationReports(prev => [newFlag, ...prev]);

    try {
      await setDoc(doc(db, 'moderation_reports', id), newFlag);
    } catch (err) {
      console.warn('Flag abuse firestore notice:', err);
    }
  };

  // Moderator / Admin resolves flagged report
  const resolveModerationReport = async (reportId: string, actionTaken: string, moderatorNotes: string) => {
    if (!isModerator && !isAdmin) {
      throw new Error('UNAUTHORIZED: Only moderators or administrators can resolve moderation reports.');
    }

    const report = moderationReports.find(r => r.id === reportId);
    const updatedFlags = moderationReports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'resolved' as const,
          actionTaken,
          moderatorNotes,
          resolvedBy: userProfile?.displayName || 'Moderator Desk',
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    setModerationReports(updatedFlags);

    // If report was against a salary report, mark as disputed
    if (report && report.targetType === 'salary_report' && actionTaken.toLowerCase().includes('dispute')) {
      setSalaryReports(prev => prev.map(sr => sr.id === report.targetId ? { ...sr, isDisputed: true } : sr));
    }

    // Generate auditable moderation log
    const auditLog: ModerationLog = {
      id: `log_${Date.now()}`,
      action: actionTaken,
      targetType: report?.targetType || 'entity',
      targetId: report?.targetId || reportId,
      moderatorUid: userProfile?.id || 'moderator_uid',
      moderatorName: userProfile?.displayName || 'Moderator',
      notes: moderatorNotes,
      createdAt: new Date().toISOString(),
    };
    setModerationLogs(prev => [auditLog, ...prev]);

    try {
      await updateDoc(doc(db, 'moderation_reports', reportId), {
        status: 'resolved',
        actionTaken,
        moderatorNotes,
        resolvedBy: userProfile?.id || 'mod',
        updatedAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'moderation_logs', auditLog.id), auditLog);
    } catch (err) {
      console.warn('Moderation resolution firestore notice:', err);
    }
  };

  // Apply for representative verification
  const applyForRepVerification = async (data: Omit<RepVerificationRequest, 'id' | 'createdAt' | 'status'>) => {
    const id = `rep_req_${Date.now()}`;
    const newReq: RepVerificationRequest = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRepVerifications(prev => [newReq, ...prev]);

    try {
      await setDoc(doc(db, 'rep_verifications', id), newReq);
    } catch (err) {
      console.warn('Rep verification application notice:', err);
    }
  };

  // Admin/Moderator reviews rep application
  const reviewRepVerification = async (reqId: string, status: 'approved' | 'rejected', reason?: string) => {
    if (!isAdmin && !isModerator) {
      throw new Error('UNAUTHORIZED: Only administrators or moderators can approve representative credentials.');
    }

    const req = repVerifications.find(r => r.id === reqId);
    if (!req) return;

    setRepVerifications(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status,
          rejectionReason: reason,
          reviewedBy: userProfile?.displayName || 'Admin Desk',
          reviewedAt: new Date().toISOString(),
        };
      }
      return r;
    }));

    if (status === 'approved') {
      // Update organisation to verified
      setOrganisations(prev => prev.map(org => {
        if (org.id === req.orgId) {
          return {
            ...org,
            isVerifiedOnDdP: true,
            verificationStatus: 'verified',
            verifiedRepUid: req.applicantUid,
            verifiedRepName: req.applicantName,
            verifiedRepTitle: req.jobTitle,
          };
        }
        return org;
      }));

      // Log audit
      const auditLog: ModerationLog = {
        id: `log_${Date.now()}`,
        action: `Approved Official Organisation Representative: ${req.applicantName}`,
        targetType: 'organisation',
        targetId: req.orgId,
        moderatorUid: userProfile?.id || 'admin',
        moderatorName: userProfile?.displayName || 'Admin',
        notes: `Verified work email ${req.officialWorkEmail} & doc reference ${req.cacNumberOrGovId}`,
        createdAt: new Date().toISOString(),
      };
      setModerationLogs(prev => [auditLog, ...prev]);
    }
  };

  // Community message post
  const postCommunityMessage = async (data: Omit<CommunityMessage, 'id' | 'createdAt'>) => {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: CommunityMessage = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    setCommunityMessages(prev => [...prev, newMsg]);

    try {
      await setDoc(doc(db, 'community_messages', id), newMsg);
    } catch (err) {
      console.warn('Community message firestore notice:', err);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getOrganisationById = (id: string) => organisations.find(o => o.id === id);
  const getReportsForOrg = (orgId: string) => salaryReports.filter(r => r.orgId === orgId);
  const getAnnouncementsForOrg = (orgId: string) => announcements.filter(a => a.orgId === orgId);

  return (
    <DataContext.Provider
      value={{
        organisations,
        announcements,
        salaryReports,
        communityMessages,
        moderationReports,
        moderationLogs,
        repVerifications,
        notifications,
        submitSalaryReport,
        publishOfficialAnnouncement,
        proposeOrganisation,
        flagAbuse,
        resolveModerationReport,
        applyForRepVerification,
        reviewRepVerification,
        postCommunityMessage,
        markNotificationRead,
        clearNotification,
        getOrganisationById,
        getReportsForOrg,
        getAnnouncementsForOrg,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
