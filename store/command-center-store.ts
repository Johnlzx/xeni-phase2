import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  ApplicationBuildState,
  CommandCenterUIState,
  EvidenceModule,
  Issue,
  ExtractedField,
  FieldSource,
  ModuleStatus,
  IssueSeverity,
} from '@/types/command-center';
import { linkDocumentsToModules, type DocumentGroup } from '@/data/evidence-modules';

// =============================================================================
// Store Interface
// =============================================================================

interface CommandCenterStore {
  // Application Build State
  application: ApplicationBuildState | null;

  // UI State
  ui: CommandCenterUIState;

  // Application Actions
  initializeApplication: (caseId: string) => void;
  setVisaRoute: (routeId: string, routeName: string) => void;
  setTriageAnswer: (questionId: string, value: unknown) => void;
  completeTriageStep: () => void;
  setModules: (modules: EvidenceModule[]) => void;
  linkDocuments: (documentGroups: DocumentGroup[]) => void;
  updateModuleStatus: (moduleId: string, status: ModuleStatus) => void;
  addIssue: (moduleId: string, issue: Issue) => void;
  resolveIssue: (issueId: string, resolvedBy: string) => void;
  verifyField: (moduleId: string, fieldId: string, userId: string) => void;
  updateFieldValue: (moduleId: string, fieldId: string, value: unknown) => void;
  resetApplication: () => void;

  // UI Actions
  setLeftPanelCollapsed: (collapsed: boolean) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  setActiveModule: (moduleId: string | null) => void;
  setActiveSlot: (slotId: string | null) => void;
  setActiveDocument: (documentId: string | null) => void;
  setHighlightedField: (fieldId: string | null, source: FieldSource | null) => void;
  clearHighlight: () => void;

  // Modal Actions
  openBuildApplicationModal: () => void;
  closeBuildApplicationModal: () => void;
  setBuildApplicationStep: (step: 'route' | 'triage' | 'complete') => void;
  openVerificationWorkbench: (moduleId: string) => void;
  closeVerificationWorkbench: () => void;
  openIssueTriage: () => void;
  closeIssueTriage: () => void;
  openCaseProfile: () => void;
  closeCaseProfile: () => void;
  openClientRequestModal: () => void;
  closeClientRequestModal: () => void;

  // Search & Filter
  setModuleSearchQuery: (query: string) => void;
  setIssueFilter: (filter: IssueSeverity | 'all') => void;

  // Computed Helpers
  getModuleById: (moduleId: string) => EvidenceModule | undefined;
  getAllIssues: () => Issue[];
  getBlockingIssues: () => Issue[];
}

// =============================================================================
// Initial State
// =============================================================================

