import type {
  FormAccuracyVisaTypeId,
  TestPath,
  TestRunResult,
  FieldComparisonResult,
  VisaTypeAccuracyMetrics,
  FormAccuracyDashboardStats,
  PathAccuracyMetric,
  BatchTestRun,
  BatchPathResult,
  HeatmapDay,
} from "@/types/form-accuracy";

// =============================================================================
// HELPER: build field comparison results
// =============================================================================

function match(
  fieldId: string,
  fieldLabel: string,
  value: string,
  fieldType: FieldComparisonResult["fieldType"],
  formSection: string
): FieldComparisonResult {
  return { fieldId, fieldLabel, expectedValue: value, actualValue: value, fieldType, formSection, status: "match" };
}

function mismatch(
  fieldId: string,
  fieldLabel: string,
  expected: string,
  actual: string,
  fieldType: FieldComparisonResult["fieldType"],
  formSection: string,
  note?: string
): FieldComparisonResult {
  return { fieldId, fieldLabel, expectedValue: expected, actualValue: actual, fieldType, formSection, status: "mismatch", note };
}

function missing(
  fieldId: string,
  fieldLabel: string,
  expected: string,
  fieldType: FieldComparisonResult["fieldType"],
  formSection: string
): FieldComparisonResult {
  return { fieldId, fieldLabel, expectedValue: expected, actualValue: null, fieldType, formSection, status: "missing" };
}

// =============================================================================
// SKILLED WORKER — 3 PATHS
// =============================================================================

const SW_PATH_1_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "ZHANG WEI", "text", "Personal Details"),
  match("surname", "Surname", "ZHANG", "text", "Personal Details"),
  mismatch("dateOfBirth", "Date of birth", "1990-05-15", "15/05/1990", "date", "Personal Details", "Date format difference"),
  match("nationality", "Nationality", "Chinese", "select", "Personal Details"),
  match("passportNumber", "Passport number", "E12345678", "text", "Personal Details"),
  match("passportExpiry", "Passport expiry date", "2030-08-20", "date", "Personal Details"),
  match("sex", "Sex", "Male", "radio", "Personal Details"),
  match("placeOfBirth", "Place of birth", "Beijing", "text", "Personal Details"),
  match("email", "Email address", "zhangwei@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+447123456789", "tel", "Contact Details"),
  match("addressLine1", "Address line 1", "10 Downing Street", "text", "Contact Details"),
  match("city", "City", "London", "text", "Contact Details"),
  match("postcode", "Postcode", "SW1A 2AA", "text", "Contact Details"),
  match("applicationLocation", "Where are you applying from?", "Inside the UK", "radio", "Application Details"),
  match("cosNumber", "CoS reference number", "ABC1234567890", "text", "Sponsorship"),
  match("sponsorName", "Sponsor name", "TechCorp Ltd", "text", "Sponsorship"),
  match("sponsorLicence", "Sponsor licence number", "ABCD1234", "text", "Sponsorship"),
  match("jobTitle", "Job title", "Senior Software Engineer", "text", "Employment"),
  match("socCode", "SOC code", "2134", "text", "Employment"),
  mismatch("annualSalary", "Annual salary", "65000", "65,000", "text", "Employment", "Thousand separator added"),
  match("weeklyHours", "Hours per week", "37.5", "text", "Employment"),
  match("startDate", "Employment start date", "2024-01-15", "date", "Employment"),
  match("salaryType", "How is the salary paid?", "Annual", "radio", "Employment"),
  match("mainApplicant", "Are you the main applicant?", "Yes", "radio", "Application Details"),
  match("previousPermission", "Do you have current permission?", "Yes", "radio", "Immigration History"),
  match("brpNumber", "BRP number", "ZX1234567", "text", "Immigration History"),
  match("hasDependents", "Any dependents applying?", "No", "radio", "Dependents"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
];

