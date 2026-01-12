import type {
  VisaRoute,
  TriageQuestion,
  EvidenceModuleTemplate,
  EvidenceSlotTemplate,
} from '@/types/command-center';

// =============================================================================
// Common Slot Templates (reused across visa types)
// =============================================================================

const PASSPORT_SLOT: EvidenceSlotTemplate = {
  id: 'passport',
  name: 'Passport',
  description: 'Current valid passport with at least 6 months validity',
  acceptedDocTypes: ['passport'],
  required: true,
  validationRules: [
    {
      id: 'expiry-check',
      type: 'expiry',
      params: { minMonthsValid: 6 },
      errorMessage: 'Passport must have at least 6 months validity from application date',
    },
  ],
};

const BRP_SLOT: EvidenceSlotTemplate = {
  id: 'brp',
  name: 'Biometric Residence Permit',
  description: 'Current BRP if applying from within the UK',
  acceptedDocTypes: ['brp'],
  required: false, // Conditional on in-country application
};

const TRAVEL_HISTORY_SLOT: EvidenceSlotTemplate = {
  id: 'travel-history',
  name: 'Travel History',
  description: 'Previous visas and travel stamps',
  acceptedDocTypes: ['visa', 'travel-stamp', 'passport'],
  required: false,
};

// =============================================================================
// Skilled Worker Visa Route
// =============================================================================

const SKILLED_WORKER_TRIAGE: TriageQuestion[] = [
  {
    id: 'sw-location',
    question: 'Is the applicant currently inside the UK?',
    questionZh: '申请人目前是否在英国境内？',
    type: 'boolean',
    affectsModules: ['identity-status'],
  },
  {
    id: 'sw-cos',
    question: 'Does the applicant have a valid Certificate of Sponsorship (CoS)?',
    questionZh: '申请人是否持有有效的担保证书 (CoS)？',
    type: 'boolean',
    affectsModules: ['sponsorship'],
  },
  {
    id: 'sw-salary-type',
    question: 'How is the applicant paid?',
    questionZh: '申请人的薪资支付方式是什么？',
    type: 'single-choice',
    options: [
      { value: 'annual', label: 'Annual salary', labelZh: '年薪' },
      { value: 'hourly', label: 'Hourly rate', labelZh: '时薪' },
    ],
    affectsModules: ['sponsorship'],
  },
  {
    id: 'sw-dependents',
    question: 'Are any dependents applying together?',
    questionZh: '是否有家属一同申请？',
    type: 'boolean',
    affectsModules: ['dependents'],
  },
];

