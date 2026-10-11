import React from 'react';
import type { ComplaintStatus } from '../types';

interface Props {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ComplaintStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  SUBMITTED: {
    label: 'Submitted',
    dot: 'bg-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    dot: 'bg-[#B45309]',
    bg: 'bg-amber-50',
    text: 'text-[#B45309]',
    border: 'border-amber-200',
  },
  ASSIGNED: {
    label: 'Assigned',
    dot: 'bg-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-[#2563EB]',
    bg: 'bg-sky-50',
    text: 'text-[#2563EB]',
    border: 'border-sky-200',
  },
  RESOLVED: {
    label: 'Resolved',
    dot: 'bg-[#0F766E]',
    bg: 'bg-teal-50',
    text: 'text-[#0F766E]',
    border: 'border-teal-200',
  },
  CLOSED: {
    label: 'Closed',
    dot: 'bg-slate-400',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

export const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] || {
    label: status,
    dot: 'bg-slate-400',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  };

  const isMd = size === 'md';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-tight rounded border ${config.bg} ${config.text} ${config.border} ${
        isMd ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
      }`}
    >
      <span className={`rounded-full shrink-0 ${config.dot} ${isMd ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
      <span>{config.label}</span>
    </span>
  );
};
