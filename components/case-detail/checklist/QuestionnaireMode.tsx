'use client';

import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useCaseDetailStore } from '@/store/case-detail-store';
import { QuestionnaireQuestion } from '@/types/case-detail';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: QuestionnaireQuestion;
  index: number;
  total: number;
  onAnswer: (answer: unknown) => void;
}

function QuestionCard({ question, index, total, onAnswer }: QuestionCardProps) {
  const isAnswered = question.answer !== undefined;

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-5 transition-all duration-300',
        isAnswered ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
      )}
    >
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-400">
          Question {index + 1} of {total}
        </span>
        {isAnswered && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="w-3 h-3" />
            Answered
          </span>
        )}
      </div>

      {/* Question */}
      <h4 className="text-base font-medium text-gray-900 mb-1">{question.question}</h4>
      {question.questionZh && (
        <p className="text-sm text-gray-500 mb-4">{question.questionZh}</p>
      )}

      {/* Answer Options */}
      <div className="space-y-2">
        {question.type === 'boolean' && (
          <div className="flex gap-2">
            <button
              onClick={() => onAnswer(true)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all',
                question.answer === true
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              )}
            >
              Yes
            </button>
            <button
              onClick={() => onAnswer(false)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all',
                question.answer === false
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              )}
            >
              No
            </button>
          </div>
        )}

        {question.type === 'single-choice' && question.options && (
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={cn(
                  'py-2.5 px-4 rounded-lg border text-sm font-medium transition-all text-left',
                  question.answer === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi-choice' && question.options && (
          <div className="grid grid-cols-2 gap-2">
            {question.options.map((option) => {
              const selected = Array.isArray(question.answer) && question.answer.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const current = Array.isArray(question.answer) ? question.answer : [];
                    const newAnswer = selected
                      ? current.filter((v) => v !== option.value)
                      : [...current, option.value];
                    onAnswer(newAnswer);
                  }}
                  className={cn(
                    'py-2.5 px-4 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-2',
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center',
                      selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    )}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuestionnaireMode() {
  const checklist = useCaseDetailStore((state) => state.checklist);
  const answerQuestion = useCaseDetailStore((state) => state.answerQuestion);
  const evolveChecklist = useCaseDetailStore((state) => state.evolveChecklist);

  // Filter visible questions (considering dependencies)
  const visibleQuestions = checklist.questions.filter((q) => {
    if (!q.dependsOn) return true;
    const dependentQuestion = checklist.questions.find((dq) => dq.id === q.dependsOn?.questionId);
    return dependentQuestion?.answer === q.dependsOn?.value;
  });

  const answeredCount = visibleQuestions.filter((q) => q.answer !== undefined).length;
  const progress = visibleQuestions.length > 0 ? (answeredCount / visibleQuestions.length) * 100 : 0;

  const handleAnswer = (questionId: string, answer: unknown) => {
    answerQuestion(questionId, answer);
    // Check if we should evolve to next stage
    setTimeout(() => evolveChecklist(), 100);
  };

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
          <p className="text-sm text-gray-500">Answer a few questions to customize your checklist</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {answeredCount}/{visibleQuestions.length}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {visibleQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            total={visibleQuestions.length}
            onAnswer={(answer) => handleAnswer(question.id, answer)}
          />
        ))}
      </div>

      {/* Continue hint */}
      {answeredCount === visibleQuestions.length && visibleQuestions.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-4 text-green-600">
          <Check className="w-5 h-5" />
          <span className="font-medium">All questions answered! Your checklist is being generated...</span>
        </div>
      )}
    </div>
  );
}
