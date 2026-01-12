'use client';

import { useState } from 'react';
import {
  Upload,
  File,
  FileText,
  FileImage,
  Folder,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
  moduleId?: string;
}

interface DocumentGroup {
  id: string;
  name: string;
  documents: Document[];
  isExpanded: boolean;
}

// Mock document data
const MOCK_DOCUMENTS: Document[] = [
  { id: 'doc-passport-1', name: 'Passport_BobBrown.pdf', type: 'passport', dateAdded: '2025-01-08', moduleId: 'identity-status' },
  { id: 'doc-brp-1', name: 'BRP_Current.jpg', type: 'brp', dateAdded: '2025-01-08', moduleId: 'identity-status' },
  { id: 'doc-cos-1', name: 'CoS_Confirmation.pdf', type: 'cos', dateAdded: '2025-01-07', moduleId: 'sponsorship' },
  { id: 'doc-offer-1', name: 'JobOffer_TechCorp.pdf', type: 'offer-letter', dateAdded: '2025-01-07', moduleId: 'sponsorship' },
  { id: 'doc-bank-1', name: 'BankStatement_Dec2024.pdf', type: 'bank-statement', dateAdded: '2025-01-06', moduleId: 'financial' },
  { id: 'doc-degree-1', name: 'Degree_Certificate.pdf', type: 'degree', dateAdded: '2025-01-05', moduleId: 'english-language' },
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  passport: <FileText className="w-4 h-4 text-blue-500" />,
  brp: <FileImage className="w-4 h-4 text-green-500" />,
  cos: <FileText className="w-4 h-4 text-purple-500" />,
  'offer-letter': <FileText className="w-4 h-4 text-indigo-500" />,
  'bank-statement': <FileText className="w-4 h-4 text-amber-500" />,
  degree: <FileText className="w-4 h-4 text-teal-500" />,
  default: <File className="w-4 h-4 text-gray-400" />,
};

export function EvidenceLibrary() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['assigned', 'unassigned']));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Filter documents by search
  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group documents
  const assignedDocs = filteredDocs.filter((d) => d.moduleId);
  const unassignedDocs = filteredDocs.filter((d) => !d.moduleId);

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-[#0E4369] focus:ring-1 focus:ring-[#0E4369]/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-auto">
        {/* Assigned Documents */}
        <DocumentGroup
          label="Assigned"
          count={assignedDocs.length}
          isExpanded={expandedGroups.has('assigned')}
          onToggle={() => toggleGroup('assigned')}
        >
          {assignedDocs.map((doc) => (
            <DocumentItem key={doc.id} document={doc} />
          ))}
        </DocumentGroup>

        {/* Unassigned Documents */}
        <DocumentGroup
          label="Unassigned"
          count={unassignedDocs.length}
          isExpanded={expandedGroups.has('unassigned')}
          onToggle={() => toggleGroup('unassigned')}
        >
          {unassignedDocs.length > 0 ? (
            unassignedDocs.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))
          ) : (
            <p className="px-4 py-2 text-xs text-gray-400">No unassigned documents</p>
          )}
        </DocumentGroup>
      </div>

      {/* Upload Button */}
      <div className="p-3 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 hover:border-[#0E4369] hover:bg-[#0E4369]/5 transition-all text-xs text-gray-600 hover:text-[#0E4369]">
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Document Group
// =============================================================================

interface DocumentGroupProps {
  label: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function DocumentGroup({ label, count, isExpanded, onToggle, children }: DocumentGroupProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
          <Folder className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-xs text-gray-400">{count}</span>
      </button>
      {isExpanded && <div className="pb-2">{children}</div>}
    </div>
  );
}

// =============================================================================
// Document Item
// =============================================================================

interface DocumentItemProps {
  document: Document;
}

function DocumentItem({ document }: DocumentItemProps) {
  const icon = FILE_ICONS[document.type] || FILE_ICONS.default;

  return (
    <button className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 transition-colors text-left group">
      {icon}
      <span className="flex-1 text-xs text-gray-700 truncate group-hover:text-[#0E4369]">
        {document.name}
      </span>
    </button>
  );
}