const initialUIState: CommandCenterUIState = {
  leftPanelCollapsed: false,
  rightPanelCollapsed: true, // Default collapsed
  activeModuleId: null,
  activeSlotId: null,
  activeDocumentId: null,
  highlightedFieldId: null,
  highlightedSource: null,
  buildApplicationModalOpen: false,
  buildApplicationStep: 'route',
  verificationWorkbenchOpen: false,
  issueTriageCenterOpen: false,
  caseProfileDrawerOpen: false,
  clientRequestModalOpen: false,
  moduleSearchQuery: '',
  issueFilter: 'all',
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useCommandCenterStore = create<CommandCenterStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        application: null,
        ui: initialUIState,

        // =============================================================================
        // Application Actions
        // =============================================================================

        initializeApplication: (caseId: string) => {
          set({
            application: {
              caseId,
              visaRouteId: null,
              visaRouteName: null,
              triageAnswers: {},
              triageCompleted: false,
              modules: [],
              totalModules: 0,
              readyModules: 0,
              blockingIssuesCount: 0,
              warningIssuesCount: 0,
              isSubmittable: false,
              startedAt: new Date().toISOString(),
              lastUpdatedAt: new Date().toISOString(),
            },
          });
        },

        setVisaRoute: (routeId: string, routeName: string) => {
          set((state) => ({
            application: state.application
              ? {
                  ...state.application,
                  visaRouteId: routeId,
                  visaRouteName: routeName,
                  lastUpdatedAt: new Date().toISOString(),
                }
              : null,
          }));
        },

        setTriageAnswer: (questionId: string, value: unknown) => {
          set((state) => ({
            application: state.application
              ? {
                  ...state.application,
                  triageAnswers: {
                    ...state.application.triageAnswers,
                    [questionId]: value,
                  },
                  lastUpdatedAt: new Date().toISOString(),
                }
              : null,
          }));
        },

        completeTriageStep: () => {
          set((state) => ({
            application: state.application
              ? {
                  ...state.application,
                  triageCompleted: true,
                  lastUpdatedAt: new Date().toISOString(),
                }
              : null,
            ui: {
              ...state.ui,
              buildApplicationStep: 'complete',
            },
          }));
        },

        setModules: (modules: EvidenceModule[]) => {
          const readyModules = modules.filter((m) => m.status === 'ready').length;
          const blockingIssues = modules.flatMap((m) =>
            m.issues.filter((i) => i.severity === 'critical')
          );
          const warningIssues = modules.flatMap((m) =>
            m.issues.filter((i) => i.severity === 'warning')
          );

          set((state) => ({
            application: state.application
              ? {
                  ...state.application,
                  modules,
                  totalModules: modules.length,
                  readyModules,
                  blockingIssuesCount: blockingIssues.length,
                  warningIssuesCount: warningIssues.length,
                  isSubmittable: blockingIssues.length === 0 && readyModules === modules.length,
                  lastUpdatedAt: new Date().toISOString(),
                }
              : null,
          }));
        },

        linkDocuments: (documentGroups: DocumentGroup[]) => {
          set((state) => {
            if (!state.application || !state.application.modules.length) return state;

            const updatedModules = linkDocumentsToModules(
              state.application.modules,
              documentGroups
            );

            const readyModules = updatedModules.filter((m) => m.status === 'ready').length;
            const blockingIssues = updatedModules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'critical')
            );

            return {
              application: {
                ...state.application,
                modules: updatedModules,
                readyModules,
                isSubmittable: blockingIssues.length === 0 && readyModules === updatedModules.length,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        updateModuleStatus: (moduleId: string, status: ModuleStatus) => {
          set((state) => {
            if (!state.application) return state;

            const modules = state.application.modules.map((m) =>
              m.id === moduleId ? { ...m, status } : m
            );

            const readyModules = modules.filter((m) => m.status === 'ready').length;
            const blockingIssues = modules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'critical')
            );

            return {
              application: {
                ...state.application,
                modules,
                readyModules,
                isSubmittable: blockingIssues.length === 0 && readyModules === modules.length,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        addIssue: (moduleId: string, issue: Issue) => {
          set((state) => {
            if (!state.application) return state;

            const modules = state.application.modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    issues: [...m.issues, issue],
                    status: issue.severity === 'critical' ? ('critical-issue' as ModuleStatus) : m.status,
                  }
                : m
            );

            const blockingIssues = modules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'critical' && !i.resolvedAt)
            );
            const warningIssues = modules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'warning' && !i.resolvedAt)
            );

            return {
              application: {
                ...state.application,
                modules,
                blockingIssuesCount: blockingIssues.length,
                warningIssuesCount: warningIssues.length,
                isSubmittable: false,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        resolveIssue: (issueId: string, resolvedBy: string) => {
          set((state) => {
            if (!state.application) return state;

            const modules = state.application.modules.map((m) => ({
              ...m,
              issues: m.issues.map((i) =>
                i.id === issueId
                  ? { ...i, resolvedAt: new Date().toISOString(), resolvedBy }
                  : i
              ),
            }));

            // Recalculate module status after resolving issue
            const updatedModules = modules.map((m) => {
              const unresolvedCritical = m.issues.filter(
                (i) => i.severity === 'critical' && !i.resolvedAt
              );
              const unresolvedWarning = m.issues.filter(
                (i) => i.severity === 'warning' && !i.resolvedAt
              );

              let status: ModuleStatus = m.status;
              if (unresolvedCritical.length > 0) {
                status = 'critical-issue';
              } else if (unresolvedWarning.length > 0) {
                status = 'review-needed';
              } else if (m.status === 'critical-issue' || m.status === 'review-needed') {
                // If all issues resolved, check if module is ready
                const allVerified = m.slots.every((s) =>
                  s.extractedFields.every((f) => f.isVerified)
                );
                status = allVerified ? 'ready' : 'in-progress';
              }

              return { ...m, status };
            });

            const blockingIssues = updatedModules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'critical' && !i.resolvedAt)
            );
            const warningIssues = updatedModules.flatMap((m) =>
              m.issues.filter((i) => i.severity === 'warning' && !i.resolvedAt)
            );
            const readyModules = updatedModules.filter((m) => m.status === 'ready').length;

            return {
              application: {
                ...state.application,
                modules: updatedModules,
                readyModules,
                blockingIssuesCount: blockingIssues.length,
                warningIssuesCount: warningIssues.length,
                isSubmittable: blockingIssues.length === 0 && readyModules === updatedModules.length,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        verifyField: (moduleId: string, fieldId: string, userId: string) => {
          set((state) => {
            if (!state.application) return state;

            const modules = state.application.modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    slots: m.slots.map((s) => ({
                      ...s,
                      extractedFields: s.extractedFields.map((f) =>
                        f.id === fieldId
                          ? {
                              ...f,
                              isVerified: true,
                              verifiedBy: userId,
                              verifiedAt: new Date().toISOString(),
                            }
                          : f
                      ),
                    })),
                  }
                : m
            );

            return {
              application: {
                ...state.application,
                modules,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        updateFieldValue: (moduleId: string, fieldId: string, value: unknown) => {
          set((state) => {
            if (!state.application) return state;

            const modules = state.application.modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    slots: m.slots.map((s) => ({
                      ...s,
                      extractedFields: s.extractedFields.map((f) =>
                        f.id === fieldId
                          ? {
                              ...f,
                              value,
                              displayValue: String(value),
                              isVerified: false, // Reset verification on edit
                            }
                          : f
                      ),
                    })),
                  }
                : m
            );

            return {
              application: {
                ...state.application,
                modules,
                lastUpdatedAt: new Date().toISOString(),
              },
            };
          });
        },

        resetApplication: () => {
          set({
            application: null,
            ui: initialUIState,
          });
        },

        // =============================================================================
        // UI Actions
        // =============================================================================

        setLeftPanelCollapsed: (collapsed: boolean) => {
          set((state) => ({
            ui: { ...state.ui, leftPanelCollapsed: collapsed },
          }));
        },

        setRightPanelCollapsed: (collapsed: boolean) => {
          set((state) => ({
            ui: { ...state.ui, rightPanelCollapsed: collapsed },
          }));
        },

        setActiveModule: (moduleId: string | null) => {
          set((state) => ({
            ui: { ...state.ui, activeModuleId: moduleId },
          }));
        },

        setActiveSlot: (slotId: string | null) => {
          set((state) => ({
            ui: { ...state.ui, activeSlotId: slotId },
          }));
        },

        setActiveDocument: (documentId: string | null) => {
          set((state) => ({
            ui: { ...state.ui, activeDocumentId: documentId },
          }));
        },

        setHighlightedField: (fieldId: string | null, source: FieldSource | null) => {
          set((state) => ({
            ui: {
              ...state.ui,
              highlightedFieldId: fieldId,
              highlightedSource: source,
            },
          }));
        },

        clearHighlight: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              highlightedFieldId: null,
              highlightedSource: null,
            },
          }));
        },

        // Modal Actions
        openBuildApplicationModal: () => {
          set((state) => ({
            ui: { ...state.ui, buildApplicationModalOpen: true, buildApplicationStep: 'route' },
          }));
        },

        closeBuildApplicationModal: () => {
          set((state) => ({
            ui: { ...state.ui, buildApplicationModalOpen: false },
          }));
        },

        setBuildApplicationStep: (step: 'route' | 'triage' | 'complete') => {
          set((state) => ({
            ui: { ...state.ui, buildApplicationStep: step },
          }));
        },

        openVerificationWorkbench: (moduleId: string) => {
          set((state) => ({
            ui: {
              ...state.ui,
              verificationWorkbenchOpen: true,
              activeModuleId: moduleId,
            },
          }));
        },

        closeVerificationWorkbench: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              verificationWorkbenchOpen: false,
              highlightedFieldId: null,
              highlightedSource: null,
            },
          }));
        },

        openIssueTriage: () => {
          set((state) => ({
            ui: { ...state.ui, issueTriageCenterOpen: true },
          }));
        },

        closeIssueTriage: () => {
          set((state) => ({
            ui: { ...state.ui, issueTriageCenterOpen: false },
          }));
        },

        openCaseProfile: () => {
          set((state) => ({
            ui: { ...state.ui, caseProfileDrawerOpen: true },
          }));
        },

        closeCaseProfile: () => {
          set((state) => ({
            ui: { ...state.ui, caseProfileDrawerOpen: false },
          }));
        },

        openClientRequestModal: () => {
          set((state) => ({
            ui: { ...state.ui, clientRequestModalOpen: true },
          }));
        },

        closeClientRequestModal: () => {
          set((state) => ({
            ui: { ...state.ui, clientRequestModalOpen: false },
          }));
        },

        // Search & Filter
        setModuleSearchQuery: (query: string) => {
          set((state) => ({
            ui: { ...state.ui, moduleSearchQuery: query },
          }));
        },

        setIssueFilter: (filter: IssueSeverity | 'all') => {
          set((state) => ({
            ui: { ...state.ui, issueFilter: filter },
          }));
        },

        // =============================================================================
        // Computed Helpers
        // =============================================================================

        getModuleById: (moduleId: string) => {
          const state = get();
          return state.application?.modules.find((m) => m.id === moduleId);
        },

        getAllIssues: () => {
          const state = get();
          if (!state.application) return [];
          return state.application.modules.flatMap((m) => m.issues);
        },

        getBlockingIssues: () => {
          const state = get();
          if (!state.application) return [];
          return state.application.modules.flatMap((m) =>
            m.issues.filter((i) => i.severity === 'critical' && !i.resolvedAt)
          );
        },
      }),
      {
        name: 'command-center-storage',
        partialize: (state) => ({
          // Only persist application state, not UI state
          application: state.application,
        }),
      }
    ),
    { name: 'CommandCenterStore' }
  )
);

// =============================================================================
// Selector Hooks (for optimized re-renders)
// =============================================================================

export const useApplication = () =>
  useCommandCenterStore((state) => state.application);

export const useUIState = () =>
  useCommandCenterStore((state) => state.ui);

export const useActiveModule = () => {
  const application = useCommandCenterStore((state) => state.application);
  const activeModuleId = useCommandCenterStore((state) => state.ui.activeModuleId);
  return application?.modules.find((m) => m.id === activeModuleId);
};

export const useHighlightedFieldId = () =>
  useCommandCenterStore((state) => state.ui.highlightedFieldId);

export const useHighlightedSource = () =>
  useCommandCenterStore((state) => state.ui.highlightedSource);

export const useModules = () =>
  useCommandCenterStore((state) => state.application?.modules ?? []);

export const useBlockingIssuesCount = () =>
  useCommandCenterStore((state) => state.application?.blockingIssuesCount ?? 0);

export const useIsSubmittable = () =>
  useCommandCenterStore((state) => state.application?.isSubmittable ?? false);
