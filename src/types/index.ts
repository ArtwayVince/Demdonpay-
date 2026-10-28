export type UserRole = 'employee' | 'org_representative' | 'moderator' | 'admin';

export type SectorType = 'public' | 'private';

export type VerificationStatus = 'unclaimed' | 'pending' | 'verified';

export type SalaryStatus =
  | 'salary_expected'
  | 'official_payment_announcement'
  | 'employee_reports_received'
  | 'employee_reports_not_received'
  | 'employee_reports_partial'
  | 'payment_under_review'
  | 'disputed_payment_information';

export interface UserPublic {
  id: string;
  displayName: string;
  role: UserRole;
  country: string;
  bio?: string;
  photoURL?: string;
  followedOrgIds?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserPrivate {
  email: string;
  phone?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'none';
  updatedAt: string;
}

export interface Organisation {
  id: string;
  name: string;
  acronym?: string;
  sector: SectorType;
  industry: string;
  country: string;
  website?: string;
  contactEmail?: string;
  headquarters?: string;
  isVerifiedOnDdP: boolean;
  verificationStatus: VerificationStatus;
  verifiedRepUid?: string;
  verifiedRepName?: string;
  verifiedRepTitle?: string;
  followerCount: number;
  totalReportsCount: number;
  receivedCount?: number;
  notReceivedCount?: number;
  partialCount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SalaryReport {
  id: string;
  orgId: string;
  orgName?: string;
  userId: string;
  userDisplayName: string;
  payrollPeriod: string; // e.g. "October 2026"
  status: 'salary_received' | 'salary_not_received' | 'partial_payment';
  partialPercentage?: number;
  notes?: string;
  sourceType: 'employee_reported';
  isDisputed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OfficialAnnouncement {
  id: string;
  orgId: string;
  orgName: string;
  publisherUid: string;
  publisherName: string;
  publisherRole: string;
  payrollPeriod: string;
  title: string;
  circularNumber?: string;
  announcementDate?: string;
  status: 'official_payment_announcement' | 'salary_expected' | 'disputed_by_moderator';
  content: string;
  isOfficial: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RepVerificationRequest {
  id: string;
  orgId: string;
  orgName: string;
  applicantUid: string;
  applicantName: string;
  officialWorkEmail: string;
  cacNumberOrGovId: string;
  jobTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface CommunityMessage {
  id: string;
  roomType: 'employee_community' | 'company_employee' | 'general_payday';
  orgId?: string;
  topic?: string;
  senderUid: string;
  senderDisplayName: string;
  senderRoleBadge: UserRole;
  content: string;
  isFlagged?: boolean;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'salary_report' | 'official_announcement' | 'community_message' | 'organisation';
  targetId: string;
  targetSummary?: string;
  reporterUid: string;
  reporterName?: string;
  reason: 'suspected_prank' | 'impersonation' | 'false_claim' | 'harassment' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  actionTaken?: string;
  moderatorNotes?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ModerationLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  moderatorUid: string;
  moderatorName?: string;
  notes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'official' | 'report' | 'moderation' | 'system';
  orgId?: string;
  read: boolean;
  timestamp: string;
}