const SKILLED_WORKER_MODULES: EvidenceModuleTemplate[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    category: 'identity',
    priority: 'required',
    slots: [
      PASSPORT_SLOT,
      {
        ...BRP_SLOT,
        required: true, // Required for in-country applications
      },
      TRAVEL_HISTORY_SLOT,
    ],
    conditionalOn: undefined,
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship Details',
    category: 'sponsorship',
    priority: 'required',
    slots: [
      {
        id: 'cos',
        name: 'Certificate of Sponsorship',
        description: 'CoS reference number and details from sponsor',
        acceptedDocTypes: ['cos-letter', 'cos-email'],
        required: true,
      },
      {
        id: 'job-offer',
        name: 'Job Offer Letter',
        description: 'Official offer letter confirming role and salary',
        acceptedDocTypes: ['offer-letter'],
        required: true,
        validationRules: [
          {
            id: 'salary-threshold',
            type: 'threshold',
            params: {
              field: 'salary',
              minValue: 26200, // General threshold as of 2024
              currency: 'GBP',
            },
            errorMessage: 'Salary must meet the minimum threshold of £26,200 per year',
          },
        ],
      },
      {
        id: 'contract',
        name: 'Employment Contract',
        description: 'Signed employment contract',
        acceptedDocTypes: ['contract'],
        required: false,
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Requirement',
    category: 'financial',
    priority: 'required',
    slots: [
      {
        id: 'bank-statements',
        name: 'Bank Statements',
        description: 'Bank statements showing funds held for 28 consecutive days',
        acceptedDocTypes: ['bank-statement'],
        required: true,
        validationRules: [
          {
            id: '28-day-rule',
            type: 'continuity',
            params: {
              minDays: 28,
              minAmount: 1270, // Maintenance funds requirement
              currency: 'GBP',
            },
            errorMessage: 'Funds must be held for at least 28 consecutive days',
          },
        ],
      },
      {
        id: 'sponsor-cert-a',
        name: 'Sponsor Cert A Letter',
        description: 'Letter from sponsor confirming maintenance support',
        acceptedDocTypes: ['sponsor-letter'],
        required: false,
      },
    ],
  },
  {
    id: 'english-language',
    name: 'English Language',
    category: 'english',
    priority: 'required',
    slots: [
      {
        id: 'selt',
        name: 'SELT Certificate',
        description: 'Secure English Language Test certificate',
        acceptedDocTypes: ['selt-certificate', 'ielts'],
        required: false, // One of SELT or degree required
        validationRules: [
          {
            id: 'selt-level',
            type: 'threshold',
            params: { minLevel: 'B1' },
            errorMessage: 'SELT must be at least CEFR Level B1',
          },
        ],
      },
      {
        id: 'degree',
        name: 'Degree Certificate',
        description: 'Degree taught in English (with Ecctis/ENIC if non-UK)',
        acceptedDocTypes: ['degree-certificate', 'ecctis'],
        required: false,
      },
    ],
  },
  {
    id: 'tb-test',
    name: 'Tuberculosis Test',
    category: 'identity',
    priority: 'required',
    slots: [
      {
        id: 'tb-certificate',
        name: 'TB Test Certificate',
        description: 'Tuberculosis test result from approved clinic',
        acceptedDocTypes: ['tb-certificate'],
        required: true,
        validationRules: [
          {
            id: 'tb-validity',
            type: 'expiry',
            params: { maxMonthsOld: 6 },
            errorMessage: 'TB test certificate must be less than 6 months old',
          },
        ],
      },
    ],
    conditionalOn: {
      questionId: 'sw-location',
      value: false, // Only for overseas applications
    },
  },
];

// =============================================================================
// Global Talent Visa Route
// =============================================================================

const GLOBAL_TALENT_TRIAGE: TriageQuestion[] = [
  {
    id: 'gt-endorsement',
    question: 'Does the applicant have an endorsement from a designated body?',
    questionZh: '申请人是否已获得指定机构的背书？',
    type: 'boolean',
    affectsModules: ['endorsement'],
  },
  {
    id: 'gt-field',
    question: 'Which field is the endorsement for?',
    questionZh: '背书所属领域是？',
    type: 'single-choice',
    options: [
      { value: 'science', label: 'Science & Medicine', labelZh: '科学与医学' },
      { value: 'engineering', label: 'Engineering', labelZh: '工程' },
      { value: 'humanities', label: 'Humanities', labelZh: '人文学科' },
      { value: 'digital', label: 'Digital Technology', labelZh: '数字技术' },
      { value: 'arts', label: 'Arts & Culture', labelZh: '艺术与文化' },
    ],
    dependsOn: {
      questionId: 'gt-endorsement',
      value: true,
    },
    affectsModules: ['endorsement'],
  },
  {
    id: 'gt-location',
    question: 'Is the applicant currently inside the UK?',
    questionZh: '申请人目前是否在英国境内？',
    type: 'boolean',
    affectsModules: ['identity-status'],
  },
];

const GLOBAL_TALENT_MODULES: EvidenceModuleTemplate[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    category: 'identity',
    priority: 'required',
    slots: [PASSPORT_SLOT, BRP_SLOT, TRAVEL_HISTORY_SLOT],
  },
  {
    id: 'endorsement',
    name: 'Endorsement',
    category: 'business',
    priority: 'required',
    slots: [
      {
        id: 'endorsement-letter',
        name: 'Endorsement Letter',
        description: 'Letter from Tech Nation, Royal Society, British Academy, etc.',
        acceptedDocTypes: ['endorsement-letter'],
        required: true,
      },
      {
        id: 'supporting-evidence',
        name: 'Supporting Evidence',
        description: 'Publications, awards, media coverage, etc.',
        acceptedDocTypes: ['publication', 'award', 'media'],
        required: false,
      },
    ],
  },
];

