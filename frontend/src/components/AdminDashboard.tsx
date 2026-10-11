import React from 'react';
import type { Complaint, Category, DashboardStats, ComplaintStatus, Priority } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Search, RotateCcw, ChevronRight, Inbox, Filter, X } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  categories: Category[];
  stats: DashboardStats | null;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedPriority: string;
  setSelectedPriority: (p: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefresh: () => void;
  onSelectComplaint: (c: Complaint) => void;
  loading?: boolean;
}

export const AdminDashboard: React.FC<Props> = ({
  complaints,
  categories,
  stats,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  searchQuery,
  setSearchQuery,
  onRefresh,
  onSelectComplaint,
  loading = false,
}) => {
  const hasActiveFilters = Boolean(
    selectedStatus || selectedCategory || selectedPriority || searchQuery
  );

  const clearAllFilters = () => {
    setSelectedStatus('');
    setSelectedCategory('');
    setSelectedPriority('');
    setSearchQuery('');
  };

  const handleMetricClick = (statusKey: string) => {
    setSelectedCategory('');
    setSelectedPriority('');
    setSearchQuery('');
    if (selectedStatus === statusKey) {
      setSelectedStatus(''); // Toggle off
    } else {
      setSelectedStatus(statusKey);
    }
  };

  return (
    <div className="space-y-6">
      <div id="overview" className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="civic-eyebrow">Municipal operations</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">Complaint management</h1>
          <p className="mt-1 text-sm text-[#64748B]">Review reports, coordinate field teams, and record progress.</p>
        </div>
        <nav aria-label="Operations sections" className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1 text-xs font-medium">
          <a href="#overview" className="rounded-md bg-slate-100 px-3 py-2 text-slate-900">Overview</a>
          <a href="#complaint-register" className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900">Complaints</a>
        </nav>
      </div>
      {/* Overview operational metrics (Clickable filters) */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total */}
          <button
            type="button"
            onClick={clearAllFilters}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === ''
                ? 'bg-white border-[#111827] shadow-sm ring-1 ring-[#111827]'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Total Logged
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">{stats.total}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">All persistent records</div>
          </button>

          {/* 2. Submitted */}
          <button
            type="button"
            onClick={() => handleMetricClick('PENDING')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'PENDING'
                ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
              Pending review
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
              {stats.pending}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Submitted or under review</div>
          </button>

          {/* 3. Assigned */}
          <button
            type="button"
            onClick={() => handleMetricClick('ASSIGNED')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'ASSIGNED'
                ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
              Assigned
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
              {stats.assigned ?? 0}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Allocated to field dept</div>
          </button>

          {/* 4. In Progress */}
          <button
            type="button"
            onClick={() => handleMetricClick('IN_PROGRESS')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'IN_PROGRESS'
                ? 'bg-white border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">
              In Progress
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
              {stats.inProgress}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Active on-site repair</div>
          </button>

          {/* 5. Resolved */}
          <button
            type="button"
            onClick={() => handleMetricClick('RESOLVED')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'RESOLVED'
                ? 'bg-white border-[#0F766E] shadow-sm ring-1 ring-[#0F766E]'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#0F766E] uppercase tracking-wider">
              Resolved
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
              {stats.resolved}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Repairs completed</div>
          </button>

          {/* 6. Closed */}
          <button
            type="button"
            onClick={() => handleMetricClick('CLOSED')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedStatus === 'CLOSED'
                ? 'bg-white border-slate-500 shadow-sm ring-1 ring-slate-500'
                : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Closed
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#111827] mt-1">
              {stats.closed}
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Verified & archived</div>
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              aria-label="Search complaints"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by complaint identifier, title, citizen name, or street location..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#111827] bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
              <Filter className="w-3 h-3" />
              <span>Filters:</span>
            </div>

            <select
              aria-label="Filter by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending review</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
            >
              <option value="">All Urgencies</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <button
              onClick={onRefresh}
              aria-label="Refresh complaint records"
              className="p-1.5 text-[#64748B] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
            <span className="text-[11px] text-[#64748B]">Active Filters:</span>
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[#111827] text-[11px]">
                Status: {selectedStatus === 'PENDING' ? 'Pending review' : selectedStatus.replace('_', ' ').toLowerCase()}
                <button type="button" aria-label="Remove status filter" onClick={() => setSelectedStatus('')} className="rounded p-0.5 hover:text-red-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[#111827] text-[11px]">
                Category: {categories.find((c) => c.id.toString() === selectedCategory)?.name}
                <button type="button" aria-label="Remove category filter" onClick={() => setSelectedCategory('')} className="rounded p-0.5 hover:text-red-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            {selectedPriority && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[#111827] text-[11px]">
                Urgency: {selectedPriority}
                <button type="button" aria-label="Remove priority filter" onClick={() => setSelectedPriority('')} className="rounded p-0.5 hover:text-red-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[#111827] text-[11px]">
                Query: "{searchQuery}"
                <button type="button" aria-label="Clear search query" onClick={() => setSearchQuery('')} className="rounded p-0.5 hover:text-red-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              type="button"
              className="text-[11px] text-[#2563EB] hover:underline ml-auto cursor-pointer font-medium"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Operational Complaints Table */}
      <div id="complaint-register" className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[11px] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Problem / Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reporting Citizen</th>
                <th className="py-3 px-4">Field Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#111827]">
              {loading && complaints.length === 0 ? (
                <tr><td colSpan={9} role="status" className="py-16 text-center text-sm text-[#64748B]">Loading complaint records…</td></tr>
              ) : complaints.length > 0 ? (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium whitespace-nowrap">
                      {c.complaintNumber}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-[#111827] truncate">{c.title}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{c.address}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[#475569] font-medium">{c.categoryName}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority as Priority} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status as ComplaintStatus} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#111827]">{c.citizenName}</div>
                      <div className="text-[10px] text-[#64748B]">{c.citizenPhone || c.citizenEmail}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {c.departmentName ? (
                        <div>
                          <div className="text-[#111827] font-medium">{c.departmentName}</div>
                          {c.assignedOfficer && (
                            <div className="text-[10px] text-[#64748B]">Officer: {c.assignedOfficer}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#64748B] text-[11px] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#64748B]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectComplaint(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-[#111827] hover:bg-slate-100 border border-[#E2E8F0] transition-colors cursor-pointer"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3 text-[#64748B]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#64748B]">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <div className="text-xs font-semibold text-[#111827]">
                      {hasActiveFilters ? 'No matching complaints found' : 'No complaints logged in system'}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {hasActiveFilters ? (
                        <button
                          onClick={clearAllFilters}
                          className="text-[#2563EB] hover:underline cursor-pointer font-medium"
                        >
                          Clear active filters to view all records
                        </button>
                      ) : (
                        'Reports lodged by citizens will populate here for municipal review.'
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
