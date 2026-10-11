import React, { useState, useMemo } from 'react';
import type { Complaint, ComplaintStatus, Category } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { PlusCircle, MapPin, Calendar, ChevronRight, Inbox, Search, Filter, History, Check } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  categories: Category[];
  onOpenReportModal: () => void;
  onSelectComplaint: (c: Complaint) => void;
  userName: string;
}

const statusSteps: { key: ComplaintStatus; label: string }[] = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
];

const getStepIndex = (status: ComplaintStatus) => statusSteps.findIndex((s) => s.key === status);

export const CitizenDashboard: React.FC<Props> = ({
  complaints,
  categories,
  onOpenReportModal,
  onSelectComplaint,
  userName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Derived citizen stats
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(
      (c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
    ).length;
    const inProgress = complaints.filter(
      (c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS'
    ).length;
    const resolved = complaints.filter(
      (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
    ).length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesCategory = !categoryFilter || c.categoryId.toString() === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-7">
      {/* Overview & Quick Action */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="civic-eyebrow">Resident services</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[28px]">
              Welcome, {userName.split(' ')[0]}
            </h1>
            <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
              Report local infrastructure problems and follow the updates recorded by your municipal team.
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="civic-primary-button shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a problem</span>
          </button>
        </div>

        {/* Real-data activity summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#E2E8F0]">
          <div className="bg-slate-50/70 p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Total Lodged
            </div>
            <div className="text-xl font-bold text-[#111827] mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#B45309] uppercase tracking-wider">
              Awaiting Review
            </div>
            <div className="text-xl font-bold text-[#111827] mt-0.5">{stats.pending}</div>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">
              Field Action
            </div>
            <div className="text-xl font-bold text-[#111827] mt-0.5">{stats.inProgress}</div>
          </div>
          <div className="bg-slate-50/70 p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#0F766E] uppercase tracking-wider">
              Resolved / closed
            </div>
            <div className="text-xl font-bold text-[#111827] mt-0.5">{stats.resolved}</div>
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <section aria-labelledby="my-complaints-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="civic-eyebrow">Your activity</div>
            <h2 id="my-complaints-heading" className="mt-1 text-lg font-semibold tracking-tight text-[#111827]">My complaints</h2>
          </div>
          <p className="text-xs text-[#64748B]">{complaints.length} {complaints.length === 1 ? 'record' : 'records'}</p>
        </div>
        {/* Controls bar */}
        <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              aria-label="Search my complaints"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by complaint number, title, or address..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#111827] bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </div>
            <select
              aria-label="Filter my complaints by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
            >
              <option value="">All Statuses</option>
              {statusSteps.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter my complaints by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Complaints Listing */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-3">
            {filteredComplaints.map((c) => {
              const currentStep = getStepIndex(c.status);

              return (
                <article
                  key={c.id}
                  onClick={() => onSelectComplaint(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectComplaint(c); } }}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs hover:border-slate-400/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition-all cursor-pointer space-y-4"
                >
                  {/* Metadata Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-[#111827] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {c.complaintNumber}
                      </span>
                      <span className="text-xs font-medium text-[#475569] bg-slate-50 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {c.categoryName}
                      </span>
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Submitted {new Date(c.createdAt).toLocaleDateString()} · updated {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {c.imageUrl && (
                      <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-[#E2E8F0]">
                        <img
                          src={c.imageUrl}
                          alt="Reported problem"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-[#111827] break-words">{c.title}</h3>
                      <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1 pt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Lifecycle Stepper */}
                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
                        Progress recorded
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        Stage {currentStep + 1} of {statusSteps.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {statusSteps.map((step, idx) => {
                        const isCurrent = idx === currentStep;
                        const historyEvent = c.history?.find((event) => event.newStatus === step.key);
                        const isRecorded = Boolean(historyEvent) || (step.key === 'SUBMITTED' && Boolean(c.createdAt));
                        const isDone = isRecorded && !isCurrent;

                        return (
                          <div
                            key={step.key}
                            className={`p-2 rounded-lg border text-center transition-colors ${
                              isCurrent
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : isDone
                                ? 'bg-teal-50/70 border-teal-200 text-[#0F766E]'
                                : 'bg-slate-50 border-[#E2E8F0] text-[#64748B]'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 text-[11px] font-medium truncate">
                              {isDone && <Check className="w-3 h-3 text-[#0F766E] shrink-0" />}
                              <span className="truncate">{step.label}</span>
                            </div>
                            {(historyEvent?.createdAt || (step.key === 'SUBMITTED' ? c.createdAt : undefined)) && (
                              <span className={`mt-1 block text-[10px] ${isCurrent ? 'text-slate-300' : isDone ? 'text-teal-700' : 'text-slate-500'}`}>
                                {new Date(historyEvent?.createdAt || c.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card footer action */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-[#64748B]">
                      {c.departmentName ? `Assigned: ${c.departmentName}` : 'Awaiting Department Assignment'}
                    </span>
                    <span className="font-medium text-[#2563EB] hover:text-blue-800 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail & Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-[#64748B] flex items-center justify-center mx-auto">
              <Inbox className="w-5 h-5 stroke-1" />
            </div>
            <div className="text-sm font-semibold text-[#111827]">
              {complaints.length === 0 ? 'No complaints lodged yet' : 'No matching complaints found'}
            </div>
            <p className="text-xs text-[#475569] max-w-sm mx-auto">
              {complaints.length === 0
                ? 'Report local civic problems such as potholes, uncollected garbage, or water leakage to alert municipal authorities.'
                : 'Try adjusting your search query or filters to find the complaint.'}
            </p>
            {complaints.length === 0 && (
              <button
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#111827] hover:bg-slate-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Lodge First Complaint</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
