# Folder Upload with Auto-Naming Convention

## Summary

Implement recursive folder upload functionality that automatically generates standardized document names based on folder path analysis. The naming convention follows `who_documentType_date` format to clearly identify document ownership and type for Home Office caseworkers.

## Background

**Problem**: Current flat file upload loses critical context about document ownership. Two `Passport.pdf` files from different people (Applicant vs Sponsor) appear identical.

**Solution**: Extract entity and document type from folder path structure, generate standardized names that preserve this context.

## Naming Convention

```
{who}_{documentType}_{date}
```

| Component | Source | Examples |
|-----------|--------|----------|
| `who` | Path keyword detection | `applicant`, `sponsor`, `dependant`, `shared` |
| `documentType` | Path + filename analysis | `passport`, `bankStatement`, `payslip` |
| `date` | Filename/path (MMYY) | `0126` (Jan 2026), omitted if not applicable |

### Examples

| Upload Path | Generated Name |
|-------------|----------------|
| `Applicant_John/Identity/Passport.pdf` | `applicant_passport` |
| `Sponsor_Mary/Identity/Passport.pdf` | `sponsor_passport` |
| `Applicant_John/Financial/Bank_Statements/2024/January.pdf` | `applicant_bankStatement_0124` |
| `Dependent_Emma/Identity/Birth_Certificate.pdf` | `dependant_birthCertificate` |
| `Shared_Documents/Utility_Bills/Electric.pdf` | `shared_utilityBill` |

---

## Implementation Steps

### Step 1: Add Folder Upload Support to Sidebar

**File**: `components/case-detail/file-hub/FileHubContent.tsx`

- Extend the existing upload zone to accept folder drops
- Use `webkitdirectory` attribute for folder selection
- Access `webkitRelativePath` from dropped files to get full path

```typescript
// Key API for folder upload
interface FileWithPath extends File {
  webkitRelativePath: string; // e.g., "Case_2024/Applicant_John/Identity/Passport.pdf"
}
```

### Step 2: Create Path Parser Utility

**File**: `lib/document-path-parser.ts` (new file)

```typescript
interface ParsedDocument {
  who: 'applicant' | 'sponsor' | 'dependant' | 'shared' | 'unknown';
  documentType: string;
  date?: string; // MMYY format
  generatedName: string;
  relativePath: string;
}

function parseDocumentPath(relativePath: string, filename: string): ParsedDocument
```

**Parsing Logic**:
1. **Entity Detection**: Scan path segments for keywords
   - `applicant`, `main`, `primary` → `applicant`
   - `sponsor`, `partner` → `sponsor`
   - `dependant`, `dependent`, `child` → `dependant`
   - `shared`, `common`, `joint` → `shared`
   - None found → `unknown`

2. **Document Type Detection**: Map path/filename to standard types
   - `passport`, `id`, `identity` → `passport`
   - `bank`, `statement` → `bankStatement`
   - `payslip`, `salary` → `payslip`
   - `employment`, `contract` → `employmentContract`
   - etc.

3. **Date Extraction**: Look for date patterns
   - Path segments: `2024`, `January`, `Jan`, `01`
   - Filename: `Jan2024.pdf`, `2024-01.pdf`
   - Convert to MMYY format

### Step 3: Extend DocumentFile Type

**File**: `types/case-detail.ts`

```typescript
interface DocumentFile {
  id: string;
  name: string;
  // ... existing fields
  relativePath?: string;      // NEW: Original upload path
  generatedName?: string;     // NEW: Auto-generated standardized name
  entityType?: 'applicant' | 'sponsor' | 'dependant' | 'shared' | 'unknown';
}
```

### Step 4: Update Upload Handler

**File**: `store/case-detail-store.ts`

Modify `uploadAndAutoClassify` or create new `uploadFolderAndClassify`:
- Accept files with relative paths
- Call path parser for each file
- Group files by generated document type
- Create DocumentGroups with generated names as titles

### Step 5: Update Document Display

**File**: `components/case-detail/file-hub/FileHubContent.tsx`

- CategoryCard displays `generatedName` or `title`
- No other UI changes needed (per user requirement)

### Step 6: Update Download/Export

- When downloading single files: use generated name
- When exporting ZIP: preserve generated names

---

## Files to Modify

| File | Changes |
|------|---------|
| `lib/document-path-parser.ts` | **NEW** - Path parsing utility |
| `types/case-detail.ts` | Add `relativePath`, `generatedName`, `entityType` to DocumentFile |
| `store/case-detail-store.ts` | Add folder upload action with path parsing |
| `components/case-detail/file-hub/FileHubContent.tsx` | Add folder upload support in Sidebar |

---

## Testing Scenarios

### Scenario 1: Basic Entity Attribution
```
Input:  Case_2024/Applicant_John/Identity/Passport.pdf
Output: applicant_passport
```

### Scenario 2: Same Document, Different Entities
```
Input:  Case_2024/Applicant_John/Identity/Passport.pdf
        Case_2024/Sponsor_Mary/Identity/Passport.pdf
Output: applicant_passport
        sponsor_passport
```

### Scenario 3: Time-based Documents
```
Input:  Case_2024/Applicant_John/Financial/Bank_Statements/2024/January.pdf
Output: applicant_bankStatement_0124
```

### Scenario 4: Non Time-based Documents
```
Input:  Case_2024/Applicant_John/Identity/Passport.pdf
Output: applicant_passport (no date suffix)
```

### Scenario 5: Empty Folders
```
Input:  Case_2024/Empty_Folder/
Output: (ignored, no files processed)
```

### Scenario 6: Unknown Entity
```
Input:  Documents/Misc/SomeFile.pdf
Output: unknown_document (or prompts for manual assignment)
```

---

## Document Type Mapping Reference

| Keywords in Path/Filename | Generated Type |
|--------------------------|----------------|
| passport, travel document | `passport` |
| bank, statement | `bankStatement` |
| payslip, salary, wage | `payslip` |
| employment, job, contract | `employmentContract` |
| tax, return, hmrc | `taxReturn` |
| birth, certificate | `birthCertificate` |
| marriage, wedding | `marriageCertificate` |
| utility, electric, gas, water | `utilityBill` |
| accommodation, property, lease | `proofOfAccommodation` |
| consent, letter | `letterOfConsent` |
| cohabitation, relationship | `proofOfCohabitation` |
| visa, permit | `visa` |
| degree, diploma, transcript | `educationCertificate` |

---

## Acceptance Criteria Checklist

- [ ] Folder upload works with nested structures of any depth
- [ ] Path metadata (`relativePath`) is stored with each file
- [ ] Entity (`who`) correctly detected from path keywords
- [ ] Document type correctly mapped from path/filename
- [ ] Date extracted and formatted as MMYY for time-based docs
- [ ] Non time-based documents have no date suffix
- [ ] Generated names displayed on document cards
- [ ] Downloads use generated names
- [ ] Empty folders are ignored
- [ ] Same filename from different entities produces unique names