// =============================================================================
// Spouse/Partner Visa (Appendix FM)
// =============================================================================

const FAMILY_VISA_TRIAGE: TriageQuestion[] = [
  {
    id: 'fm-relationship',
    question: 'What is the relationship to the sponsor?',
    questionZh: '与担保人的关系是？',
    type: 'single-choice',
    options: [
      { value: 'spouse', label: 'Spouse (married)', labelZh: '配偶（已婚）' },
      { value: 'civil-partner', label: 'Civil Partner', labelZh: '民事伴侣' },
      { value: 'unmarried', label: 'Unmarried Partner (2+ years)', labelZh: '未婚伴侣（同居2年以上）' },
      { value: 'fiancee', label: 'Fiancé(e)', labelZh: '未婚夫/妻' },
    ],
    affectsModules: ['relationship'],
  },
  {
    id: 'fm-sponsor-status',
    question: 'What is the sponsor\'s immigration status?',
    questionZh: '担保人的移民身份是？',
    type: 'single-choice',
    options: [
      { value: 'british', label: 'British Citizen', labelZh: '英国公民' },
      { value: 'ilr', label: 'Indefinite Leave to Remain', labelZh: '永居' },
      { value: 'settled', label: 'EU Settled Status', labelZh: '欧盟定居身份' },
    ],
    affectsModules: ['sponsor'],
  },
  {
    id: 'fm-income-source',
    question: 'How will the financial requirement be met?',
    questionZh: '如何满足财务要求？',
    type: 'single-choice',
    options: [
      { value: 'employment', label: 'Employment income', labelZh: '工作收入' },
      { value: 'self-employed', label: 'Self-employment', labelZh: '自雇收入' },
      { value: 'cash-savings', label: 'Cash savings', labelZh: '现金存款' },
      { value: 'combined', label: 'Combined sources', labelZh: '混合来源' },
    ],
    affectsModules: ['financial'],
  },
  {
    id: 'fm-accommodation',
    question: 'Is adequate accommodation arranged?',
    questionZh: '是否已安排适当住所？',
    type: 'boolean',
    affectsModules: ['accommodation'],
  },
];

