'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Check,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VISA_ROUTES, getVisaRouteById } from '@/data/visa-routes';
import { generateModulesFromRoute } from '@/data/evidence-modules';
import { useCommandCenterStore } from '@/store/command-center-store';
import type { VisaRoute, TriageQuestion } from '@/types/command-center';

// Category icons mapping
const CATEGORY_ICONS: Record<VisaRoute['category'], React.ReactNode> = {
  work: <Briefcase className="w-5 h-5" />,
  study: <GraduationCap className="w-5 h-5" />,
  family: <Heart className="w-5 h-5" />,
  settlement: <Home className="w-5 h-5" />,
  visit: <Plane className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<VisaRoute['category'], string> = {
  work: 'bg-blue-50 text-blue-600 border-blue-200',
  study: 'bg-purple-50 text-purple-600 border-purple-200',
  family: 'bg-pink-50 text-pink-600 border-pink-200',
  settlement: 'bg-green-50 text-green-600 border-green-200',
  visit: 'bg-amber-50 text-amber-600 border-amber-200',
};

export function BuildApplicationModal() {
  const {
    ui,
    closeBuildApplicationModal,
    setBuildApplicationStep,
    setVisaRoute,
    setTriageAnswer,
    completeTriageStep,
    setModules,
    application,
  } = useCommandCenterStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [triageAnswers, setTriageAnswersLocal] = useState<Record<string, unknown>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedRoute = selectedRouteId ? getVisaRouteById(selectedRouteId) : null;

  // Filter visa routes by search
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return VISA_ROUTES;
    const query = searchQuery.toLowerCase();
    return VISA_ROUTES.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.description.toLowerCase().includes(query) ||
        route.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group routes by category
  const groupedRoutes = useMemo(() => {
    const groups: Record<VisaRoute['category'], VisaRoute[]> = {
      work: [],
      study: [],
      family: [],
      settlement: [],
      visit: [],
    };
    filteredRoutes.forEach((route) => {
      groups[route.category].push(route);
    });
    return groups;
  }, [filteredRoutes]);

  // Get visible triage questions (handling dependencies)
  const visibleQuestions = useMemo(() => {
    if (!selectedRoute) return [];
    return selectedRoute.triageQuestions.filter((q) => {
      if (!q.dependsOn) return true;
      return triageAnswers[q.dependsOn.questionId] === q.dependsOn.value;
    });
  }, [selectedRoute, triageAnswers]);

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setTriageAnswersLocal({});
    setBuildApplicationStep('triage');
  };

  const handleAnswerQuestion = (questionId: string, value: unknown) => {
    setTriageAnswersLocal((prev) => ({ ...prev, [questionId]: value }));
    setTriageAnswer(questionId, value);
  };

  const handleBack = () => {
    if (ui.buildApplicationStep === 'triage') {
      setBuildApplicationStep('route');
      setSelectedRouteId(null);
      setTriageAnswersLocal({});
    }
  };

  const handleComplete = async () => {
    if (!selectedRoute) return;

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Set the visa route
    setVisaRoute(selectedRoute.id, selectedRoute.name);

    // Generate modules based on route and triage answers
    const modules = generateModulesFromRoute(selectedRoute.id, triageAnswers);
    setModules(modules);

    // Complete triage
    completeTriageStep();

    setIsGenerating(false);
    closeBuildApplicationModal();
  };

  const allQuestionsAnswered = visibleQuestions.every(
    (q) => triageAnswers[q.id] !== undefined
  );

  const isOpen = ui.buildApplicationModalOpen;
  const currentStep = ui.buildApplicationStep;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeBuildApplicationModal}
      title={currentStep === 'route' ? 'Select Visa Route' : selectedRoute?.name}
      description={
        currentStep === 'route'
          ? 'Choose the immigration route for this application'
          : 'Answer a few questions to customize your evidence checklist'
      }
      size="xl"
      footer={
        currentStep === 'triage' ? (
          <>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!allQuestionsAnswered || isGenerating}
              className={cn(
                'px-5 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2',
                allQuestionsAnswered && !isGenerating
                  ? 'bg-[#0E4369] hover:bg-[#0B3654]'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Checklist
                </>
              )}
            </button>
          </>
        ) : undefined
      }
    >
      <div className="py-4">
        {currentStep === 'route' && (
          <RouteSelectionStep
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            groupedRoutes={groupedRoutes}
            onSelectRoute={handleSelectRoute}
          />
        )}

        {currentStep === 'triage' && selectedRoute && (
          <TriageStep
            questions={visibleQuestions}
            answers={triageAnswers}
            onAnswer={handleAnswerQuestion}
          />
        )}
      </div>
    </Modal>
  );
}

