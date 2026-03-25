'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  trackColor?: string;
}

interface DualCircularProgressProps {
  ocrValue: number;
  formFillValue: number;
  size?: number;
  className?: string;
  ocrColor?: string;
  formFillColor?: string;
  trackColor?: string;
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  showLabel = true,
  color = '#0E4369',
  trackColor = '#E5E7EB',
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-semibold text-gray-700">
          {Math.round(normalizedValue)}%
        </span>
      )}
    </div>
  );
}

export function DualCircularProgress({
  ocrValue,
  formFillValue,
  size = 80,
  className,
  ocrColor = '#10B981',
  formFillColor = '#D4A96A',
  trackColor = '#E5E7EB',
}: DualCircularProgressProps) {
  const outerStroke = 5;
  const innerStroke = 4;
  const gap = 6;

  const ocrNorm = Math.min(100, Math.max(0, ocrValue));
  const ffNorm = Math.min(100, Math.max(0, formFillValue));

  const outerRadius = (size - outerStroke) / 2;
  const innerRadius = outerRadius - gap - innerStroke / 2;

  const outerCirc = outerRadius * 2 * Math.PI;
  const innerCirc = innerRadius * 2 * Math.PI;

  const outerOffset = outerCirc - (ocrNorm / 100) * outerCirc;
  const innerOffset = innerCirc - (ffNorm / 100) * innerCirc;

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke={trackColor} strokeWidth={outerStroke} />
        {/* Outer arc — OCR */}
        <circle
          cx={cx} cy={cy} r={outerRadius} fill="none"
          stroke={ocrColor} strokeWidth={outerStroke} strokeLinecap="round"
          strokeDasharray={outerCirc} strokeDashoffset={outerOffset}
          className="transition-all duration-300 ease-out"
        />
        {/* Inner track */}
        <circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke={trackColor} strokeWidth={innerStroke} />
        {/* Inner arc — Form Fill */}
        <circle
          cx={cx} cy={cy} r={innerRadius} fill="none"
          stroke={formFillColor} strokeWidth={innerStroke} strokeLinecap="round"
          strokeDasharray={innerCirc} strokeDashoffset={innerOffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {/* Center labels */}
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-[11px] font-bold tabular-nums" style={{ color: ocrColor }}>
          {Math.round(ocrNorm)}%
        </span>
        <span className="text-[8px] text-stone-400 mt-0.5 mb-0.5">·</span>
        <span className="text-[10px] font-semibold tabular-nums" style={{ color: formFillColor }}>
          {Math.round(ffNorm)}%
        </span>
      </div>
    </div>
  );
}