const SW_PATH_2_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "LI NA", "text", "Personal Details"),
  match("surname", "Surname", "LI", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1988-11-22", "date", "Personal Details"),
  match("nationality", "Nationality", "Chinese", "select", "Personal Details"),
  match("passportNumber", "Passport number", "G98765432", "text", "Personal Details"),
  match("passportExpiry", "Passport expiry date", "2029-03-10", "date", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("placeOfBirth", "Place of birth", "Shanghai", "text", "Personal Details"),
  match("email", "Email address", "lina@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+8613800138000", "tel", "Contact Details"),
  mismatch("overseasAddress", "Overseas address", "Unit 5, 88 Nanjing Road, Shanghai", "Unit 5 88 Nanjing Road Shanghai", "text", "Contact Details", "Punctuation stripped"),
  match("applicationLocation", "Where are you applying from?", "Outside the UK", "radio", "Application Details"),
  match("countryOfApplication", "Country of application", "China", "select", "Application Details"),
  match("cosNumber", "CoS reference number", "DEF9876543210", "text", "Sponsorship"),
  match("sponsorName", "Sponsor name", "GlobalBank PLC", "text", "Sponsorship"),
  match("sponsorLicence", "Sponsor licence number", "EFGH5678", "text", "Sponsorship"),
  match("jobTitle", "Job title", "Financial Analyst", "text", "Employment"),
  match("socCode", "SOC code", "2422", "text", "Employment"),
  mismatch("annualSalary", "Annual salary", "55000", "£55,000", "text", "Employment", "Currency symbol and separator"),
  match("weeklyHours", "Hours per week", "40", "text", "Employment"),
  match("startDate", "Employment start date", "2024-06-01", "date", "Employment"),
  match("salaryType", "How is the salary paid?", "Annual", "radio", "Employment"),
  match("hasDependents", "Any dependents applying?", "Yes", "radio", "Dependents"),
  match("dependentCount", "Number of dependents", "2", "text", "Dependents"),
  match("dep1Name", "Dependent 1 full name", "LI MING", "text", "Dependents"),
  match("dep1Relationship", "Dependent 1 relationship", "Spouse", "select", "Dependents"),
  mismatch("dep1DateOfBirth", "Dependent 1 date of birth", "1990-03-08", "08/03/1990", "date", "Dependents", "Date format difference"),
  match("dep2Name", "Dependent 2 full name", "LI XIAO", "text", "Dependents"),
  match("dep2Relationship", "Dependent 2 relationship", "Child", "select", "Dependents"),
  match("dep2DateOfBirth", "Dependent 2 date of birth", "2018-07-12", "date", "Dependents"),
  match("tbTest", "TB test certificate?", "Yes", "radio", "Health"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("previousUKVisa", "Previous UK visa?", "Yes", "radio", "Immigration History"),
  missing("previousVisaRef", "Previous visa reference", "VIS/2020/123456", "text", "Immigration History"),
];

const SW_PATH_3_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "WANG JUN", "text", "Personal Details"),
  match("surname", "Surname", "WANG", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1995-02-28", "date", "Personal Details"),
  match("nationality", "Nationality", "Chinese", "select", "Personal Details"),
  match("passportNumber", "Passport number", "E55667788", "text", "Personal Details"),
  match("sex", "Sex", "Male", "radio", "Personal Details"),
  match("email", "Email address", "wangjun@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+447987654321", "tel", "Contact Details"),
  match("addressLine1", "Address line 1", "45 Oxford Street", "text", "Contact Details"),
  match("city", "City", "Manchester", "text", "Contact Details"),
  match("postcode", "Postcode", "M1 5AN", "text", "Contact Details"),
  match("applicationLocation", "Where are you applying from?", "Inside the UK", "radio", "Application Details"),
  match("cosNumber", "CoS reference number", "GHI4567890123", "text", "Sponsorship"),
  match("sponsorName", "Sponsor name", "HealthCare NHS Trust", "text", "Sponsorship"),
  match("jobTitle", "Job title", "Staff Nurse", "text", "Employment"),
  match("socCode", "SOC code", "2231", "text", "Employment"),
  mismatch("hourlyRate", "Hourly rate", "15.50", "£15.50", "text", "Employment", "Currency symbol added"),
  match("weeklyHours", "Hours per week", "37.5", "text", "Employment"),
  match("salaryType", "How is the salary paid?", "Hourly", "radio", "Employment"),
  match("startDate", "Employment start date", "2024-03-01", "date", "Employment"),
  match("hasDependents", "Any dependents applying?", "No", "radio", "Dependents"),
  match("previousPermission", "Do you have current permission?", "Yes", "radio", "Immigration History"),
  mismatch("brpNumber", "BRP number", "ZX9876543", "ZX 9876543", "text", "Immigration History", "Unexpected space"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("healthSurcharge", "IHS paid?", "Yes", "radio", "Payment"),
  missing("ihsReference", "IHS reference number", "IHS-2024-001234", "text", "Payment"),
];

// =============================================================================
// FAMILY / SPOUSE — 3 PATHS
// =============================================================================

const FM_PATH_1_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "MARIA GARCIA", "text", "Personal Details"),
  match("surname", "Surname", "GARCIA", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1992-07-14", "date", "Personal Details"),
  match("nationality", "Nationality", "Spanish", "select", "Personal Details"),
  match("passportNumber", "Passport number", "AAB123456", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("relationshipType", "Relationship to sponsor", "Spouse", "select", "Relationship"),
  match("marriageDate", "Date of marriage", "2022-06-15", "date", "Relationship"),
  match("marriageCountry", "Country of marriage", "Spain", "select", "Relationship"),
  match("sponsorName", "Sponsor full name", "JAMES SMITH", "text", "Sponsor Details"),
  match("sponsorDOB", "Sponsor date of birth", "1990-01-20", "date", "Sponsor Details"),
  match("sponsorNationality", "Sponsor nationality", "British", "select", "Sponsor Details"),
  match("sponsorStatus", "Sponsor immigration status", "British Citizen", "select", "Sponsor Details"),
  match("sponsorEmployer", "Sponsor employer", "Barclays PLC", "text", "Financial Evidence"),
  mismatch("sponsorIncome", "Sponsor annual income", "42000", "42,000.00", "text", "Financial Evidence", "Formatting difference"),
  match("incomeType", "Income type", "Employment", "select", "Financial Evidence"),
  match("meetsFinancialReq", "Meets £18,600 threshold?", "Yes", "radio", "Financial Evidence"),
  match("accommodationType", "Accommodation type", "Owned", "select", "Accommodation"),
  match("accommodationAddress", "Accommodation address", "22 Baker Street, London", "text", "Accommodation"),
  match("accommodationPostcode", "Accommodation postcode", "NW1 6XE", "text", "Accommodation"),
  match("englishQualification", "English language qualification", "IELTS", "select", "English Language"),
  match("englishLevel", "CEFR level achieved", "B1", "select", "English Language"),
  mismatch("testDate", "Test date", "2024-01-10", "10 January 2024", "date", "English Language", "Date format difference"),
  match("testReference", "Test reference", "24GB000123", "text", "English Language"),
  match("previousUKVisa", "Previous UK visa?", "No", "radio", "Immigration History"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("tbTest", "TB test certificate?", "Yes", "radio", "Health"),
  match("email", "Email address", "maria.garcia@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+447555123456", "tel", "Contact Details"),
  match("currentCountry", "Current country of residence", "Spain", "select", "Application Details"),
  match("applicationLocation", "Where are you applying from?", "Outside the UK", "radio", "Application Details"),
  match("vacCentre", "VAC location", "Madrid", "select", "Application Details"),
];

const FM_PATH_2_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "ANNA KOWALSKI", "text", "Personal Details"),
  match("surname", "Surname", "KOWALSKI", "text", "Personal Details"),
  mismatch("dateOfBirth", "Date of birth", "1994-12-03", "03/12/1994", "date", "Personal Details", "Date format difference"),
  match("nationality", "Nationality", "Polish", "select", "Personal Details"),
  match("passportNumber", "Passport number", "CF7654321", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("relationshipType", "Relationship to sponsor", "Unmarried partner", "select", "Relationship"),
  match("cohabitationStart", "Date cohabitation started", "2020-03-01", "date", "Relationship"),
  match("cohabitationEvidence", "Cohabitation evidence type", "Joint tenancy", "select", "Relationship"),
  match("sponsorName", "Sponsor full name", "DAVID JONES", "text", "Sponsor Details"),
  match("sponsorDOB", "Sponsor date of birth", "1991-08-15", "date", "Sponsor Details"),
  match("sponsorStatus", "Sponsor immigration status", "ILR Holder", "select", "Sponsor Details"),
  match("sponsorBRPNumber", "Sponsor BRP number", "RP1234567", "text", "Sponsor Details"),
  match("incomeType", "Income type", "Cash Savings", "select", "Financial Evidence"),
  mismatch("savingsAmount", "Total savings amount", "62500", "£62,500.00", "text", "Financial Evidence", "Currency symbol and formatting"),
  match("savingsHeldMonths", "Months savings held", "6", "text", "Financial Evidence"),
  match("bankName", "Bank name", "HSBC", "text", "Financial Evidence"),
  mismatch("accountNumber", "Account number", "12345678", "1234 5678", "text", "Financial Evidence", "Unexpected spaces"),
  match("accommodationType", "Accommodation type", "Rented", "select", "Accommodation"),
  match("accommodationAddress", "Accommodation address", "15 High Street, Birmingham", "text", "Accommodation"),
  match("landlordConsent", "Landlord consent obtained?", "Yes", "radio", "Accommodation"),
  match("englishQualification", "English language qualification", "Trinity GESE", "select", "English Language"),
  match("englishLevel", "CEFR level achieved", "A2", "select", "English Language"),
  match("testReference", "Test reference", "TRI-2024-5678", "text", "English Language"),
  match("previousUKVisa", "Previous UK visa?", "Yes", "radio", "Immigration History"),
  match("previousVisaType", "Previous visa type", "Student", "select", "Immigration History"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("email", "Email address", "anna.k@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+447444987654", "tel", "Contact Details"),
  match("applicationLocation", "Where are you applying from?", "Inside the UK", "radio", "Application Details"),
  missing("currentVisaExpiry", "Current visa expiry date", "2025-06-30", "date", "Immigration History"),
  match("hasDependents", "Any dependents applying?", "No", "radio", "Dependents"),
  match("tbTest", "TB test certificate?", "Not required", "radio", "Health"),
  missing("previousAddress1", "Previous UK address (last 5 years)", "8 Queens Road, Birmingham, B5 4PQ", "text", "Contact Details"),
  mismatch("sponsorNationality", "Sponsor nationality", "British", "british", "select", "Sponsor Details", "Case mismatch"),
  match("vacCentre", "VAC location", "N/A - In country", "select", "Application Details"),
];

const FM_PATH_3_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "PRIYA PATEL", "text", "Personal Details"),
  match("surname", "Surname", "PATEL", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1996-04-22", "date", "Personal Details"),
  match("nationality", "Nationality", "Indian", "select", "Personal Details"),
  match("passportNumber", "Passport number", "T1234567", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("relationshipType", "Relationship to sponsor", "Fiancée", "select", "Relationship"),
  match("proposalDate", "Date of proposal", "2024-02-14", "date", "Relationship"),
  match("intendedMarriageDate", "Intended marriage date", "2025-06-01", "date", "Relationship"),
  match("sponsorName", "Sponsor full name", "MICHAEL BROWN", "text", "Sponsor Details"),
  match("sponsorDOB", "Sponsor date of birth", "1993-09-10", "date", "Sponsor Details"),
  match("sponsorNationality", "Sponsor nationality", "British", "select", "Sponsor Details"),
  match("sponsorStatus", "Sponsor immigration status", "British Citizen", "select", "Sponsor Details"),
  match("incomeType", "Income type", "Combined sources", "select", "Financial Evidence"),
  mismatch("sponsorIncome", "Sponsor employment income", "15000", "15000.00", "text", "Financial Evidence", "Decimal added"),
  match("additionalIncome", "Additional income source", "Self-employment", "select", "Financial Evidence"),
  mismatch("selfEmploymentIncome", "Self-employment income", "8500", "£8,500", "text", "Financial Evidence", "Currency and formatting"),
  match("accommodationType", "Accommodation type", "Owned by sponsor", "select", "Accommodation"),
  match("accommodationAddress", "Accommodation address", "5 Park Lane, Leeds", "text", "Accommodation"),
  match("englishQualification", "English language qualification", "IELTS for UKVI", "select", "English Language"),
  match("englishLevel", "CEFR level achieved", "A1", "select", "English Language"),
  match("testReference", "Test reference", "IELTS-2024-9012", "text", "English Language"),
  match("previousUKVisa", "Previous UK visa?", "Yes", "radio", "Immigration History"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("tbTest", "TB test certificate?", "Yes", "radio", "Health"),
  match("email", "Email address", "priya.p@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+919876543210", "tel", "Contact Details"),
  match("applicationLocation", "Where are you applying from?", "Outside the UK", "radio", "Application Details"),
  match("vacCentre", "VAC location", "New Delhi", "select", "Application Details"),
  missing("meetingHistory", "How did you meet?", "Online - dating app", "text", "Relationship"),
];

// =============================================================================
// GLOBAL TALENT — 2 PATHS
// =============================================================================

const GT_PATH_1_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "ALEX JOHNSON", "text", "Personal Details"),
  match("surname", "Surname", "JOHNSON", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1985-03-20", "date", "Personal Details"),
  match("nationality", "Nationality", "American", "select", "Personal Details"),
  match("passportNumber", "Passport number", "557890123", "text", "Personal Details"),
  match("sex", "Sex", "Male", "radio", "Personal Details"),
  match("endorsingBody", "Endorsing body", "Tech Nation", "select", "Endorsement"),
  match("endorsementRef", "Endorsement reference", "TN-2024-00456", "text", "Endorsement"),
  match("endorsementDate", "Endorsement date", "2024-02-01", "date", "Endorsement"),
  match("talentField", "Field of talent", "Digital Technology", "select", "Endorsement"),
  match("applicationLocation", "Where are you applying from?", "Inside the UK", "radio", "Application Details"),
  match("currentVisaType", "Current visa type", "Skilled Worker", "select", "Immigration History"),
  match("email", "Email address", "alex.j@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+447800111222", "tel", "Contact Details"),
  match("addressLine1", "Address line 1", "100 Silicon Roundabout", "text", "Contact Details"),
  match("city", "City", "London", "text", "Contact Details"),
  match("postcode", "Postcode", "EC1V 2NX", "text", "Contact Details"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("hasDependents", "Any dependents applying?", "No", "radio", "Dependents"),
  mismatch("brpNumber", "BRP number", "RP9988776", "RP 9988776", "text", "Immigration History", "Unexpected space"),
];

const GT_PATH_2_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "YUKI TANAKA", "text", "Personal Details"),
  match("surname", "Surname", "TANAKA", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1982-09-05", "date", "Personal Details"),
  match("nationality", "Nationality", "Japanese", "select", "Personal Details"),
  match("passportNumber", "Passport number", "TZ1234567", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("endorsingBody", "Endorsing body", "UKRI", "select", "Endorsement"),
  match("endorsementRef", "Endorsement reference", "UKRI-2024-00789", "text", "Endorsement"),
  match("endorsementDate", "Endorsement date", "2024-03-15", "date", "Endorsement"),
  match("talentField", "Field of talent", "Science", "select", "Endorsement"),
  match("applicationLocation", "Where are you applying from?", "Outside the UK", "radio", "Application Details"),
  match("countryOfApplication", "Country of application", "Japan", "select", "Application Details"),
  match("email", "Email address", "yuki.t@example.com", "email", "Contact Details"),
  match("phone", "Phone number", "+81901234567", "tel", "Contact Details"),
  mismatch("overseasAddress", "Overseas address", "1-2-3 Shibuya, Tokyo 150-0002", "1-2-3 Shibuya Tokyo 150-0002", "text", "Contact Details", "Punctuation stripped"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("tbTest", "TB test certificate?", "Yes", "radio", "Health"),
  match("hasDependents", "Any dependents applying?", "Yes", "radio", "Dependents"),
  match("dependentCount", "Number of dependents", "1", "text", "Dependents"),
  match("dep1Name", "Dependent 1 full name", "KENJI TANAKA", "text", "Dependents"),
  match("dep1Relationship", "Dependent 1 relationship", "Spouse", "select", "Dependents"),
  mismatch("vacCentre", "VAC location", "Tokyo", "tokyo", "select", "Application Details", "Case mismatch"),
];

// =============================================================================
// STUDENT — 2 PATHS
// =============================================================================

const ST_PATH_1_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "AISHA KHAN", "text", "Personal Details"),
  match("surname", "Surname", "KHAN", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "2001-08-10", "date", "Personal Details"),
  match("nationality", "Nationality", "Pakistani", "select", "Personal Details"),
  match("passportNumber", "Passport number", "AB1234567", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("casNumber", "CAS reference number", "CAS-2024-0001234", "text", "Course Details"),
  match("sponsorName", "Sponsor (institution)", "University College London", "text", "Course Details"),
  match("courseTitle", "Course title", "MSc Computer Science", "text", "Course Details"),
  match("courseLevel", "Course level", "RQF Level 7 (Masters)", "select", "Course Details"),
  match("courseStartDate", "Course start date", "2024-09-23", "date", "Course Details"),
  match("courseEndDate", "Course end date", "2025-09-15", "date", "Course Details"),
  match("studyLocation", "Study location", "London", "select", "Course Details"),
  mismatch("tuitionFees", "Total tuition fees", "28000", "£28,000", "text", "Financial Evidence", "Currency symbol added"),
  match("feesPaid", "Fees already paid", "5000", "text", "Financial Evidence"),
  match("livingCostsMet", "Living costs met?", "Yes", "radio", "Financial Evidence"),
  mismatch("bankBalance", "Bank balance", "15000", "15,000.00", "text", "Financial Evidence", "Formatting difference"),
  match("fundsHeld28Days", "Funds held for 28 days?", "Yes", "radio", "Financial Evidence"),
  match("englishMet", "English requirement met via", "CAS confirmation", "select", "English Language"),
  match("applicationLocation", "Where are you applying from?", "Outside the UK", "radio", "Application Details"),
  match("countryOfApplication", "Country of application", "Pakistan", "select", "Application Details"),
  match("email", "Email address", "aisha.k@example.com", "email", "Contact Details"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("tbTest", "TB test certificate?", "Yes", "radio", "Health"),
];

const ST_PATH_2_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "CARLOS MENDEZ", "text", "Personal Details"),
  match("surname", "Surname", "MENDEZ", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "2002-01-30", "date", "Personal Details"),
  match("nationality", "Nationality", "Mexican", "select", "Personal Details"),
  match("passportNumber", "Passport number", "MX9876543", "text", "Personal Details"),
  match("sex", "Sex", "Male", "radio", "Personal Details"),
  match("casNumber", "CAS reference number", "CAS-2024-0005678", "text", "Course Details"),
  match("sponsorName", "Sponsor (institution)", "University of Birmingham", "text", "Course Details"),
  match("courseTitle", "Course title", "BSc Business Management", "text", "Course Details"),
  match("courseLevel", "Course level", "RQF Level 6 (Bachelors)", "select", "Course Details"),
  match("courseStartDate", "Course start date", "2024-09-16", "date", "Course Details"),
  match("courseEndDate", "Course end date", "2027-06-30", "date", "Course Details"),
  match("studyLocation", "Study location", "Outside London", "select", "Course Details"),
  match("tuitionFees", "Total tuition fees", "22000", "text", "Financial Evidence"),
  mismatch("feesPaid", "Fees already paid", "0", "nil", "text", "Financial Evidence", "Value format mismatch"),
  match("livingCostsMet", "Living costs met?", "Yes", "radio", "Financial Evidence"),
  match("officialFinancialSponsor", "Official financial sponsor?", "Yes", "radio", "Financial Evidence"),
  mismatch("financialSponsorName", "Financial sponsor name", "Mexican Government Scholarship", "Mexican govt scholarship", "text", "Financial Evidence", "Abbreviation mismatch"),
  match("englishMet", "English requirement met via", "SELT", "select", "English Language"),
  match("seltType", "SELT type", "IELTS for UKVI", "select", "English Language"),
  match("seltReference", "SELT reference", "IELTS-2024-3456", "text", "English Language"),
  missing("seltTestDate", "SELT test date", "2024-04-15", "date", "English Language"),
];

// =============================================================================
// ILR — 2 PATHS
// =============================================================================

const ILR_PATH_1_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "RAHUL SHARMA", "text", "Personal Details"),
  match("surname", "Surname", "SHARMA", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1987-06-18", "date", "Personal Details"),
  match("nationality", "Nationality", "Indian", "select", "Personal Details"),
  match("passportNumber", "Passport number", "K1234567", "text", "Personal Details"),
  match("sex", "Sex", "Male", "radio", "Personal Details"),
  match("brpNumber", "BRP number", "ZX5551234", "text", "Current Permission"),
  match("currentVisaType", "Current visa type", "Skilled Worker", "select", "Current Permission"),
  match("currentVisaExpiry", "Current visa expiry", "2025-12-01", "date", "Current Permission"),
  match("firstPermissionDate", "Date first permission granted", "2019-08-15", "date", "Current Permission"),
  match("continuousResidence", "Continuous residence (years)", "5", "text", "Qualification"),
  match("absenceDays", "Days absent from UK", "120", "text", "Qualification"),
  match("meetsResidenceReq", "Meets residence requirement?", "Yes", "radio", "Qualification"),
  match("currentEmployer", "Current employer", "TechCorp Ltd", "text", "Employment"),
  match("jobTitle", "Job title", "Engineering Manager", "text", "Employment"),
  mismatch("annualSalary", "Annual salary", "85000", "85,000", "text", "Employment", "Thousand separator"),
  match("sponsorName", "Sponsor name", "TechCorp Ltd", "text", "Employment"),
  match("knowledgeOfLife", "Life in the UK test passed?", "Yes", "radio", "English & KOL"),
  match("kolTestDate", "Test date", "2024-06-20", "date", "English & KOL"),
  match("kolReference", "Test reference", "LITUK-2024-7890", "text", "English & KOL"),
  match("englishMet", "English B1 met?", "Yes", "radio", "English & KOL"),
  match("email", "Email address", "rahul.s@example.com", "email", "Contact Details"),
  match("addressLine1", "Address line 1", "30 Victoria Street", "text", "Contact Details"),
  match("city", "City", "London", "text", "Contact Details"),
  match("postcode", "Postcode", "SW1H 0TL", "text", "Contact Details"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
];

const ILR_PATH_2_FIELDS: FieldComparisonResult[] = [
  match("givenNames", "Given names", "SARAH JOHNSON", "text", "Personal Details"),
  match("surname", "Surname", "JOHNSON", "text", "Personal Details"),
  match("dateOfBirth", "Date of birth", "1991-11-05", "date", "Personal Details"),
  match("nationality", "Nationality", "American", "select", "Personal Details"),
  match("passportNumber", "Passport number", "559876543", "text", "Personal Details"),
  match("sex", "Sex", "Female", "radio", "Personal Details"),
  match("brpNumber", "BRP number", "ZX8887654", "text", "Current Permission"),
  match("currentVisaType", "Current visa type", "Spouse", "select", "Current Permission"),
  match("currentVisaExpiry", "Current visa expiry", "2025-09-15", "date", "Current Permission"),
  match("firstPermissionDate", "Date first permission granted", "2020-03-01", "date", "Current Permission"),
  match("continuousResidence", "Continuous residence (years)", "5", "text", "Qualification"),
  match("absenceDays", "Days absent from UK", "85", "text", "Qualification"),
  match("meetsResidenceReq", "Meets residence requirement?", "Yes", "radio", "Qualification"),
  match("sponsorName", "Sponsor (partner) name", "MARK JOHNSON", "text", "Relationship"),
  match("relationshipType", "Relationship to sponsor", "Spouse", "select", "Relationship"),
  match("marriageDate", "Date of marriage", "2019-12-20", "date", "Relationship"),
  match("stillInRelationship", "Still in relationship?", "Yes", "radio", "Relationship"),
  mismatch("sponsorIncome", "Sponsor annual income", "48000", "£48,000", "text", "Financial Evidence", "Currency symbol added"),
  match("knowledgeOfLife", "Life in the UK test passed?", "Yes", "radio", "English & KOL"),
  match("kolReference", "Test reference", "LITUK-2024-5432", "text", "English & KOL"),
  match("englishMet", "English B1 met?", "Yes", "radio", "English & KOL"),
  match("email", "Email address", "sarah.j@example.com", "email", "Contact Details"),
  match("addressLine1", "Address line 1", "12 Rose Lane", "text", "Contact Details"),
  match("city", "City", "Bristol", "text", "Contact Details"),
  match("postcode", "Postcode", "BS1 4DJ", "text", "Contact Details"),
  match("criminalConvictions", "Criminal convictions?", "No", "radio", "Character"),
  match("hasDependents", "Any dependents applying?", "Yes", "radio", "Dependents"),
  missing("dep1Name", "Dependent 1 full name", "EMMA JOHNSON", "text", "Dependents"),
];

// =============================================================================
// TEST PATHS
// =============================================================================

function buildRunFromFields(
  id: string,
  testPathId: string,
  visaTypeId: FormAccuracyVisaTypeId,
  fields: FieldComparisonResult[],
  executedAt: string,
  executedBy: string,
  durationMs: number
): TestRunResult {
  const matched = fields.filter((f) => f.status === "match").length;
  const mismatched = fields.filter((f) => f.status === "mismatch").length;
  const missingCount = fields.filter((f) => f.status === "missing").length;
  const extra = fields.filter((f) => f.status === "extra").length;
  return {
    id,
    testPathId,
    visaTypeId,
    executedAt,
    executedBy,
    durationMs,
    fieldResults: fields,
    totalFields: fields.length,
    matchedFields: matched,
    mismatchedFields: mismatched,
    missingFields: missingCount,
    extraFields: extra,
    hitRate: matched / fields.length,
  };
}

export const MOCK_TEST_PATHS: TestPath[] = [
  // Skilled Worker
  {
    id: "sw-path-1",
    visaTypeId: "skilled-worker",
    name: "In-country, Annual Salary, No Dependents",
    description: "Main applicant already in UK on existing visa, paid annual salary, no dependents",
    conditions: [
      { fieldId: "applicationLocation", fieldLabel: "Location", selectedValue: "Inside the UK" },
      { fieldId: "salaryType", fieldLabel: "Salary type", selectedValue: "Annual" },
      { fieldId: "hasDependents", fieldLabel: "Dependents", selectedValue: "No" },
    ],
    fields: SW_PATH_1_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: false })),
    totalFieldCount: SW_PATH_1_FIELDS.length,
    weight: 0.4,
  },
  {
    id: "sw-path-2",
    visaTypeId: "skilled-worker",
    name: "Overseas, Annual Salary, With Dependents",
    description: "Applicant applying from outside UK, with spouse and child as dependents",
    conditions: [
      { fieldId: "applicationLocation", fieldLabel: "Location", selectedValue: "Outside the UK" },
      { fieldId: "salaryType", fieldLabel: "Salary type", selectedValue: "Annual" },
      { fieldId: "hasDependents", fieldLabel: "Dependents", selectedValue: "Yes (2)" },
    ],
    fields: SW_PATH_2_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["countryOfApplication", "dep1Name", "dep1Relationship", "dep1DateOfBirth", "dep2Name", "dep2Relationship", "dep2DateOfBirth", "dependentCount", "tbTest"].includes(f.fieldId) })),
    totalFieldCount: SW_PATH_2_FIELDS.length,
    weight: 0.35,
  },
  {
    id: "sw-path-3",
    visaTypeId: "skilled-worker",
    name: "In-country, Hourly Rate, No Dependents",
    description: "NHS worker in UK, paid hourly rate, no dependents",
    conditions: [
      { fieldId: "applicationLocation", fieldLabel: "Location", selectedValue: "Inside the UK" },
      { fieldId: "salaryType", fieldLabel: "Salary type", selectedValue: "Hourly" },
      { fieldId: "hasDependents", fieldLabel: "Dependents", selectedValue: "No" },
    ],
    fields: SW_PATH_3_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["hourlyRate", "ihsReference", "healthSurcharge"].includes(f.fieldId) })),
    totalFieldCount: SW_PATH_3_FIELDS.length,
    weight: 0.25,
  },
  // Family / Spouse
  {
    id: "fm-path-1",
    visaTypeId: "family",
    name: "Spouse, British Sponsor, Employment Income",
    description: "Married spouse of British citizen, meeting financial requirement through employment",
    conditions: [
      { fieldId: "relationshipType", fieldLabel: "Relationship", selectedValue: "Spouse" },
      { fieldId: "sponsorStatus", fieldLabel: "Sponsor status", selectedValue: "British Citizen" },
      { fieldId: "incomeType", fieldLabel: "Income type", selectedValue: "Employment" },
    ],
    fields: FM_PATH_1_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["marriageDate", "marriageCountry", "sponsorEmployer", "sponsorIncome"].includes(f.fieldId) })),
    totalFieldCount: FM_PATH_1_FIELDS.length,
    weight: 0.45,
  },
  {
    id: "fm-path-2",
    visaTypeId: "family",
    name: "Unmarried Partner, ILR Sponsor, Cash Savings",
    description: "Unmarried partner of ILR holder, meeting financial requirement through cash savings",
    conditions: [
      { fieldId: "relationshipType", fieldLabel: "Relationship", selectedValue: "Unmarried partner" },
      { fieldId: "sponsorStatus", fieldLabel: "Sponsor status", selectedValue: "ILR Holder" },
      { fieldId: "incomeType", fieldLabel: "Income type", selectedValue: "Cash Savings" },
    ],
    fields: FM_PATH_2_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["cohabitationStart", "cohabitationEvidence", "sponsorBRPNumber", "savingsAmount", "savingsHeldMonths", "bankName", "accountNumber", "landlordConsent"].includes(f.fieldId) })),
    totalFieldCount: FM_PATH_2_FIELDS.length,
    weight: 0.3,
  },
  {
    id: "fm-path-3",
    visaTypeId: "family",
    name: "Fiancée, British Sponsor, Combined Sources",
    description: "Fiancée of British citizen, meeting financial requirement through combined income sources",
    conditions: [
      { fieldId: "relationshipType", fieldLabel: "Relationship", selectedValue: "Fiancée" },
      { fieldId: "sponsorStatus", fieldLabel: "Sponsor status", selectedValue: "British Citizen" },
      { fieldId: "incomeType", fieldLabel: "Income type", selectedValue: "Combined sources" },
    ],
    fields: FM_PATH_3_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["proposalDate", "intendedMarriageDate", "additionalIncome", "selfEmploymentIncome"].includes(f.fieldId) })),
    totalFieldCount: FM_PATH_3_FIELDS.length,
    weight: 0.25,
  },
  // Global Talent
  {
    id: "gt-path-1",
    visaTypeId: "global-talent",
    name: "Digital Tech, In-country",
    description: "Tech Nation endorsed applicant switching from Skilled Worker visa within UK",
    conditions: [
      { fieldId: "talentField", fieldLabel: "Field", selectedValue: "Digital Technology" },
      { fieldId: "applicationLocation", fieldLabel: "Location", selectedValue: "Inside the UK" },
    ],
    fields: GT_PATH_1_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["currentVisaType", "brpNumber"].includes(f.fieldId) })),
    totalFieldCount: GT_PATH_1_FIELDS.length,
    weight: 0.6,
  },
  {
    id: "gt-path-2",
    visaTypeId: "global-talent",
    name: "Science, Overseas",
    description: "UKRI endorsed scientist applying from Japan with spouse dependent",
    conditions: [
      { fieldId: "talentField", fieldLabel: "Field", selectedValue: "Science" },
      { fieldId: "applicationLocation", fieldLabel: "Location", selectedValue: "Outside the UK" },
    ],
    fields: GT_PATH_2_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["countryOfApplication", "tbTest", "dep1Name", "dep1Relationship", "vacCentre"].includes(f.fieldId) })),
    totalFieldCount: GT_PATH_2_FIELDS.length,
    weight: 0.4,
  },
  // Student
  {
    id: "st-path-1",
    visaTypeId: "student",
    name: "Masters, London, Self-funded",
    description: "Masters student at UCL in London, self-funded through personal savings",
    conditions: [
      { fieldId: "courseLevel", fieldLabel: "Level", selectedValue: "Masters" },
      { fieldId: "studyLocation", fieldLabel: "Location", selectedValue: "London" },
      { fieldId: "officialFinancialSponsor", fieldLabel: "Sponsored", selectedValue: "No" },
    ],
    fields: ST_PATH_1_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: false })),
    totalFieldCount: ST_PATH_1_FIELDS.length,
    weight: 0.6,
  },
  {
    id: "st-path-2",
    visaTypeId: "student",
    name: "Bachelors, Outside London, Govt Sponsored",
    description: "Bachelor's student at Birmingham, sponsored by government scholarship",
    conditions: [
      { fieldId: "courseLevel", fieldLabel: "Level", selectedValue: "Bachelors" },
      { fieldId: "studyLocation", fieldLabel: "Location", selectedValue: "Outside London" },
      { fieldId: "officialFinancialSponsor", fieldLabel: "Sponsored", selectedValue: "Yes" },
    ],
    fields: ST_PATH_2_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["officialFinancialSponsor", "financialSponsorName", "seltType", "seltReference", "seltTestDate"].includes(f.fieldId) })),
    totalFieldCount: ST_PATH_2_FIELDS.length,
    weight: 0.4,
  },
  // ILR
  {
    id: "ilr-path-1",
    visaTypeId: "ilr",
    name: "Skilled Worker Route, 5+ Years",
    description: "ILR application after 5 years on Skilled Worker visa",
    conditions: [
      { fieldId: "currentVisaType", fieldLabel: "Route", selectedValue: "Skilled Worker" },
      { fieldId: "continuousResidence", fieldLabel: "Residence", selectedValue: "5+ years" },
    ],
    fields: ILR_PATH_1_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["currentEmployer", "jobTitle", "annualSalary", "sponsorName"].includes(f.fieldId) })),
    totalFieldCount: ILR_PATH_1_FIELDS.length,
    weight: 0.6,
  },
  {
    id: "ilr-path-2",
    visaTypeId: "ilr",
    name: "Spouse Route, 5+ Years",
    description: "ILR application after 5 years on Spouse visa",
    conditions: [
      { fieldId: "currentVisaType", fieldLabel: "Route", selectedValue: "Spouse" },
      { fieldId: "continuousResidence", fieldLabel: "Residence", selectedValue: "5+ years" },
    ],
    fields: ILR_PATH_2_FIELDS.map((f) => ({ fieldId: f.fieldId, fieldLabel: f.fieldLabel, expectedValue: f.expectedValue, fieldType: f.fieldType, formSection: f.formSection, isConditional: ["sponsorName", "relationshipType", "marriageDate", "stillInRelationship", "sponsorIncome"].includes(f.fieldId) })),
    totalFieldCount: ILR_PATH_2_FIELDS.length,
    weight: 0.4,
  },
];

