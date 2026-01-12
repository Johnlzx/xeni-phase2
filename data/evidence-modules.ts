import type {
  EvidenceModule,
  EvidenceSlotInstance,
  ExtractedField,
  Issue,
  SchemaDefinition,
  SchemaField,
} from '@/types/command-center';
import { getVisaRouteById } from './visa-routes';

// =============================================================================
// Schema Definitions (for Verification Workbench)
// =============================================================================

export const SCHEMA_DEFINITIONS: Record<string, SchemaDefinition> = {
  passport: {
    id: 'passport',
    name: 'Passport Information',
    category: 'identity',
    allowCustomFields: false,
    fields: [
      { id: 'surname', label: 'Surname', labelZh: '姓', dataType: 'string', required: true },
      { id: 'given-names', label: 'Given Names', labelZh: '名', dataType: 'string', required: true },
      { id: 'nationality', label: 'Nationality', labelZh: '国籍', dataType: 'string', required: true },
      { id: 'date-of-birth', label: 'Date of Birth', labelZh: '出生日期', dataType: 'date', required: true },
      { id: 'sex', label: 'Sex', labelZh: '性别', dataType: 'select', required: true, options: [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }] },
      { id: 'place-of-birth', label: 'Place of Birth', labelZh: '出生地', dataType: 'string', required: false },
      { id: 'passport-number', label: 'Passport Number', labelZh: '护照号码', dataType: 'string', required: true },
      { id: 'date-of-issue', label: 'Date of Issue', labelZh: '签发日期', dataType: 'date', required: true },
      { id: 'date-of-expiry', label: 'Date of Expiry', labelZh: '有效期至', dataType: 'date', required: true },
      { id: 'issuing-authority', label: 'Issuing Authority', labelZh: '签发机关', dataType: 'string', required: false },
    ],
  },
  'bank-statement': {
    id: 'bank-statement',
    name: 'Bank Statement',
    category: 'financial',
    allowCustomFields: true,
    fields: [
      { id: 'bank-name', label: 'Bank Name', labelZh: '银行名称', dataType: 'string', required: true },
      { id: 'account-holder', label: 'Account Holder', labelZh: '账户持有人', dataType: 'string', required: true },
      { id: 'account-number', label: 'Account Number', labelZh: '账号', dataType: 'string', required: true },
      { id: 'sort-code', label: 'Sort Code', labelZh: '银行代码', dataType: 'string', required: false },
      { id: 'statement-period-start', label: 'Statement Period Start', labelZh: '账单周期开始', dataType: 'date', required: true },
      { id: 'statement-period-end', label: 'Statement Period End', labelZh: '账单周期结束', dataType: 'date', required: true },
      { id: 'opening-balance', label: 'Opening Balance', labelZh: '期初余额', dataType: 'currency', required: true },
      { id: 'closing-balance', label: 'Closing Balance', labelZh: '期末余额', dataType: 'currency', required: true },
      { id: 'currency', label: 'Currency', labelZh: '货币', dataType: 'string', required: true },
      { id: 'lowest-balance', label: 'Lowest Balance in Period', labelZh: '最低余额', dataType: 'currency', required: true },
      { id: 'consecutive-days-held', label: 'Consecutive Days Held', labelZh: '连续持有天数', dataType: 'number', required: true },
    ],
  },
  cos: {
    id: 'cos',
    name: 'Certificate of Sponsorship',
    category: 'sponsorship',
    allowCustomFields: false,
    fields: [
      { id: 'cos-number', label: 'CoS Reference Number', labelZh: 'CoS 参考号', dataType: 'string', required: true },
      { id: 'sponsor-name', label: 'Sponsor Name', labelZh: '担保雇主名称', dataType: 'string', required: true },
      { id: 'sponsor-licence', label: 'Sponsor Licence Number', labelZh: '担保执照号', dataType: 'string', required: true },
      { id: 'job-title', label: 'Job Title', labelZh: '职位名称', dataType: 'string', required: true },
      { id: 'soc-code', label: 'SOC Code', labelZh: 'SOC 代码', dataType: 'string', required: true },
      { id: 'annual-salary', label: 'Annual Salary', labelZh: '年薪', dataType: 'currency', required: true },
      { id: 'hours-per-week', label: 'Hours per Week', labelZh: '每周工时', dataType: 'number', required: true },
      { id: 'start-date', label: 'Employment Start Date', labelZh: '开始日期', dataType: 'date', required: true },
      { id: 'end-date', label: 'Employment End Date', labelZh: '结束日期', dataType: 'date', required: false },
      { id: 'cos-assigned-date', label: 'CoS Assigned Date', labelZh: 'CoS 签发日期', dataType: 'date', required: true },
    ],
  },
  selt: {
    id: 'selt',
    name: 'English Language Certificate',
    category: 'english',
    allowCustomFields: false,
    fields: [
      { id: 'test-type', label: 'Test Type', labelZh: '考试类型', dataType: 'string', required: true },
      { id: 'test-centre', label: 'Test Centre', labelZh: '考试中心', dataType: 'string', required: true },
      { id: 'test-date', label: 'Test Date', labelZh: '考试日期', dataType: 'date', required: true },
      { id: 'reference-number', label: 'Certificate Reference', labelZh: '证书编号', dataType: 'string', required: true },
      { id: 'speaking', label: 'Speaking Score', labelZh: '口语分数', dataType: 'string', required: true },
      { id: 'listening', label: 'Listening Score', labelZh: '听力分数', dataType: 'string', required: true },
      { id: 'reading', label: 'Reading Score', labelZh: '阅读分数', dataType: 'string', required: false },
      { id: 'writing', label: 'Writing Score', labelZh: '写作分数', dataType: 'string', required: false },
      { id: 'overall-cefr', label: 'Overall CEFR Level', labelZh: '总体 CEFR 等级', dataType: 'string', required: true },
    ],
  },
  'employer-letter': {
    id: 'employer-letter',
    name: 'Employer Letter',
    category: 'sponsorship',
    allowCustomFields: true,
    fields: [
      { id: 'employer-name', label: 'Employer Name', labelZh: '雇主名称', dataType: 'string', required: true },
      { id: 'employee-name', label: 'Employee Name', labelZh: '员工姓名', dataType: 'string', required: true },
      { id: 'job-title', label: 'Job Title', labelZh: '职位', dataType: 'string', required: true },
      { id: 'employment-start', label: 'Employment Start Date', labelZh: '入职日期', dataType: 'date', required: true },
      { id: 'current-salary', label: 'Current Annual Salary', labelZh: '当前年薪', dataType: 'currency', required: true },
      { id: 'letter-date', label: 'Letter Date', labelZh: '信函日期', dataType: 'date', required: true },
      { id: 'signatory-name', label: 'Signatory Name', labelZh: '签署人姓名', dataType: 'string', required: true },
      { id: 'signatory-position', label: 'Signatory Position', labelZh: '签署人职位', dataType: 'string', required: true },
    ],
  },
};

