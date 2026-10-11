import React from 'react';
import type { Priority } from '../types';

interface Props {
  priority: Priority;
  size?: 'sm' | 'md';
}

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; border: string }> = {
  LOW: {
    label: 'Low Urgency',
    bg: 'bg-slate-50',
    text: 'text-[#475569]',
    border: 'border-slate-200',
  },
  MEDIUM: {
    label: 'Medium Urgency',
    bg: 'bg-blue-50',
    text: 'text-[#2563EB]',
    border: 'border-blue-200',
  },
  HIGH: {
    label: 'High Urgency',
    bg: 'bg-amber-50',
    text: 'text-[#B45309]',
    border: 'border-amber-200',
  },
  CRITICAL: {
    label: 'Critical Urgency',
    bg: 'bg-red-50',
    text: 'text-[#B91C1C]',
    border: 'border-red-200',
  },
};

export const PriorityBadge: React.FC<Props> = ({ priority, size = 'sm' }) => {
  const config = priorityConfig[priority] || {
    label: priority,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  };

  const isMd = size === 'md';

  return (
    <span
      className={`inline-flex items-center font-medium tracking-tight rounded border ${config.bg} ${config.text} ${config.border} ${
        isMd ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
      }`}
    >
      {config.label}
    </span>
  );
};