const FAMILY_VISA_MODULES: EvidenceModuleTemplate[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    category: 'identity',
    priority: 'required',
    slots: [PASSPORT_SLOT, BRP_SLOT, TRAVEL_HISTORY_SLOT],
  },
  {
    id: 'relationship',
    name: 'Relationship Evidence',
    category: 'relationship',
    priority: 'required',
    slots: [
      {
        id: 'marriage-cert',
        name: 'Marriage/Civil Partnership Certificate',
        description: 'Official marriage or civil partnership certificate',
        acceptedDocTypes: ['marriage-certificate', 'civil-partnership'],
        required: true,
      },
      {
        id: 'cohabitation',
        name: 'Cohabitation Evidence',
        description: 'Evidence of living together (for unmarried partners)',
        acceptedDocTypes: ['utility-bill', 'tenancy', 'bank-statement'],
        required: false,
      },
      {
        id: 'relationship-photos',
        name: 'Photographs',
        description: 'Photos documenting the relationship over time',
        acceptedDocTypes: ['photo'],
        required: false,
      },
      {
        id: 'communication',
        name: 'Communication Evidence',
        description: 'Chat logs, call records, letters',
        acceptedDocTypes: ['communication'],
        required: false,
      },
    ],
  },
  {
    id: 'sponsor',
    name: 'Sponsor Details',
    category: 'identity',
    priority: 'required',
    slots: [
      {
        id: 'sponsor-passport',
        name: 'Sponsor Passport',
        description: 'Sponsor\'s valid passport or BRP',
        acceptedDocTypes: ['passport', 'brp'],
        required: true,
      },
      {
        id: 'sponsor-status',
        name: 'Immigration Status Evidence',
        description: 'Evidence of sponsor\'s settled status',
        acceptedDocTypes: ['brp', 'naturalisation', 'birth-certificate'],
        required: true,
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Requirement',
    category: 'financial',
    priority: 'required',
    slots: [
      {
        id: 'payslips',
        name: 'Payslips',
        description: 'Last 6 months of payslips',
        acceptedDocTypes: ['payslip'],
        required: true,
        validationRules: [
          {
            id: 'income-threshold',
            type: 'threshold',
            params: { minAnnual: 29000, currency: 'GBP' }, // 2024 requirement
            errorMessage: 'Income must meet minimum requirement of £29,000 per year',
          },
        ],
      },
      {
        id: 'bank-statements-6m',
        name: 'Bank Statements (6 months)',
        description: 'Personal bank statements showing salary credits',
        acceptedDocTypes: ['bank-statement'],
        required: true,
      },
      {
        id: 'employer-letter',
        name: 'Employer Letter',
        description: 'Letter confirming employment details and salary',
        acceptedDocTypes: ['employer-letter'],
        required: true,
      },
      {
        id: 'p60',
        name: 'P60',
        description: 'End of year tax summary',
        acceptedDocTypes: ['p60'],
        required: false,
      },
    ],
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    category: 'accommodation',
    priority: 'required',
    slots: [
      {
        id: 'tenancy',
        name: 'Tenancy Agreement / Mortgage Statement',
        description: 'Proof of ownership or tenancy',
        acceptedDocTypes: ['tenancy', 'mortgage'],
        required: true,
      },
      {
        id: 'council-tax',
        name: 'Council Tax Statement',
        description: 'Council tax bill showing address',
        acceptedDocTypes: ['council-tax'],
        required: false,
      },
    ],
  },
  {
    id: 'english-language',
    name: 'English Language',
    category: 'english',
    priority: 'required',
    slots: [
      {
        id: 'selt-a1',
        name: 'SELT Certificate (A1)',
        description: 'Speaking and listening test at A1 level',
        acceptedDocTypes: ['selt-certificate'],
        required: true,
        validationRules: [
          {
            id: 'selt-level-a1',
            type: 'threshold',
            params: { minLevel: 'A1' },
            errorMessage: 'SELT must be at least CEFR Level A1 for initial entry',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// Student Visa Route
// =============================================================================

const STUDENT_VISA_TRIAGE: TriageQuestion[] = [
  {
    id: 'st-cas',
    question: 'Does the applicant have a valid CAS (Confirmation of Acceptance for Studies)?',
    questionZh: '申请人是否持有有效的 CAS？',
    type: 'boolean',
    affectsModules: ['academic'],
  },
  {
    id: 'st-course-level',
    question: 'What level is the course?',
    questionZh: '课程等级是？',
    type: 'single-choice',
    options: [
      { value: 'degree', label: 'Degree level or above', labelZh: '学位及以上' },
      { value: 'below-degree', label: 'Below degree level', labelZh: '学位以下' },
    ],
    affectsModules: ['academic', 'financial'],
  },
  {
    id: 'st-location',
    question: 'Where will the applicant be studying?',
    questionZh: '将在哪里学习？',
    type: 'single-choice',
    options: [
      { value: 'london', label: 'London', labelZh: '伦敦' },
      { value: 'outside-london', label: 'Outside London', labelZh: '伦敦以外' },
    ],
    affectsModules: ['financial'],
  },
  {
    id: 'st-official-sponsor',
    question: 'Is the applicant officially sponsored (government/international scholarship)?',
    questionZh: '是否有官方赞助（政府/国际奖学金）？',
    type: 'boolean',
    affectsModules: ['financial'],
  },
];

const STUDENT_VISA_MODULES: EvidenceModuleTemplate[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    category: 'identity',
    priority: 'required',
    slots: [PASSPORT_SLOT, BRP_SLOT, TRAVEL_HISTORY_SLOT],
  },
  {
    id: 'academic',
    name: 'Academic Documents',
    category: 'academic',
    priority: 'required',
    slots: [
      {
        id: 'cas',
        name: 'CAS Statement',
        description: 'Confirmation of Acceptance for Studies',
        acceptedDocTypes: ['cas'],
        required: true,
      },
      {
        id: 'qualifications',
        name: 'Academic Qualifications',
        description: 'Transcripts and certificates used in CAS',
        acceptedDocTypes: ['transcript', 'degree-certificate'],
        required: true,
      },
      {
        id: 'atas',
        name: 'ATAS Certificate',
        description: 'Academic Technology Approval Scheme certificate (if required)',
        acceptedDocTypes: ['atas'],
        required: false,
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Requirement',
    category: 'financial',
    priority: 'required',
    slots: [
      {
        id: 'bank-statements',
        name: 'Bank Statements',
        description: 'Bank statements showing funds held for 28 consecutive days',
        acceptedDocTypes: ['bank-statement'],
        required: true,
        validationRules: [
          {
            id: '28-day-rule',
            type: 'continuity',
            params: { minDays: 28 },
            errorMessage: 'Funds must be held for at least 28 consecutive days',
          },
        ],
      },
      {
        id: 'official-sponsor-letter',
        name: 'Official Financial Sponsorship Letter',
        description: 'Letter from government or scholarship body',
        acceptedDocTypes: ['sponsor-letter'],
        required: false,
      },
    ],
  },
  {
    id: 'english-language',
    name: 'English Language',
    category: 'english',
    priority: 'required',
    slots: [
      {
        id: 'selt-b2',
        name: 'SELT Certificate',
        description: 'SELT at required level for course',
        acceptedDocTypes: ['selt-certificate', 'ielts'],
        required: true,
      },
    ],
  },
  {
    id: 'tb-test',
    name: 'Tuberculosis Test',
    category: 'identity',
    priority: 'required',
    slots: [
      {
        id: 'tb-certificate',
        name: 'TB Test Certificate',
        description: 'Tuberculosis test result from approved clinic',
        acceptedDocTypes: ['tb-certificate'],
        required: true,
      },
    ],
  },
];

// =============================================================================
// ILR (Indefinite Leave to Remain) Route
// =============================================================================

const ILR_TRIAGE: TriageQuestion[] = [
  {
    id: 'ilr-current-visa',
    question: 'What is the applicant\'s current visa category?',
    questionZh: '申请人目前的签证类别是？',
    type: 'single-choice',
    options: [
      { value: 'skilled-worker', label: 'Skilled Worker', labelZh: '技术工人签证' },
      { value: 'spouse', label: 'Spouse/Partner', labelZh: '配偶签证' },
      { value: 'tier1', label: 'Tier 1 (various)', labelZh: 'Tier 1 签证' },
      { value: 'other', label: 'Other', labelZh: '其他' },
    ],
    affectsModules: ['residence'],
  },
  {
    id: 'ilr-years',
    question: 'How long has the applicant been in the UK on their current route?',
    questionZh: '申请人在当前签证类别下在英国居住多长时间？',
    type: 'single-choice',
    options: [
      { value: '5-years', label: '5+ years', labelZh: '5年以上' },
      { value: '10-years', label: '10+ years (long residence)', labelZh: '10年以上（长期居留）' },
    ],
    affectsModules: ['residence'],
  },
  {
    id: 'ilr-absences',
    question: 'Has the applicant been absent from the UK for more than 180 days in any 12-month period?',
    questionZh: '申请人是否在任何12个月内离开英国超过180天？',
    type: 'boolean',
    affectsModules: ['residence'],
  },
];

const ILR_MODULES: EvidenceModuleTemplate[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    category: 'identity',
    priority: 'required',
    slots: [PASSPORT_SLOT, BRP_SLOT, TRAVEL_HISTORY_SLOT],
  },
  {
    id: 'residence',
    name: 'Continuous Residence',
    category: 'identity',
    priority: 'required',
    slots: [
      {
        id: 'residence-history',
        name: 'Residence History',
        description: 'Evidence of continuous residence in the UK',
        acceptedDocTypes: ['utility-bill', 'bank-statement', 'p60'],
        required: true,
        validationRules: [
          {
            id: 'residence-continuity',
            type: 'continuity',
            params: { maxAbsenceDays: 180 },
            errorMessage: 'Absences must not exceed 180 days in any 12-month period',
          },
        ],
      },
      {
        id: 'all-brps',
        name: 'Previous BRPs',
        description: 'All BRPs held during qualifying period',
        acceptedDocTypes: ['brp'],
        required: true,
      },
    ],
  },
  {
    id: 'employment',
    name: 'Employment History',
    category: 'sponsorship',
    priority: 'required',
    slots: [
      {
        id: 'employment-evidence',
        name: 'Employment Evidence',
        description: 'Letters from employers during qualifying period',
        acceptedDocTypes: ['employer-letter'],
        required: true,
      },
      {
        id: 'p60-history',
        name: 'P60s',
        description: 'P60s for each tax year in qualifying period',
        acceptedDocTypes: ['p60'],
        required: true,
      },
    ],
  },
  {
    id: 'life-in-uk',
    name: 'Life in the UK Test',
    category: 'english',
    priority: 'required',
    slots: [
      {
        id: 'lituk',
        name: 'Life in the UK Certificate',
        description: 'Certificate confirming passing the Life in the UK test',
        acceptedDocTypes: ['lituk-certificate'],
        required: true,
      },
    ],
  },
  {
    id: 'english-b1',
    name: 'English Language (B1)',
    category: 'english',
    priority: 'required',
    slots: [
      {
        id: 'selt-b1',
        name: 'SELT Certificate (B1)',
        description: 'SELT at B1 level or above',
        acceptedDocTypes: ['selt-certificate'],
        required: true,
      },
    ],
  },
];

// =============================================================================
// Export All Visa Routes
// =============================================================================

export const VISA_ROUTES: VisaRoute[] = [
  {
    id: 'skilled-worker',
    code: 'SW',
    name: 'Skilled Worker',
    description: 'For workers with a job offer from a UK employer with a sponsor licence',
    category: 'work',
    triageQuestions: SKILLED_WORKER_TRIAGE,
    moduleTemplates: SKILLED_WORKER_MODULES,
  },
  {
    id: 'global-talent',
    code: 'GT',
    name: 'Global Talent',
    description: 'For leaders or potential leaders in academia, arts, or digital technology',
    category: 'work',
    triageQuestions: GLOBAL_TALENT_TRIAGE,
    moduleTemplates: GLOBAL_TALENT_MODULES,
  },
  {
    id: 'family',
    code: 'FM',
    name: 'Spouse/Partner (Appendix FM)',
    description: 'For partners and spouses of British citizens or settled persons',
    category: 'family',
    triageQuestions: FAMILY_VISA_TRIAGE,
    moduleTemplates: FAMILY_VISA_MODULES,
  },
  {
    id: 'student',
    code: 'ST',
    name: 'Student',
    description: 'For students accepted onto a course at a licensed sponsor',
    category: 'study',
    triageQuestions: STUDENT_VISA_TRIAGE,
    moduleTemplates: STUDENT_VISA_MODULES,
  },
  {
    id: 'ilr',
    code: 'ILR',
    name: 'Indefinite Leave to Remain',
    description: 'For settlement applications after qualifying period',
    category: 'settlement',
    triageQuestions: ILR_TRIAGE,
    moduleTemplates: ILR_MODULES,
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

export function getVisaRouteById(id: string): VisaRoute | undefined {
  return VISA_ROUTES.find((route) => route.id === id);
}

export function getVisaRoutesByCategory(category: VisaRoute['category']): VisaRoute[] {
  return VISA_ROUTES.filter((route) => route.category === category);
}

export function searchVisaRoutes(query: string): VisaRoute[] {
  const lowerQuery = query.toLowerCase();
  return VISA_ROUTES.filter(
    (route) =>
      route.name.toLowerCase().includes(lowerQuery) ||
      route.description.toLowerCase().includes(lowerQuery) ||
      route.code.toLowerCase().includes(lowerQuery)
  );
}
