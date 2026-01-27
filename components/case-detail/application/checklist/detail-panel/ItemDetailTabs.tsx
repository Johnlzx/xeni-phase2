"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./OverviewTab";
import { DetailsTab } from "./DetailsTab";
import { SupportingDocumentsTab } from "./SupportingDocumentsTab";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  RequiredEvidence,
  DocumentGroup,
} from "@/types/case-detail";

export type DetailTabId = "overview" | "details" | "supporting-documents";

// Props for assessment items
interface AssessmentField {
  id: string;
  label: string;
  value: string | null;
  type: "text" | "select" | "radio";
  options?: { value: string; label: string }[];
  isRequired: boolean;
  isConditional?: boolean;
  dependsOn?: { fieldId: string; value: string };
  description?: string;
}

// Common props for all item types
interface BaseItemDetailProps {
  itemId: string;
  itemTitle: string;
  documentGroups: DocumentGroup[];
  onReanalyze?: () => void;
  onTabChange?: (tabId: DetailTabId) => void;
  externalActiveTab?: DetailTabId; // Optional external control of active tab
}

// Props for checklist section items
interface ChecklistItemDetailProps extends BaseItemDetailProps {
  itemType: "checklist";
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
  onFieldChange: (fieldId: string, value: string) => void;
  formValues: Record<string, string>;
  editedFieldIds: Set<string>;
}

// Props for assessment items
interface AssessmentItemDetailProps extends BaseItemDetailProps {
  itemType: "assessment";
  fields: AssessmentField[];
  onFieldChange: (fieldId: string, value: string) => void;
  formValues: Record<string, string>;
  requiredEvidence: RequiredEvidence[];
}

export type ItemDetailTabsProps = ChecklistItemDetailProps | AssessmentItemDetailProps;

export function ItemDetailTabs(props: ItemDetailTabsProps) {
  const { itemId, itemTitle, documentGroups, itemType, onReanalyze, onTabChange, externalActiveTab } = props;

  // Local tab state - resets to overview when item changes
  const [activeTab, setActiveTab] = useState<DetailTabId>(externalActiveTab || "overview");

  // State for navigating to a specific field from Overview
  const [focusFieldId, setFocusFieldId] = useState<string | null>(null);

  // Determine if this is an employment section (use tabs) or other section (use breadcrumb)
  const isEmploymentSection = itemType === "checklist" &&
    props.items.length > 0 &&
    props.items[0].section === "employment";

  // Sync with external active tab when it changes (e.g., from header breadcrumb)
  useEffect(() => {
    if (externalActiveTab !== undefined && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to overview tab when item changes
  useEffect(() => {
    setActiveTab("overview");
    setFocusFieldId(null);
    onTabChange?.("overview");
  }, [itemId, onTabChange]);

  // Handle tab change
  const handleTabChange = (tabId: DetailTabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Handler for "Edit →" navigation from Overview
  const handleEditField = useCallback((fieldId: string) => {
    setFocusFieldId(fieldId);
    setActiveTab("details");
    onTabChange?.("details");
  }, [onTabChange]);

  // Handler for navigating to a tab (used by breadcrumb navigation)
  const handleNavigateToTab = useCallback((tabId: DetailTabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);

  // Clear focus after Details tab has handled it
  const clearFocusField = useCallback(() => {
    setFocusFieldId(null);
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0 bg-white">
      {isEmploymentSection ? (
        /* Employment Section: Conditional content based on activeTab */
        <div className="flex-1 min-h-0 relative">
          {activeTab === "overview" && (
            <div className="absolute inset-0 overflow-y-auto flex flex-col">
              <OverviewTab
                itemType="checklist"
                items={(props as ChecklistItemDetailProps).items}
                issues={(props as ChecklistItemDetailProps).issues}
                formValues={(props as ChecklistItemDetailProps).formValues}
                documentGroups={documentGroups}
                onEditField={handleEditField}
                onFieldChange={(props as ChecklistItemDetailProps).onFieldChange}
                onReanalyze={onReanalyze}
                onNavigateToTab={handleNavigateToTab}
              />
            </div>
          )}

          {activeTab === "details" && (
            <div className="absolute inset-0 overflow-y-auto">
              <DetailsTab
                itemType="checklist"
                items={(props as ChecklistItemDetailProps).items}
                formValues={(props as ChecklistItemDetailProps).formValues}
                editedFieldIds={(props as ChecklistItemDetailProps).editedFieldIds}
                documentGroups={documentGroups}
                onFieldChange={(props as ChecklistItemDetailProps).onFieldChange}
                focusFieldId={focusFieldId}
                onFocusHandled={clearFocusField}
              />
            </div>
          )}

          {activeTab === "supporting-documents" && (
            <div className="absolute inset-0 overflow-y-auto">
              <SupportingDocumentsTab
                itemType="checklist"
                items={(props as ChecklistItemDetailProps).items}
                documentGroups={documentGroups}
              />
            </div>
          )}
        </div>
      ) : (
        /* Non-Employment Section: No tabs, direct content with breadcrumb navigation */
        <div className="flex-1 min-h-0 relative">
          {activeTab === "overview" && (
            <div className="absolute inset-0 overflow-y-auto flex flex-col">
              {props.itemType === "checklist" ? (
                <OverviewTab
                  itemType="checklist"
                  items={props.items}
                  issues={props.issues}
                  formValues={props.formValues}
                  documentGroups={documentGroups}
                  onEditField={handleEditField}
                  onFieldChange={props.onFieldChange}
                  onReanalyze={onReanalyze}
                  onNavigateToTab={handleNavigateToTab}
                />
              ) : (
                <OverviewTab
                  itemType="assessment"
                  fields={props.fields}
                  formValues={props.formValues}
                  requiredEvidence={props.requiredEvidence}
                  documentGroups={documentGroups}
                  onEditField={handleEditField}
                  onFieldChange={props.onFieldChange}
                  onReanalyze={onReanalyze}
                  onNavigateToTab={handleNavigateToTab}
                />
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="absolute inset-0 overflow-y-auto">
              {props.itemType === "checklist" ? (
                <DetailsTab
                  itemType="checklist"
                  items={props.items}
                  formValues={props.formValues}
                  editedFieldIds={props.editedFieldIds}
                  documentGroups={documentGroups}
                  onFieldChange={props.onFieldChange}
                  focusFieldId={focusFieldId}
                  onFocusHandled={clearFocusField}
                />
              ) : (
                <DetailsTab
                  itemType="assessment"
                  fields={props.fields}
                  formValues={props.formValues}
                  documentGroups={documentGroups}
                  onFieldChange={props.onFieldChange}
                  focusFieldId={focusFieldId}
                  onFocusHandled={clearFocusField}
                />
              )}
            </div>
          )}

          {activeTab === "supporting-documents" && (
            <div className="absolute inset-0 overflow-y-auto">
              {props.itemType === "checklist" ? (
                <SupportingDocumentsTab
                  itemType="checklist"
                  items={props.items}
                  documentGroups={documentGroups}
                />
              ) : (
                <SupportingDocumentsTab
                  itemType="assessment"
                  requiredEvidence={props.requiredEvidence}
                  documentGroups={documentGroups}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