// =============================================================================
// Route Selection Step
// =============================================================================

interface RouteSelectionStepProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  groupedRoutes: Record<VisaRoute['category'], VisaRoute[]>;
  onSelectRoute: (routeId: string) => void;
}

function RouteSelectionStep({
  searchQuery,
  onSearchChange,
  groupedRoutes,
  onSelectRoute,
}: RouteSelectionStepProps) {
  const categoryLabels: Record<VisaRoute['category'], string> = {
    work: 'Work',
    study: 'Study',
    family: 'Family',
    settlement: 'Settlement',
    visit: 'Visit',
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search visa routes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0E4369] focus:ring-2 focus:ring-[#0E4369]/10 outline-none transition-all text-sm"
        />
      </div>

      {/* Route List */}
      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-1">
        {Object.entries(groupedRoutes).map(([category, routes]) => {
          if (routes.length === 0) return null;
          return (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {categoryLabels[category as VisaRoute['category']]}
              </h3>
              <div className="space-y-2">
                {routes.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    onClick={() => onSelectRoute(route.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RouteCardProps {
  route: VisaRoute;
  onClick: () => void;
}

function RouteCard({ route, onClick }: RouteCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#0E4369]/30 hover:bg-[#0E4369]/5 transition-all text-left group"
    >
      <div
        className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border',
          CATEGORY_COLORS[route.category]
        )}
      >
        {CATEGORY_ICONS[route.category]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{route.name}</span>
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {route.code}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{route.description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0E4369] transition-colors" />
    </button>
  );
}

// =============================================================================
// Triage Step
// =============================================================================

interface TriageStepProps {
  questions: TriageQuestion[];
  answers: Record<string, unknown>;
  onAnswer: (questionId: string, value: unknown) => void;
}

function TriageStep({ questions, answers, onAnswer }: TriageStepProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E4369] text-white text-xs font-semibold flex items-center justify-center">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">{question.question}</p>
              {question.questionZh && (
                <p className="text-xs text-gray-400 mt-0.5">{question.questionZh}</p>
              )}
            </div>
          </div>

          {question.type === 'boolean' && (
            <div className="flex gap-3 ml-9">
              <BooleanOption
                label="Yes"
                selected={answers[question.id] === true}
                onClick={() => onAnswer(question.id, true)}
              />
              <BooleanOption
                label="No"
                selected={answers[question.id] === false}
                onClick={() => onAnswer(question.id, false)}
              />
            </div>
          )}

          {question.type === 'single-choice' && question.options && (
            <div className="grid grid-cols-2 gap-2 ml-9">
              {question.options.map((option) => (
                <ChoiceOption
                  key={option.value}
                  label={option.label}
                  labelZh={option.labelZh}
                  selected={answers[question.id] === option.value}
                  onClick={() => onAnswer(question.id, option.value)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#0E4369]" />
          <p className="text-sm">No additional questions needed for this route.</p>
          <p className="text-xs text-gray-400 mt-1">
            Click "Generate Checklist" to continue.
          </p>
        </div>
      )}
    </div>
  );
}

interface BooleanOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function BooleanOption({ label, selected, onClick }: BooleanOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
        selected
          ? 'border-[#0E4369] bg-[#0E4369]/5 text-[#0E4369]'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {selected && <Check className="w-4 h-4" />}
        {label}
      </div>
    </button>
  );
}

interface ChoiceOptionProps {
  label: string;
  labelZh?: string;
  selected: boolean;
  onClick: () => void;
}

function ChoiceOption({ label, labelZh, selected, onClick }: ChoiceOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-3 rounded-lg border-2 text-left transition-all',
        selected
          ? 'border-[#0E4369] bg-[#0E4369]/5'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
            selected ? 'border-[#0E4369] bg-[#0E4369]' : 'border-gray-300'
          )}
        >
          {selected && <Check className="w-2.5 h-2.5 text-white" />}
        </div>
        <div>
          <span className={cn('text-sm', selected ? 'text-[#0E4369] font-medium' : 'text-gray-700')}>
            {label}
          </span>
          {labelZh && <span className="text-xs text-gray-400 ml-2">{labelZh}</span>}
        </div>
      </div>
    </button>
  );
}