// =============================================================================
// TEST RUNS (latest run per path)
// =============================================================================

export const MOCK_TEST_RUNS: TestRunResult[] = [
  buildRunFromFields("run-sw-1", "sw-path-1", "skilled-worker", SW_PATH_1_FIELDS, "2026-02-28T10:30:00Z", "System", 4520),
  buildRunFromFields("run-sw-2", "sw-path-2", "skilled-worker", SW_PATH_2_FIELDS, "2026-02-28T10:35:00Z", "System", 6180),
  buildRunFromFields("run-sw-3", "sw-path-3", "skilled-worker", SW_PATH_3_FIELDS, "2026-02-28T10:40:00Z", "System", 4100),
  buildRunFromFields("run-fm-1", "fm-path-1", "family", FM_PATH_1_FIELDS, "2026-02-27T14:00:00Z", "System", 5800),
  buildRunFromFields("run-fm-2", "fm-path-2", "family", FM_PATH_2_FIELDS, "2026-02-27T14:10:00Z", "System", 7200),
  buildRunFromFields("run-fm-3", "fm-path-3", "family", FM_PATH_3_FIELDS, "2026-02-27T14:20:00Z", "System", 5500),
  buildRunFromFields("run-gt-1", "gt-path-1", "global-talent", GT_PATH_1_FIELDS, "2026-02-26T09:00:00Z", "System", 3200),
  buildRunFromFields("run-gt-2", "gt-path-2", "global-talent", GT_PATH_2_FIELDS, "2026-02-26T09:08:00Z", "System", 3800),
  buildRunFromFields("run-st-1", "st-path-1", "student", ST_PATH_1_FIELDS, "2026-02-25T16:00:00Z", "System", 4300),
  buildRunFromFields("run-st-2", "st-path-2", "student", ST_PATH_2_FIELDS, "2026-02-25T16:10:00Z", "System", 3900),
  buildRunFromFields("run-ilr-1", "ilr-path-1", "ilr", ILR_PATH_1_FIELDS, "2026-02-24T11:00:00Z", "System", 4600),
  buildRunFromFields("run-ilr-2", "ilr-path-2", "ilr", ILR_PATH_2_FIELDS, "2026-02-24T11:10:00Z", "System", 5100),
];

