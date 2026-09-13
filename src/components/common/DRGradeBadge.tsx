import React from 'react';
import { DRGrade } from '../../types';

interface DRGradeBadgeProps {
  grade: DRGrade;
  size?: 'sm' | 'md' | 'lg';
  showGradeNumber?: boolean;
}

export const DRGradeBadge: React.FC<DRGradeBadgeProps> = ({
  grade,
  size = 'md',
  showGradeNumber = true,
}) => {
  const configs: Record<DRGrade, { label: string; number: string; bg: string; text: string; border: string }> = {
    NO_DR: {
      label: 'No DR Detected',
      number: 'Grade 0',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    MILD_NPDR: {
      label: 'Mild NPDR',
      number: 'Grade 1',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    MODERATE_NPDR: {
      label: 'Moderate NPDR',
      number: 'Grade 2',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
    },
    SEVERE_NPDR: {
      label: 'Severe NPDR',
      number: 'Grade 3',
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    PDR: {
      label: 'Proliferative DR (PDR)',
      number: 'Grade 4',
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-300',
    },
  };

  const config = configs[grade] || configs.NO_DR;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label}</span>
      {showGradeNumber && (
        <span className="opacity-75 font-normal text-[0.85em]">({config.number})</span>
      )}
    </span>
  );
};
