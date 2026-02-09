/**
 * Document Path Parser
 *
 * Parses folder paths to extract entity attribution and document type,
 * generating standardized document names following the convention:
 * {who}_{documentType}_{date}
 */

export type EntityType = 'applicant' | 'sponsor' | 'dependant' | 'shared' | 'unknown';

export interface ParsedDocument {
  who: EntityType;
  documentType: string;
  date?: string; // MMYY format
  generatedName: string;
  relativePath: string;
  originalFilename: string;
}

// Entity detection keywords mapped to entity types
const ENTITY_KEYWORDS: Record<string, EntityType> = {
  // Applicant keywords
  'applicant': 'applicant',
  'main': 'applicant',
  'primary': 'applicant',
  'principal': 'applicant',

  // Sponsor keywords
  'sponsor': 'sponsor',
  'partner': 'sponsor',
  'spouse': 'sponsor',

  // Dependant keywords
  'dependant': 'dependant',
  'dependent': 'dependant',
  'child': 'dependant',
  'minor': 'dependant',

  // Shared keywords
  'shared': 'shared',
  'common': 'shared',
  'joint': 'shared',
};

// Document type detection patterns
const DOCUMENT_TYPE_PATTERNS: Array<{ keywords: string[]; type: string; hasDate: boolean }> = [
  // Identity documents (no date)
  { keywords: ['passport'], type: 'passport', hasDate: false },
  { keywords: ['national_id', 'national-id', 'nationalid', 'id_card', 'id-card'], type: 'nationalId', hasDate: false },
  { keywords: ['birth_certificate', 'birth-certificate', 'birthcertificate', 'birth'], type: 'birthCertificate', hasDate: false },

  // Financial documents (with date)
  { keywords: ['bank_statement', 'bank-statement', 'bankstatement', 'bank'], type: 'bankStatement', hasDate: true },
  { keywords: ['payslip', 'pay_slip', 'pay-slip', 'salary'], type: 'payslip', hasDate: true },
  { keywords: ['tax_return', 'tax-return', 'taxreturn', 'tax', 'hmrc'], type: 'taxReturn', hasDate: true },

  // Employment documents (no date typically)
  { keywords: ['employment_letter', 'employment-letter', 'employmentletter'], type: 'employmentLetter', hasDate: false },
  { keywords: ['employment_contract', 'employment-contract', 'employmentcontract', 'contract'], type: 'employmentContract', hasDate: false },

  // Education documents (no date)
  { keywords: ['degree', 'diploma', 'certificate'], type: 'educationCertificate', hasDate: false },
  { keywords: ['transcript'], type: 'transcript', hasDate: false },
  { keywords: ['school_enrollment', 'school-enrollment', 'enrollment'], type: 'schoolEnrollment', hasDate: false },

  // Relationship documents (no date)
  { keywords: ['marriage_certificate', 'marriage-certificate', 'marriagecertificate', 'marriage', 'wedding'], type: 'marriageCertificate', hasDate: false },
  { keywords: ['cohabitation', 'relationship'], type: 'proofOfCohabitation', hasDate: false },

  // Accommodation documents (no date typically)
  { keywords: ['property_title', 'property-title', 'propertytitle', 'property', 'deed'], type: 'propertyTitle', hasDate: false },
  { keywords: ['accommodation', 'lease', 'tenancy'], type: 'proofOfAccommodation', hasDate: false },

  // Utility documents (with date)
  { keywords: ['utility', 'electric', 'electricity', 'gas', 'water', 'bill'], type: 'utilityBill', hasDate: true },

  // Travel documents (no date)
  { keywords: ['visa', 'permit', 'previous_visa', 'previous-visa'], type: 'visa', hasDate: false },

  // Insurance (no date typically)
  { keywords: ['insurance', 'health_insurance', 'health-insurance'], type: 'insurance', hasDate: false },

  // Consent/Letters (no date)
  { keywords: ['consent', 'letter_of_consent', 'letter-of-consent'], type: 'letterOfConsent', hasDate: false },
];