// =============================================================================
// AGGREGATED METRICS
// =============================================================================

function buildVisaTypeMetrics(
  visaTypeId: FormAccuracyVisaTypeId,
  visaTypeName: string,
  visaTypeCode: string
): VisaTypeAccuracyMetrics {
  const paths = MOCK_TEST_PATHS.filter((p) => p.visaTypeId === visaTypeId);
  const runs = MOCK_TEST_RUNS.filter((r) => r.visaTypeId === visaTypeId);

  const pathMetrics: PathAccuracyMetric[] = paths.map((path) => {
    const latestRun = runs.find((r) => r.testPathId === path.id);
    return {
      testPathId: path.id,
      testPathName: path.name,
      weight: path.weight,
      latestHitRate: latestRun?.hitRate ?? 0,
      latestRunDate: latestRun?.executedAt ?? "",
      totalRuns: 1,
      trend: 0,
    };
  });

  const overallAccuracy = pathMetrics.reduce(
    (sum, pm) => sum + pm.latestHitRate * pm.weight,
    0
  );

  const totalMatches = runs.reduce((s, r) => s + r.matchedFields, 0);
  const totalMismatches = runs.reduce((s, r) => s + r.mismatchedFields, 0);
  const totalMissing = runs.reduce((s, r) => s + r.missingFields, 0);
  const totalFields = runs.reduce((s, r) => s + r.totalFields, 0);
  const lastTestDate = runs.length
    ? runs.sort((a, b) => b.executedAt.localeCompare(a.executedAt))[0].executedAt
    : "";

  return {
    visaTypeId,
    visaTypeName,
    visaTypeCode,
    overallAccuracy,
    totalPaths: paths.length,
    totalFields,
    lastTestDate,
    totalRuns: runs.length,
    pathMetrics,
    totalMatches,
    totalMismatches,
    totalMissing,
  };
}

