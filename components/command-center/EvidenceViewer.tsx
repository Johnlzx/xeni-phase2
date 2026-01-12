'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
  Minimize2,
  List,
  Grid,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHighlightedFieldId, useHighlightedSource, useCommandCenterStore } from '@/store/command-center-store';
import type { EvidenceModule, ExtractedField, BoundingBox, FieldSource } from '@/types/command-center';

// =============================================================================
// Main Component
// =============================================================================

interface EvidenceViewerProps {
  module: EvidenceModule;
  slotIndex: number;
}

export function EvidenceViewer({ module, slotIndex }: EvidenceViewerProps) {
  const slot = module.slots[slotIndex];
  const highlightedFieldId = useHighlightedFieldId();
  const highlightedSource = useHighlightedSource();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3); // Mock
  const [viewMode, setViewMode] = useState<'single' | 'thumbnail'>('single');
  const viewerRef = useRef<HTMLDivElement>(null);

  // Get all fields across all slots that have bounding boxes
  const allFieldsWithBoxes = useMemo(() => {
    return module.slots.flatMap((s) =>
      s.extractedFields.filter((f) => f.source.boundingBox)
    );
  }, [module.slots]);

  // Get unique documents from current slot
  const documents = useMemo(() => {
    if (!slot) return [];
    const docIds = slot.documentIds;
    // Mock document data - in real app, this would come from a documents store
    return docIds.map((id) => ({
      id,
      name: `Document_${id.split('-').pop()}.pdf`,
      pageCount: 3,
    }));
  }, [slot]);

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const activeDoc = documents[activeDocIndex];

  // Scroll to highlighted field when it changes
  useEffect(() => {
    if (highlightedSource?.pageNumber && highlightedSource.pageNumber !== currentPage) {
      setCurrentPage(highlightedSource.pageNumber);
    }
  }, [highlightedSource, currentPage]);

  // Get highlights for current page
  const pageHighlights = useMemo(() => {
    return allFieldsWithBoxes.filter(
      (f) =>
        f.source.documentId === activeDoc?.id &&
        f.source.pageNumber === currentPage &&
        f.source.boundingBox
    );
  }, [allFieldsWithBoxes, activeDoc?.id, currentPage]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (documents.length === 0) {
    return <NoDocumentState />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <ViewerToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        documentName={activeDoc?.name || 'Document'}
      />

      {/* Document Tabs (if multiple documents) */}
      {documents.length > 1 && (
        <DocumentTabs
          documents={documents}
          activeIndex={activeDocIndex}
          onSelect={setActiveDocIndex}
        />
      )}

      {/* Main Viewer Area */}
      <div
        ref={viewerRef}
        className="flex-1 overflow-auto bg-gray-800 p-4"
      >
        {viewMode === 'single' ? (
          <SinglePageView
            zoom={zoom}
            rotation={rotation}
            currentPage={currentPage}
            highlights={pageHighlights}
            highlightedFieldId={highlightedFieldId}
          />
        ) : (
          <ThumbnailView
            totalPages={totalPages}
            currentPage={currentPage}
            onPageSelect={setCurrentPage}
            highlights={allFieldsWithBoxes}
          />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Viewer Toolbar
// =============================================================================

interface ViewerToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  viewMode: 'single' | 'thumbnail';
  onViewModeChange: (mode: 'single' | 'thumbnail') => void;
  documentName: string;
}

function ViewerToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onRotate,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  viewMode,
  onViewModeChange,
  documentName,
}: ViewerToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      {/* Left - Document Info */}
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300 truncate max-w-[200px]">
          {documentName}
        </span>
      </div>

      {/* Center - Page Navigation & Zoom */}
      <div className="flex items-center gap-4">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-gray-700" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-300 w-12 text-center">{zoom}%</span>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 200}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-400"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-gray-700" />

        {/* Rotate */}
        <button
          onClick={onRotate}
          className="p-1.5 rounded hover:bg-gray-700 text-gray-400"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Right - View Mode & Actions */}
      <div className="flex items-center gap-2">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('single')}
            className={cn(
              'p-1.5 rounded',
              viewMode === 'single' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('thumbnail')}
            className={cn(
              'p-1.5 rounded',
              viewMode === 'thumbnail' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Download */}
        <button className="p-1.5 rounded hover:bg-gray-700 text-gray-400">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Document Tabs
// =============================================================================

interface DocumentTabsProps {
  documents: { id: string; name: string; pageCount: number }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function DocumentTabs({ documents, activeIndex, onSelect }: DocumentTabsProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-gray-850 border-b border-gray-700 overflow-x-auto">
      {documents.map((doc, idx) => (
        <button
          key={doc.id}
          onClick={() => onSelect(idx)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors',
            idx === activeIndex
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
          )}
        >
          {doc.name}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Single Page View with Highlights
// =============================================================================

interface SinglePageViewProps {
  zoom: number;
  rotation: number;
  currentPage: number;
  highlights: ExtractedField[];
  highlightedFieldId: string | null;
}

function SinglePageView({
  zoom,
  rotation,
  currentPage,
  highlights,
  highlightedFieldId,
}: SinglePageViewProps) {
  const { setHighlightedField } = useCommandCenterStore();

  return (
    <div className="flex items-center justify-center min-h-full">
      <div
        className="relative bg-white shadow-2xl"
        style={{
          width: `${(595 * zoom) / 100}px`,
          height: `${(842 * zoom) / 100}px`,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Mock PDF Page Content */}
        <div className="absolute inset-0 p-8 text-gray-300 text-sm">
          <MockPDFContent pageNumber={currentPage} />
        </div>

        {/* Highlight Overlays */}
        {highlights.map((field) => (
          <HighlightOverlay
            key={field.id}
            field={field}
            isActive={highlightedFieldId === field.id}
            onClick={() => setHighlightedField(field.id, field.source)}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Highlight Overlay Component
// =============================================================================

interface HighlightOverlayProps {
  field: ExtractedField;
  isActive: boolean;
  onClick: () => void;
}

function HighlightOverlay({ field, isActive, onClick }: HighlightOverlayProps) {
  const box = field.source.boundingBox;
  if (!box) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute border-2 rounded transition-all cursor-pointer',
        isActive
          ? 'border-[#0E4369] bg-[#0E4369]/20 ring-4 ring-[#0E4369]/30 z-10'
          : 'border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
      )}
      style={{
        left: `${box.x}%`,
        top: `${box.y}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
      title={`${field.label}: ${field.displayValue}`}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-8 left-0 px-2 py-1 bg-[#0E4369] text-white text-xs rounded whitespace-nowrap z-20">
          {field.label}
        </div>
      )}
    </button>
  );
}

// =============================================================================
// Thumbnail View
// =============================================================================

interface ThumbnailViewProps {
  totalPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  highlights: ExtractedField[];
}

function ThumbnailView({
  totalPages,
  currentPage,
  onPageSelect,
  highlights,
}: ThumbnailViewProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const pageHighlights = highlights.filter(
          (f) => f.source.pageNumber === pageNum
        );

        return (
          <button
            key={pageNum}
            onClick={() => onPageSelect(pageNum)}
            className={cn(
              'relative aspect-[595/842] bg-white rounded-lg overflow-hidden shadow-lg transition-all',
              currentPage === pageNum
                ? 'ring-2 ring-[#0E4369] scale-105'
                : 'hover:scale-102 hover:shadow-xl'
            )}
          >
            {/* Page Number Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/80 text-white text-xs rounded">
              {pageNum}
            </div>

            {/* Highlight Count Badge */}
            {pageHighlights.length > 0 && (
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">
                {pageHighlights.length} fields
              </div>
            )}

            {/* Mini PDF Preview */}
            <div className="p-4 text-gray-300 text-[6px]">
              <MockPDFContent pageNumber={pageNum} mini />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// =============================================================================
// Mock PDF Content
// =============================================================================

function MockPDFContent({ pageNumber, mini = false }: { pageNumber: number; mini?: boolean }) {
  // Different content based on page number
  const contents: Record<number, JSX.Element> = {
    1: (
      <>
        <div className={cn('mb-6', mini ? 'text-[4px]' : 'text-lg font-bold text-gray-400')}>
          UNITED KINGDOM
        </div>
        <div className={cn('space-y-2', mini && 'space-y-1')}>
          <div className="flex justify-between">
            <span className="text-gray-400">Surname</span>
            <span className="text-gray-600">BROWN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Given Names</span>
            <span className="text-gray-600">BOB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Passport No</span>
            <span className="text-gray-600">AT38249065</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date of Expiry</span>
            <span className="text-gray-600">23 Jan 2026</span>
          </div>
        </div>
      </>
    ),
    2: (
      <>
        <div className={cn('mb-4', mini ? 'text-[4px]' : 'text-sm font-bold text-gray-400')}>
          HSBC Bank Statement
        </div>
        <div className={cn('space-y-1', mini && 'space-y-0.5')}>
          <div className="text-gray-400 text-xs">Account: 12345678</div>
          <div className="text-gray-400 text-xs">Period: 1 Dec - 31 Dec 2024</div>
          <div className="mt-4 border-t border-gray-200 pt-2">
            <div className="flex justify-between text-xs">
              <span>Opening Balance</span>
              <span>£12,540.00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>01 Dec - Direct Debit</span>
              <span>-£450.00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>05 Dec - Salary</span>
              <span>+£3,800.00</span>
            </div>
          </div>
        </div>
      </>
    ),
    3: (
      <>
        <div className={cn('mb-4', mini ? 'text-[4px]' : 'text-sm font-bold text-gray-400')}>
          Statement Summary
        </div>
        <div className={cn('space-y-2', mini && 'space-y-1')}>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Closing Balance</span>
            <span className="font-medium">£15,420.50</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Lowest Balance</span>
            <span className="text-red-500">£1,180.00</span>
          </div>
        </div>
      </>
    ),
  };

  return contents[pageNumber] || (
    <div className="text-center text-gray-300">
      Page {pageNumber}
    </div>
  );
}

// =============================================================================
// No Document State
// =============================================================================

function NoDocumentState() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
          <FileText className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-sm font-medium text-gray-400">No document to display</h3>
        <p className="text-sm text-gray-500 mt-1">
          Link a document to this slot to view it here
        </p>
      </div>
    </div>
  );
}
