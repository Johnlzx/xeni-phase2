import type { VisaType, CaseStatus } from '@/types';

// Visa type configuration
export const VISA_TYPES: Record<VisaType, { label: string; description: string; color: string }> = {
  'skilled-worker': {
    label: 'Skilled Worker',
    description: 'For individuals with a job offer from a licensed UK employer',
    color: '#3B82F6',
  },
  'global-talent': {
    label: 'Global Talent',
    description: 'For leaders or potential leaders in academia, arts, or technology',
    color: '#8B5CF6',
  },
  'student': {
    label: 'Student',
    description: 'For individuals accepted on a course at a licensed institution',
    color: '#10B981',
  },
  'family': {
    label: 'Family',
    description: 'For family members of British citizens or settled persons',
    color: '#F59E0B',
  },
  'visitor': {
    label: 'Visitor',
    description: 'For short-term visits for tourism, business, or study',
    color: '#6B7280',
  },
  'innovator': {
    label: 'Innovator Founder',
    description: 'For experienced business people seeking to establish a business',
    color: '#EC4899',
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