export const MOCK_VISA_TYPE_METRICS: VisaTypeAccuracyMetrics[] = [
  buildVisaTypeMetrics("skilled-worker", "Skilled Worker", "SW"),
  buildVisaTypeMetrics("family", "Family / Spouse", "FM"),
  buildVisaTypeMetrics("global-talent", "Global Talent", "GT"),
  buildVisaTypeMetrics("student", "Student", "ST"),
  buildVisaTypeMetrics("ilr", "Indefinite Leave to Remain", "ILR"),
];

export const MOCK_DASHBOARD_STATS: FormAccuracyDashboardStats = {
  averageAccuracy:
    MOCK_VISA_TYPE_METRICS.reduce((s, m) => s + m.overallAccuracy, 0) /
    MOCK_VISA_TYPE_METRICS.length,
  totalVisaTypes: MOCK_VISA_TYPE_METRICS.length,
  lowestVisaType: MOCK_VISA_TYPE_METRICS.reduce(
    (lowest, m) =>
      m.overallAccuracy < lowest.accuracy
        ? { visaTypeId: m.visaTypeId, visaTypeName: m.visaTypeName, accuracy: m.overallAccuracy }
        : lowest,
    { visaTypeId: MOCK_VISA_TYPE_METRICS[0].visaTypeId, visaTypeName: MOCK_VISA_TYPE_METRICS[0].visaTypeName, accuracy: MOCK_VISA_TYPE_METRICS[0].overallAccuracy }
  ),
  lastRunTime: MOCK_VISA_TYPE_METRICS.reduce(
    (latest, m) => (m.lastTestDate > latest ? m.lastTestDate : latest),
    MOCK_VISA_TYPE_METRICS[0].lastTestDate
  ),
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getTestPathsForVisaType(visaTypeId: FormAccuracyVisaTypeId) {
  return MOCK_TEST_PATHS.filter((p) => p.visaTypeId === visaTypeId);
}

export function getTestRunsForPath(pathId: string) {
  return MOCK_TEST_RUNS.filter((r) => r.testPathId === pathId);
}

export function getLatestRunForPath(pathId: string) {
  return MOCK_TEST_RUNS.find((r) => r.testPathId === pathId) ?? null;
}

export function getMetricsForVisaType(visaTypeId: FormAccuracyVisaTypeId) {
  return MOCK_VISA_TYPE_METRICS.find((m) => m.visaTypeId === visaTypeId) ?? null;
}

// =============================================================================
// BATCH TEST RUNS (one run = all paths for a visa type)
// =============================================================================

// Seeded pseudo-random for deterministic mock data
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Base hit rates per path (used as center for daily variation)
const PATH_BASE_RATES: Record<string, number> = {
  "sw-path-1": 0.964, "sw-path-2": 0.912, "sw-path-3": 0.885,
  "fm-path-1": 0.938, "fm-path-2": 0.875, "fm-path-3": 0.900,
  "gt-path-1": 0.950, "gt-path-2": 0.923,
  "st-path-1": 0.942, "st-path-2": 0.891,
  "ilr-path-1": 0.971, "ilr-path-2": 0.935,
};

function generateBatchRuns(
  visaTypeId: FormAccuracyVisaTypeId,
  days: number
): BatchTestRun[] {
  const paths = MOCK_TEST_PATHS.filter((p) => p.visaTypeId === visaTypeId);
  const runs: BatchTestRun[] = [];
  const rand = seededRandom(visaTypeId.charCodeAt(0) * 1000 + visaTypeId.length);
  const today = new Date("2026-03-03");

  // Simulate a gov.uk site change event around 60 days ago for some visa types
  const siteChangeDay = visaTypeId === "skilled-worker" ? 58 : visaTypeId === "family" ? 45 : -1;

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);

    // ~5% chance of skipping a day (weekend/maintenance)
    if (rand() < 0.05) continue;

    const pathResults: BatchPathResult[] = paths.map((path) => {
      let base = PATH_BASE_RATES[path.id] ?? 0.9;

      // Site change: drop accuracy for a few days, then recover
      if (siteChangeDay > 0 && d <= siteChangeDay && d > siteChangeDay - 8) {
        const severity = (siteChangeDay - d) / 8; // 0..1 recovery
        base = base * (0.6 + 0.4 * severity);
      }

      // Daily variation: ±3%
      const variation = (rand() - 0.5) * 0.06;
      const hitRate = Math.max(0.5, Math.min(1, base + variation));
      const totalFields = path.totalFieldCount;
      const matched = Math.round(hitRate * totalFields);

      return {
        testPathId: path.id,
        testPathName: path.name,
        hitRate: matched / totalFields,
        totalFields,
        matchedFields: matched,
        passed: matched / totalFields >= 0.8,
      };
    });

    const passedPaths = pathResults.filter((p) => p.passed).length;
    const overallAccuracy =
      pathResults.reduce((s, p) => {
        const pathDef = paths.find((pp) => pp.id === p.testPathId);
        return s + p.hitRate * (pathDef?.weight ?? 1 / paths.length);
      }, 0);

    runs.push({
      id: `batch-${visaTypeId}-${date.toISOString().slice(0, 10)}`,
      visaTypeId,
      executedAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2, 0, 0).toISOString(),
      executedBy: "System",
      trigger: "scheduled",
      durationMs: 3000 + Math.round(rand() * 8000),
      pathResults,
      totalPaths: paths.length,
      passedPaths,
      overallAccuracy,
      status: passedPaths === paths.length ? "success" : passedPaths === 0 ? "failed" : "partial",
    });
  }

  return runs;
}

