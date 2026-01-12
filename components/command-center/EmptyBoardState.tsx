'use client';

import { Rocket, FileCheck, Shield, ArrowRight } from 'lucide-react';
import { useCommandCenterStore } from '@/store/command-center-store';
import { cn } from '@/lib/utils';

interface EmptyBoardStateProps {
  caseName?: string;
}

export function EmptyBoardState({ caseName }: EmptyBoardStateProps) {
  const { openBuildApplicationModal } = useCommandCenterStore();

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          {/* Background circles */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0E4369]/5 to-[#0E4369]/10 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#0E4369]/10 to-[#0E4369]/20" />

          {/* Icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E4369] to-[#0E4369]/80 flex items-center justify-center shadow-lg shadow-[#0E4369]/20">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {caseName ? `Start ${caseName}'s Application` : 'Build Your Application'}
        </h2>

        {/* Description */}
        <p className="text-gray-500 mb-8 leading-relaxed">
          Begin by selecting the visa route and answering a few key questions.
          Our AI will then create a personalized application checklist tailored to your case.
        </p>

        {/* Build Application Button */}
        <button
          onClick={openBuildApplicationModal}
          className={cn(
            'group inline-flex items-center gap-3 px-8 py-4 rounded-xl',
            'bg-gradient-to-r from-[#0E4369] to-[#0E4369]/90',
            'text-white font-medium text-lg',
            'shadow-lg shadow-[#0E4369]/25',
            'hover:shadow-xl hover:shadow-[#0E4369]/30',
            'hover:from-[#0B3654] hover:to-[#0E4369]/95',
            'transition-all duration-300',
            'transform hover:scale-[1.02]'
          )}
        >
          Build Application
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature hints */}
        <div className="mt-12 grid grid-cols-2 gap-6 text-left">
          <FeatureHint
            icon={<FileCheck className="w-5 h-5" />}
            title="Smart Checklist"
            description="AI-generated evidence requirements based on UKVI rules"
          />
          <FeatureHint
            icon={<Shield className="w-5 h-5" />}
            title="Compliance Check"
            description="Automatic validation of 28-day rule and salary thresholds"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureHintProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureHint({ icon, title, description }: FeatureHintProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0E4369]/5 flex items-center justify-center text-[#0E4369]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