// Month name to number mapping
const MONTH_MAP: Record<string, string> = {
  'january': '01', 'jan': '01',
  'february': '02', 'feb': '02',
  'march': '03', 'mar': '03',
  'april': '04', 'apr': '04',
  'may': '05',
  'june': '06', 'jun': '06',
  'july': '07', 'jul': '07',
  'august': '08', 'aug': '08',
  'september': '09', 'sep': '09', 'sept': '09',
  'october': '10', 'oct': '10',
  'november': '11', 'nov': '11',
  'december': '12', 'dec': '12',
};

/**
 * Detect entity type from path segments
 */
function detectEntity(pathSegments: string[]): EntityType {
  for (const segment of pathSegments) {
    const lowerSegment = segment.toLowerCase();

    // Check each keyword
    for (const [keyword, entityType] of Object.entries(ENTITY_KEYWORDS)) {
      if (lowerSegment.includes(keyword)) {
        return entityType;
      }
    }
  }

  return 'unknown';
}

/**
 * Detect document type from path and filename
 */
function detectDocumentType(pathSegments: string[], filename: string): { type: string; hasDate: boolean } {
  const searchText = [...pathSegments, filename].join(' ').toLowerCase();

  for (const pattern of DOCUMENT_TYPE_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return { type: pattern.type, hasDate: pattern.hasDate };
      }
    }
  }

  // Default to generic document
  return { type: 'document', hasDate: false };
}

/**
 * Extract date from path and filename
 * Returns date in MMYY format
 */
function extractDate(pathSegments: string[], filename: string): string | undefined {
  const searchParts = [...pathSegments, filename];

  let month: string | undefined;
  let year: string | undefined;

  for (const part of searchParts) {
    const lowerPart = part.toLowerCase();

    // Try to find month name
    for (const [monthName, monthNum] of Object.entries(MONTH_MAP)) {
      if (lowerPart.includes(monthName)) {
        month = monthNum;
        break;
      }
    }

    // Try to find year (2020-2030 range)
    const yearMatch = part.match(/20(2[0-9]|30)/);
    if (yearMatch) {
      year = yearMatch[1]; // Get just the YY part
    }

    // Try date patterns like "Jan2024" or "2024-01"
    const datePattern1 = part.match(/([a-zA-Z]{3,9})[\s_-]?(20\d{2})/i);
    if (datePattern1) {
      const monthName = datePattern1[1].toLowerCase();
      if (MONTH_MAP[monthName]) {
        month = MONTH_MAP[monthName];
        year = datePattern1[2].slice(2);
      }
    }

    const datePattern2 = part.match(/(20\d{2})[\s_-]?(\d{2})/);
    if (datePattern2) {
      year = datePattern2[1].slice(2);
      month = datePattern2[2];
    }
  }

  // If we have both month and year, return MMYY format
  if (month && year) {
    return `${month}${year}`;
  }

  // If we only have year, return just YY
  if (year) {
    return year;
  }

  return undefined;
}

/**
 * Parse a document path and generate standardized name
 */
export function parseDocumentPath(relativePath: string, filename: string): ParsedDocument {
  // Split path into segments, filtering empty strings
  const pathSegments = relativePath.split(/[/\\]/).filter(Boolean);

  // Detect entity type
  const who = detectEntity(pathSegments);

  // Detect document type
  const { type: documentType, hasDate } = detectDocumentType(pathSegments, filename);

  // Extract date if applicable
  const date = hasDate ? extractDate(pathSegments, filename) : undefined;

  // Generate standardized name
  let generatedName = `${who}_${documentType}`;
  if (date) {
    generatedName += `_${date}`;
  }

  return {
    who,
    documentType,
    date,
    generatedName,
    relativePath,
    originalFilename: filename,
  };
}