const HEATMAP_DAYS = 120; // ~4 months

export const MOCK_BATCH_RUNS: Record<FormAccuracyVisaTypeId, BatchTestRun[]> = {
  "skilled-worker": generateBatchRuns("skilled-worker", HEATMAP_DAYS),
  "global-talent": generateBatchRuns("global-talent", HEATMAP_DAYS),
  "family": generateBatchRuns("family", HEATMAP_DAYS),
  "student": generateBatchRuns("student", HEATMAP_DAYS),
  "ilr": generateBatchRuns("ilr", HEATMAP_DAYS),
};

export function getBatchRunsForVisaType(visaTypeId: FormAccuracyVisaTypeId): BatchTestRun[] {
  return MOCK_BATCH_RUNS[visaTypeId] ?? [];
}

export function getLastNBatchAccuracies(visaTypeId: FormAccuracyVisaTypeId, n = 5): number[] {
  const runs = MOCK_BATCH_RUNS[visaTypeId] ?? [];
  return runs.slice(-n).map(r => r.overallAccuracy);
}

export interface CoverageTimelineRow {
  visaTypeId: FormAccuracyVisaTypeId;
  visaTypeName: string;
  accuracy: number;
  days: { date: string; hasRun: boolean; accuracy: number | null }[];
  daysSinceLastRun: number;
}