// =============================================================================
// Mock Extracted Fields (for demo purposes)
// =============================================================================

const MOCK_PASSPORT_FIELDS: ExtractedField[] = [
  {
    id: 'f-passport-1',
    schemaId: 'surname',
    label: 'Surname',
    value: 'BROWN',
    displayValue: 'BROWN',
    dataType: 'string',
    confidence: 0.98,
    source: {
      documentId: 'doc-passport-1',
      documentName: 'Passport_BobBrown.pdf',
      pageNumber: 1,
      boundingBox: { x: 35, y: 22, width: 25, height: 4 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T10:30:00Z',
  },
  {
    id: 'f-passport-2',
    schemaId: 'given-names',
    label: 'Given Names',
    value: 'BOB',
    displayValue: 'BOB',
    dataType: 'string',
    confidence: 0.97,
    source: {
      documentId: 'doc-passport-1',
      documentName: 'Passport_BobBrown.pdf',
      pageNumber: 1,
      boundingBox: { x: 35, y: 28, width: 20, height: 4 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T10:30:00Z',
  },
  {
    id: 'f-passport-3',
    schemaId: 'passport-number',
    label: 'Passport Number',
    value: 'AT38249065',
    displayValue: 'AT38249065',
    dataType: 'string',
    confidence: 0.99,
    source: {
      documentId: 'doc-passport-1',
      documentName: 'Passport_BobBrown.pdf',
      pageNumber: 1,
      boundingBox: { x: 35, y: 45, width: 30, height: 4 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T10:31:00Z',
  },
  {
    id: 'f-passport-4',
    schemaId: 'date-of-expiry',
    label: 'Date of Expiry',
    value: '2026-01-23',
    displayValue: '23 Jan 2026',
    dataType: 'date',
    confidence: 0.95,
    source: {
      documentId: 'doc-passport-1',
      documentName: 'Passport_BobBrown.pdf',
      pageNumber: 1,
      boundingBox: { x: 35, y: 55, width: 25, height: 4 },
    },
    isVerified: false,
  },
];

const MOCK_BANK_STATEMENT_FIELDS: ExtractedField[] = [
  {
    id: 'f-bank-1',
    schemaId: 'bank-name',
    label: 'Bank Name',
    value: 'HSBC UK',
    displayValue: 'HSBC UK',
    dataType: 'string',
    confidence: 0.99,
    source: {
      documentId: 'doc-bank-1',
      documentName: 'BankStatement_Dec2024.pdf',
      pageNumber: 1,
      boundingBox: { x: 10, y: 5, width: 30, height: 5 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T11:00:00Z',
  },
  {
    id: 'f-bank-2',
    schemaId: 'closing-balance',
    label: 'Closing Balance',
    value: 15420.50,
    displayValue: '£15,420.50',
    dataType: 'currency',
    confidence: 0.96,
    source: {
      documentId: 'doc-bank-1',
      documentName: 'BankStatement_Dec2024.pdf',
      pageNumber: 3,
      boundingBox: { x: 65, y: 85, width: 20, height: 4 },
    },
    isVerified: false,
  },
  {
    id: 'f-bank-3',
    schemaId: 'lowest-balance',
    label: 'Lowest Balance in Period',
    value: 1180.00,
    displayValue: '£1,180.00',
    dataType: 'currency',
    confidence: 0.85,
    source: {
      documentId: 'doc-bank-1',
      documentName: 'BankStatement_Dec2024.pdf',
      pageNumber: 2,
      boundingBox: { x: 65, y: 42, width: 20, height: 4 },
    },
    isVerified: false,
  },
  {
    id: 'f-bank-4',
    schemaId: 'consecutive-days-held',
    label: 'Consecutive Days Held',
    value: 22,
    displayValue: '22 days',
    dataType: 'number',
    confidence: 0.78,
    source: {
      documentId: 'doc-bank-1',
      documentName: 'BankStatement_Dec2024.pdf',
      pageNumber: 2,
      boundingBox: { x: 10, y: 20, width: 80, height: 60 },
    },
    isVerified: false,
  },
];

const MOCK_COS_FIELDS: ExtractedField[] = [
  {
    id: 'f-cos-1',
    schemaId: 'cos-number',
    label: 'CoS Reference Number',
    value: 'ABC123456789',
    displayValue: 'ABC123456789',
    dataType: 'string',
    confidence: 0.99,
    source: {
      documentId: 'doc-cos-1',
      documentName: 'CoS_Confirmation.pdf',
      pageNumber: 1,
      boundingBox: { x: 45, y: 15, width: 35, height: 4 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T12:00:00Z',
  },
  {
    id: 'f-cos-2',
    schemaId: 'job-title',
    label: 'Job Title',
    value: 'Senior Software Engineer',
    displayValue: 'Senior Software Engineer',
    dataType: 'string',
    confidence: 0.97,
    source: {
      documentId: 'doc-cos-1',
      documentName: 'CoS_Confirmation.pdf',
      pageNumber: 1,
      boundingBox: { x: 45, y: 35, width: 40, height: 4 },
    },
    isVerified: false,
  },
  {
    id: 'f-cos-3',
    schemaId: 'annual-salary',
    label: 'Annual Salary',
    value: 65000,
    displayValue: '£65,000',
    dataType: 'currency',
    confidence: 0.98,
    source: {
      documentId: 'doc-cos-1',
      documentName: 'CoS_Confirmation.pdf',
      pageNumber: 1,
      boundingBox: { x: 45, y: 45, width: 20, height: 4 },
    },
    isVerified: true,
    verifiedBy: 'user-1',
    verifiedAt: '2025-01-08T12:05:00Z',
  },
];

// =============================================================================
// Mock Issues
// =============================================================================

const MOCK_FINANCIAL_ISSUE: Issue = {
  id: 'issue-1',
  moduleId: 'financial',
  slotId: 'bank-statements',
  fieldId: 'f-bank-4',
  type: 'threshold-not-met',
  severity: 'critical',
  title: '28-day rule not met',
  description: 'Funds have only been held for 22 consecutive days. UKVI requires funds to be held for at least 28 consecutive days before the application date.',
  suggestion: 'Request additional bank statements covering the full 28-day period, or wait until the funds have been held for 28 days before applying.',
  relatedDocumentIds: ['doc-bank-1'],
  createdAt: '2025-01-08T11:30:00Z',
};

const MOCK_PASSPORT_EXPIRY_WARNING: Issue = {
  id: 'issue-2',
  moduleId: 'identity-status',
  slotId: 'passport',
  fieldId: 'f-passport-4',
  type: 'document-expired',
  severity: 'warning',
  title: 'Passport expiry within 6 months',
  description: 'The passport will expire on 23 Jan 2026, which is less than 6 months from the intended application date.',
  suggestion: 'Consider renewing the passport before applying, or ensure the application is submitted well before the expiry date.',
  relatedDocumentIds: ['doc-passport-1'],
  createdAt: '2025-01-08T10:35:00Z',
};

const MOCK_TRAVEL_GAP_WARNING: Issue = {
  id: 'issue-3',
  moduleId: 'identity-status',
  slotId: 'travel-history',
  type: 'gap-detected',
  severity: 'warning',
  title: 'Travel history gap detected',
  description: 'There is a 3-month gap in travel history from March to June 2022. UKVI may ask for an explanation.',
  suggestion: 'Prepare a letter explaining the gap (e.g., stayed in home country, did not travel).',
  relatedDocumentIds: [],
  createdAt: '2025-01-08T10:40:00Z',
};

// =============================================================================
// Generate Evidence Modules from Visa Route
// =============================================================================

export function generateModulesFromRoute(
  visaRouteId: string,
  triageAnswers: Record<string, unknown>
): EvidenceModule[] {
  const route = getVisaRouteById(visaRouteId);
  if (!route) return [];

  return route.moduleTemplates
    .filter((template) => {
      // Check conditional display
      if (template.conditionalOn) {
        const answer = triageAnswers[template.conditionalOn.questionId];
        return answer === template.conditionalOn.value;
      }
      return true;
    })
    .map((template, index) => ({
      id: template.id,
      name: template.name,
      description: `Evidence required for ${template.name}`,
      category: template.category,
      status: 'empty' as const,
      priority: template.priority,
      slots: template.slots.map((slotTemplate) => ({
        templateId: slotTemplate.id,
        name: slotTemplate.name,
        documentIds: [],
        linkedDocuments: [],
        extractedFields: [],
        status: 'empty' as const,
        issues: [],
      })),
      issues: [],
      progress: {
        completed: 0,
        total: template.slots.filter((s) => s.required).length,
      },
      order: index,
    }));
}

// =============================================================================
// Mock Evidence Modules (Skilled Worker with pre-filled data)
// =============================================================================

export const MOCK_SKILLED_WORKER_MODULES: EvidenceModule[] = [
  {
    id: 'identity-status',
    name: 'Identity & Immigration Status',
    description: 'Passport, BRP, and travel history documentation',
    category: 'identity',
    status: 'review-needed',
    priority: 'required',
    slots: [
      {
        templateId: 'passport',
        name: 'Passport Information',
        documentIds: ['doc-passport-1'],
        linkedDocuments: [{ id: 'doc-passport-1', name: 'UK_Passport_John_Smith.pdf', pages: 2 }],
        extractedFields: MOCK_PASSPORT_FIELDS,
        status: 'filled',
        issues: [],
      },
      {
        templateId: 'brp',
        name: 'Biometric Residence Permit',
        documentIds: ['doc-brp-1'],
        linkedDocuments: [{ id: 'doc-brp-1', name: 'BRP_Card_Front_Back.pdf', pages: 1 }],
        extractedFields: [],
        status: 'filled',
        issues: [],
      },
      {
        templateId: 'travel-history',
        name: 'Travel History',
        documentIds: [],
        linkedDocuments: [],
        extractedFields: [],
        status: 'empty',
        issues: [],
      },
    ],
    issues: [MOCK_PASSPORT_EXPIRY_WARNING, MOCK_TRAVEL_GAP_WARNING],
    progress: { completed: 2, total: 3 },
    order: 0,
  },
  {
    id: 'sponsorship',
    name: 'Sponsorship Details',
    description: 'Certificate of Sponsorship and job offer documentation',
    category: 'sponsorship',
    status: 'ready',
    priority: 'required',
    slots: [
      {
        templateId: 'cos',
        name: 'Certificate of Sponsorship',
        documentIds: ['doc-cos-1'],
        linkedDocuments: [{ id: 'doc-cos-1', name: 'CoS_Reference_ABC123.pdf', pages: 3 }],
        extractedFields: MOCK_COS_FIELDS,
        status: 'verified',
        issues: [],
      },
      {
        templateId: 'job-offer',
        name: 'Job Offer Letter',
        documentIds: ['doc-offer-1'],
        linkedDocuments: [{ id: 'doc-offer-1', name: 'Job_Offer_TechCorp.pdf', pages: 2 }],
        extractedFields: [],
        status: 'filled',
        issues: [],
      },
    ],
    issues: [],
    progress: { completed: 2, total: 2 },
    order: 1,
  },
  {
    id: 'financial',
    name: 'Financial Requirement',
    description: 'Bank statements demonstrating maintenance funds',
    category: 'financial',
    status: 'critical-issue',
    priority: 'required',
    slots: [
      {
        templateId: 'bank-statements',
        name: 'Bank Statements',
        documentIds: ['doc-bank-1'],
        linkedDocuments: [{ id: 'doc-bank-1', name: 'HSBC_Statements_Aug_Sep.pdf', pages: 6 }],
        extractedFields: MOCK_BANK_STATEMENT_FIELDS,
        status: 'filled',
        issues: [MOCK_FINANCIAL_ISSUE],
      },
    ],
    issues: [MOCK_FINANCIAL_ISSUE],
    progress: { completed: 0, total: 1 },
    order: 2,
  },
  {
    id: 'english-language',
    name: 'English Language',
    description: 'SELT certificate or degree taught in English',
    category: 'english',
    status: 'in-progress',
    priority: 'required',
    slots: [
      {
        templateId: 'selt',
        name: 'SELT Certificate',
        documentIds: [],
        linkedDocuments: [],
        extractedFields: [],
        status: 'empty',
        issues: [],
      },
      {
        templateId: 'degree',
        name: 'Degree Certificate',
        documentIds: ['doc-degree-1'],
        linkedDocuments: [{ id: 'doc-degree-1', name: 'BSc_Computer_Science_2019.pdf', pages: 1 }],
        extractedFields: [],
        status: 'filled',
        issues: [],
      },
    ],
    issues: [],
    progress: { completed: 1, total: 1 },
    order: 3,
  },
  {
    id: 'tb-test',
    name: 'Tuberculosis Test',
    description: 'TB test certificate from approved clinic',
    category: 'identity',
    status: 'empty',
    priority: 'required',
    slots: [
      {
        templateId: 'tb-certificate',
        name: 'TB Test Certificate',
        documentIds: [],
        linkedDocuments: [],
        extractedFields: [],
        status: 'empty',
        issues: [],
      },
    ],
    issues: [],
    progress: { completed: 0, total: 1 },
    order: 4,
  },
];

// =============================================================================
// Helper to get schema for a document type
// =============================================================================

export function getSchemaForDocType(docType: string): SchemaDefinition | undefined {
  return SCHEMA_DEFINITIONS[docType];
}

// =============================================================================
// Status calculation helpers
// =============================================================================

export function calculateModuleStatus(module: EvidenceModule): EvidenceModule['status'] {
  const criticalIssues = module.issues.filter(
    (i) => i.severity === 'critical' && !i.resolvedAt
  );
  if (criticalIssues.length > 0) return 'critical-issue';

  const warningIssues = module.issues.filter(
    (i) => i.severity === 'warning' && !i.resolvedAt
  );
  if (warningIssues.length > 0) return 'review-needed';

  const allSlotsFilled = module.slots.every((s) => s.status !== 'empty');
  if (!allSlotsFilled) {
    const hasAnyFilled = module.slots.some((s) => s.status !== 'empty');
    return hasAnyFilled ? 'in-progress' : 'empty';
  }

  const allFieldsVerified = module.slots.every((s) =>
    s.extractedFields.every((f) => f.isVerified)
  );
  return allFieldsVerified ? 'ready' : 'review-needed';
}

export function calculateProgress(module: EvidenceModule): { completed: number; total: number } {
  const route = getVisaRouteById('skilled-worker'); // Default
  if (!route) return { completed: 0, total: 0 };

  const template = route.moduleTemplates.find((t) => t.id === module.id);
  if (!template) return { completed: 0, total: module.slots.length };

  const requiredSlots = template.slots.filter((s) => s.required);
  const filledRequiredSlots = module.slots.filter((slot) => {
    const templateSlot = template.slots.find((t) => t.id === slot.templateId);
    return templateSlot?.required && slot.status !== 'empty';
  });

  return {
    completed: filledRequiredSlots.length,
    total: requiredSlots.length,
  };
}

// =============================================================================
// Document Group to Slot Mapping
// =============================================================================

// Maps document group tags to slot IDs
export const DOCUMENT_TAG_TO_SLOT_MAP: Record<string, string[]> = {
  'Passport': ['passport'],
  'Bank Statement': ['bank-statements', 'bank-statements-6m'],
  'Utility Bill': ['cohabitation', 'tenancy', 'council-tax', 'residence-history'],
  'Employment Letter': ['employer-letter', 'employment-evidence'],
  'Certificate of Sponsorship': ['cos'],
  'Job Offer': ['job-offer'],
  'Contract': ['contract'],
  'Degree Certificate': ['degree', 'qualifications'],
  'SELT Certificate': ['selt', 'selt-a1', 'selt-b1', 'selt-b2'],
  'TB Certificate': ['tb-certificate'],
  'Marriage Certificate': ['marriage-cert'],
  'BRP': ['brp', 'all-brps'],
  'P60': ['p60', 'p60-history'],
  'Payslips': ['payslips'],
};

// Generate mock extracted fields based on document type
export function generateMockExtractedFields(
  documentId: string,
  documentName: string,
  documentTag: string
): ExtractedField[] {
  const timestamp = Date.now();

  switch (documentTag) {
    case 'Passport':
      return [
        {
          id: `f-${timestamp}-1`,
          schemaId: 'surname',
          label: 'Surname',
          value: 'BROWN',
          displayValue: 'BROWN',
          dataType: 'string',
          confidence: 0.98,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 35, y: 22, width: 25, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-2`,
          schemaId: 'given-names',
          label: 'Given Names',
          value: 'BOB',
          displayValue: 'BOB',
          dataType: 'string',
          confidence: 0.97,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 35, y: 28, width: 20, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-3`,
          schemaId: 'passport-number',
          label: 'Passport Number',
          value: 'AT38249065',
          displayValue: 'AT38249065',
          dataType: 'string',
          confidence: 0.99,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 35, y: 45, width: 30, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-4`,
          schemaId: 'date-of-expiry',
          label: 'Date of Expiry',
          value: '2027-06-15',
          displayValue: '15 Jun 2027',
          dataType: 'date',
          confidence: 0.95,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 35, y: 55, width: 25, height: 4 } },
          isVerified: false,
        },
      ];

    case 'Bank Statement':
      return [
        {
          id: `f-${timestamp}-1`,
          schemaId: 'bank-name',
          label: 'Bank Name',
          value: 'HSBC UK',
          displayValue: 'HSBC UK',
          dataType: 'string',
          confidence: 0.99,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 10, y: 5, width: 30, height: 5 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-2`,
          schemaId: 'account-holder',
          label: 'Account Holder',
          value: 'BOB BROWN',
          displayValue: 'BOB BROWN',
          dataType: 'string',
          confidence: 0.98,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 10, y: 15, width: 40, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-3`,
          schemaId: 'closing-balance',
          label: 'Closing Balance',
          value: 15420.50,
          displayValue: '£15,420.50',
          dataType: 'currency',
          confidence: 0.96,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 65, y: 85, width: 20, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-4`,
          schemaId: 'statement-period-end',
          label: 'Statement Period End',
          value: '2025-01-01',
          displayValue: '01 Jan 2025',
          dataType: 'date',
          confidence: 0.94,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 60, y: 10, width: 25, height: 4 } },
          isVerified: false,
        },
      ];

    case 'Utility Bill':
      return [
        {
          id: `f-${timestamp}-1`,
          schemaId: 'provider',
          label: 'Provider',
          value: 'British Gas',
          displayValue: 'British Gas',
          dataType: 'string',
          confidence: 0.99,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 10, y: 5, width: 30, height: 5 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-2`,
          schemaId: 'account-name',
          label: 'Account Name',
          value: 'BOB BROWN',
          displayValue: 'BOB BROWN',
          dataType: 'string',
          confidence: 0.97,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 10, y: 20, width: 40, height: 4 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-3`,
          schemaId: 'address',
          label: 'Service Address',
          value: '123 High Street, London, W1 1AA',
          displayValue: '123 High Street, London, W1 1AA',
          dataType: 'string',
          confidence: 0.95,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 10, y: 30, width: 60, height: 8 } },
          isVerified: false,
        },
        {
          id: `f-${timestamp}-4`,
          schemaId: 'bill-date',
          label: 'Bill Date',
          value: '2025-01-05',
          displayValue: '05 Jan 2025',
          dataType: 'date',
          confidence: 0.98,
          source: { documentId, documentName, pageNumber: 1, boundingBox: { x: 70, y: 5, width: 20, height: 4 } },
          isVerified: false,
        },
      ];

    default:
      return [];
  }
}

// Interface for document group from DocumentsPanel
export interface DocumentGroup {
  id: string;
  title: string;
  tag: string;
  files: Array<{
    id: string;
    name: string;
    pages?: number;
  }>;
}

// Link document groups to evidence modules
export function linkDocumentsToModules(
  modules: EvidenceModule[],
  documentGroups: DocumentGroup[]
): EvidenceModule[] {
  return modules.map((module) => {
    const updatedSlots = module.slots.map((slot) => {
      // Find matching document groups for this slot
      const matchingGroups = documentGroups.filter((group) => {
        const slotIds = DOCUMENT_TAG_TO_SLOT_MAP[group.tag] || [];
        return slotIds.includes(slot.templateId);
      });

      if (matchingGroups.length === 0) {
        return slot;
      }

      // Collect all document IDs, linked documents, and generate extracted fields
      const documentIds: string[] = [];
      const linkedDocuments: { id: string; name: string; pages: number }[] = [];
      const extractedFields: ExtractedField[] = [];

      matchingGroups.forEach((group) => {
        group.files.forEach((file) => {
          documentIds.push(file.id);
          linkedDocuments.push({
            id: file.id,
            name: file.name,
            pages: file.pages || 1,
          });
          const fields = generateMockExtractedFields(file.id, file.name, group.tag);
          extractedFields.push(...fields);
        });
      });

      return {
        ...slot,
        documentIds,
        linkedDocuments,
        extractedFields,
        status: extractedFields.length > 0 ? 'filled' as const : slot.status,
      };
    });

    // Calculate new progress
    const filledSlots = updatedSlots.filter((s) => s.status !== 'empty').length;
    const totalRequired = updatedSlots.length;

    // Determine module status
    const hasDocuments = updatedSlots.some((s) => s.documentIds.length > 0);
    let newStatus = module.status;
    if (hasDocuments) {
      const allFilled = updatedSlots.every((s) => s.status !== 'empty');
      newStatus = allFilled ? 'review-needed' : 'in-progress';
    }

    return {
      ...module,
      slots: updatedSlots,
      status: newStatus,
      progress: {
        completed: filledSlots,
        total: totalRequired,
      },
    };
  });
}
