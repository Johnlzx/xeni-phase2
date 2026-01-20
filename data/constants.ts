import type { VisaType, CaseStatus } from '@/types';

// Visa type configuration
export const VISA_TYPES: Record<VisaType, { label: string; description: string; color: string }> = {
  'skilled-worker': {
    label: 'Skilled Worker Visa',
    description: 'For individuals with a job offer from a licensed UK employer',
    color: '#3B82F6',
  },
  'naturalisation': {
    label: 'Naturalisation',
    description: 'For applying for British citizenship through naturalisation',
    color: '#8B5CF6',
  },
  'visitor': {
    label: 'Visitor Visa',
    description: 'For short-term visits for tourism, business, or study',
    color: '#6B7280',
  },
  'partner-spouse': {
    label: 'Partner/Spouse Visa (outside the UK)',
    description: 'For partners or spouses of British citizens applying from outside the UK',
    color: '#F59E0B',
  },
};

// Case status configuration
export const CASE_STATUSES: Record<CaseStatus, { label: string; color: string }> = {
  intake: {
    label: 'Intake',
    color: '#6B7280',
  },
  review: {
    label: 'In Review',
    color: '#3B82F6',
  },
  ready: {
    label: 'Ready',
    color: '#10B981',
  },
  approved: {
    label: 'Approved',
    color: '#059669',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
  },
};

// Application routes
export const ROUTES = {
  HOME: '/',
  CASES: '/cases',
  CASE_DETAIL: (caseId: string) => `/cases/${caseId}`,
};