export function getCoverageTimelineData(numDays = 14): CoverageTimelineRow[] {
  const today = new Date("2026-03-03");
  return MOCK_VISA_TYPE_METRICS.map((m) => {
    const runs = MOCK_BATCH_RUNS[m.visaTypeId] ?? [];
    const runsByDate = new Map<string, BatchTestRun>();
    for (const run of runs) {
      runsByDate.set(run.executedAt.slice(0, 10), run);
    }

    const days: CoverageTimelineRow["days"] = [];
    let daysSinceLastRun = numDays;

    for (let d = numDays - 1; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dateKey = date.toISOString().slice(0, 10);
      const run = runsByDate.get(dateKey);
      days.push({
        date: dateKey,
        hasRun: !!run,
        accuracy: run ? run.overallAccuracy : null,
      });
      if (run && d < daysSinceLastRun) {
        daysSinceLastRun = d;
      }
    }

    return {
      visaTypeId: m.visaTypeId,
      visaTypeName: m.visaTypeName,
      accuracy: m.overallAccuracy,
      days,
      daysSinceLastRun,
    };
  });
}

export function getHeatmapData(visaTypeId: FormAccuracyVisaTypeId, days: number = HEATMAP_DAYS): HeatmapDay[] {
  const batchRuns = getBatchRunsForVisaType(visaTypeId);
  const runsByDate = new Map<string, BatchTestRun>();
  for (const run of batchRuns) {
    const dateKey = run.executedAt.slice(0, 10);
    runsByDate.set(dateKey, run);
  }

  const today = new Date("2026-03-03");
  const result: HeatmapDay[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateKey = date.toISOString().slice(0, 10);
    result.push({
      date: dateKey,
      batchRun: runsByDate.get(dateKey) ?? null,
    });
  }
  return result;
}
