import type { Case } from '@/types';
import { MOCK_USERS } from './users';

export const MOCK_CASES: Case[] = [
  {
    id: 'case-001',
    referenceNumber: 'XEN-2024-001',
    visaType: 'skilled-worker',
    status: 'review',
    applicant: {
      id: 'applicant-001',
      email: 'ahmed.hassan@email.com',
      phone: '+44 7700 900123',
      passport: {
        givenNames: 'Ahmed',
        surname: 'Hassan',
        nationality: 'Egyptian',
        countryOfBirth: 'Egypt',
        dateOfBirth: '1988-05-15',
        sex: 'M',
        dateOfIssue: '2020-03-01',
        dateOfExpiry: '2030-03-01',
        passportNumber: 'A12345678',
        mrzLine1: 'P<EGYHASSAN<<AHMED<<<<<<<<<<<<<<<<<<<<<<<<<<',
        mrzLine2: 'A123456782EGY8805159M3003015<<<<<<<<<<<<<<06',
      },
    },
    advisor: MOCK_USERS[0],
    assistant: MOCK_USERS[2],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    stats: {
      documentsTotal: 12,
      documentsUploaded: 9,
      qualityIssues: 2,
      logicIssues: 1,
    },
  },
  {
    id: 'case-002',
    referenceNumber: 'XEN-2024-002',
    visaType: 'naturalisation',
    status: 'intake',
    applicant: {
      id: 'applicant-002',
      email: 'maria.garcia@email.com',
      passport: {
        givenNames: 'Maria',
        surname: 'Garcia',
        nationality: 'Spanish',
        countryOfBirth: 'Spain',
        dateOfBirth: '1992-08-22',
        sex: 'F',
        dateOfIssue: '2021-06-15',
        dateOfExpiry: '2031-06-15',
        passportNumber: 'ESP123456',
      },
    },
    advisor: MOCK_USERS[1],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    stats: {
      documentsTotal: 15,
      documentsUploaded: 5,
      qualityIssues: 0,
      logicIssues: 0,
    },
  },
  {
    id: 'case-003',
    referenceNumber: 'XEN-2024-003',
    visaType: 'visitor',
    status: 'ready',
    applicant: {
      id: 'applicant-003',
      email: 'yuki.tanaka@email.com',
      passport: {
        givenNames: 'Yuki',
        surname: 'Tanaka',
        nationality: 'Japanese',
        countryOfBirth: 'Japan',
        dateOfBirth: '2000-12-03',
        sex: 'F',
        dateOfIssue: '2022-01-10',
        dateOfExpiry: '2032-01-10',
        passportNumber: 'TK9876543',
      },
    },
    advisor: MOCK_USERS[0],
    assistant: MOCK_USERS[3],
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
    stats: {
      documentsTotal: 8,
      documentsUploaded: 8,
      qualityIssues: 0,
      logicIssues: 0,
    },
  },
];

export function getCaseById(caseId: string): Case | undefined {
  return MOCK_CASES.find((c) => c.id === caseId);
}

export function getCasesByAdvisor(advisorId: string): Case[] {
  return MOCK_CASES.filter((c) => c.advisor.id === advisorId);
}
