import React, { useState, useEffect } from 'react';
import type { Complaint, Department, ComplaintStatus, Priority, User } from '../types';
import { complaintApi } from '../services/api';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { LocationViewMap } from './LocationViewMap';
import {
  X,
  Calendar,
  MapPin,
  User as UserIcon,
  Building2,
  History,
  CheckCircle2,
  Send,
  Loader2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  departments: Department[];
  currentUser: User | null;
  onUpdated: (updatedComplaint: Complaint) => void;
  onDeleted: (complaintId: number) => void;
}

type ContentProps = Omit<Props, 'isOpen' | 'complaint'> & { complaint: Complaint };

export const ComplaintDetailsModal: React.FC<Props> = (props) => {
  if (!props.isOpen || !props.complaint) return null;
  return (
    <ComplaintDetailsModalContent
      complaint={props.complaint}
      onClose={props.onClose}
      departments={props.departments}
      currentUser={props.currentUser}
      onUpdated={props.onUpdated}
      onDeleted={props.onDeleted}
    />
  );
};

const ComplaintDetailsModalContent: React.FC<ContentProps> = ({
  onClose,
  complaint: initialComplaint,
  departments,
  currentUser,
  onUpdated,
  onDeleted,
}) => {
  const [activeComplaint, setActiveComplaint] = useState<Complaint>(initialComplaint);
  const [loadingFresh, setLoadingFresh] = useState(true);
  const [detailLoadError, setDetailLoadError] = useState<string | null>(null);

  // Authority actions state
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(initialComplaint.status);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>(initialComplaint.priority);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>(
    initialComplaint.departmentId || ''
  );
  const [assignedOfficer, setAssignedOfficer] = useState(initialComplaint.assignedOfficer || '');
  const [assignmentRemarks, setAssignmentRemarks] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isAuthority = currentUser?.role === 'ROLE_AUTHORITY';

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submittingAction) onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, submittingAction]);

  // Fetch fresh complaint details (with complete status history) when opened
  useEffect(() => {
    let isMounted = true;
    complaintApi
      .getById(initialComplaint.id)
      .then((fresh) => {
        if (isMounted) {
          setActiveComplaint(fresh);
          setSelectedStatus(fresh.status);
          setSelectedPriority(fresh.priority);
          setSelectedDepartmentId(fresh.departmentId || '');
          setAssignedOfficer(fresh.assignedOfficer || '');
        }
      })
      .catch((err) => {
        console.error('Failed to load fresh complaint details:', err);
        if (isMounted) setDetailLoadError('The latest complaint history could not be loaded. The list data is shown instead.');
      })
      .finally(() => {
        if (isMounted) setLoadingFresh(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialComplaint.id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === 'CLOSED' && activeComplaint.status !== 'CLOSED' &&
        !window.confirm('Close this complaint? It will be marked as archived in the municipal register.')) return;
    setSubmittingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const updated = await complaintApi.updateStatus(activeComplaint.id, {
        status: selectedStatus,
        remarks: statusRemarks.trim() || undefined,
      });
      setActiveComplaint(updated);
      onUpdated(updated);
      setStatusRemarks('');
      setActionSuccess(`Status transitioned to ${selectedStatus.replace('_', ' ')}`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleUpdatePriority = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const updated = await complaintApi.updatePriority(activeComplaint.id, {
        priority: selectedPriority,
      });
      setActiveComplaint(updated);
      onUpdated(updated);
      setActionSuccess(`Urgency level set to ${selectedPriority}`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAssignDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartmentId) return;
    setSubmittingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const updated = await complaintApi.assign(activeComplaint.id, {
        departmentId: Number(selectedDepartmentId),
        assignedOfficer: assignedOfficer.trim() || undefined,
        remarks: assignmentRemarks.trim() || undefined,
      });
      setActiveComplaint(updated);
      onUpdated(updated);
      setAssignmentRemarks('');
      setActionSuccess('Field department and officer assigned successfully');
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to assign department');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDeleteComplaint = async () => {
    const confirmed = window.confirm(
      `Permanently delete ${activeComplaint.complaintNumber}? This will also remove its status history and cannot be undone.`
    );
    if (!confirmed) return;

    setSubmittingAction(true);
    setActionError(null);
    try {
      await complaintApi.remove(activeComplaint.id);
      onDeleted(activeComplaint.id);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to delete this complaint.');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="civic-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="civic-modal flex flex-col" role="dialog" aria-modal="true" aria-labelledby="complaint-dialog-title">
        {/* Workspace Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-[#111827] font-semibold border border-[#E2E8F0]">
                {activeComplaint.complaintNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-[#475569] font-medium border border-[#E2E8F0]">
                {activeComplaint.categoryName}
              </span>
              <PriorityBadge priority={activeComplaint.priority} size="md" />
              <StatusBadge status={activeComplaint.status} size="md" />
              {loadingFresh && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Syncing...</span>
                </span>
              )}
            </div>
            <h2 id="complaint-dialog-title" className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
              {activeComplaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close complaint details"
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#111827] hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications Bar */}
        {actionSuccess && (
          <div className="bg-teal-50 border-b border-teal-200 px-5 py-2 text-xs text-[#0F766E] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 text-xs text-[#B91C1C] font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B91C1C] shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
        {detailLoadError && (
          <div role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs font-medium text-amber-900">{detailLoadError}</div>
        )}

        {/* Workspace Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details, Evidence, Map */}
            <div className="md:col-span-2 space-y-5">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                  Reported Issue Description
                </h3>
                <p className="text-xs text-[#111827] leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-[#E2E8F0] whitespace-pre-wrap">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Photo Evidence */}
              {activeComplaint.imageUrl && (
                <div>
                  <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Photographic Proof
                  </h3>
                  <div className="rounded-lg overflow-hidden border border-[#E2E8F0] max-h-64 bg-slate-100">
                    <img
                      src={activeComplaint.imageUrl}
                      alt="Complaint attachment"
                      className="w-full h-full object-contain max-h-64"
                    />
                  </div>
                </div>
              )}

              {/* Map & Location */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Geographic Location
                  </h3>
                  <span className="text-xs text-[#475569] flex items-center gap-1 truncate max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    <span className="truncate">{activeComplaint.address}</span>
                  </span>
                </div>
                {activeComplaint.latitude && activeComplaint.longitude ? (
                  <LocationViewMap
                    latitude={activeComplaint.latitude}
                    longitude={activeComplaint.longitude}
                    address={activeComplaint.address}
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-slate-50 border border-[#E2E8F0] text-xs text-[#64748B] text-center">
                    No GPS coordinates specified for this record
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Metadata & Audit Trail */}
            <div className="space-y-4">
              {/* Metadata Panel */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <div className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">
                  Record Metadata
                </div>

                <div className="text-xs space-y-2 text-[#475569]">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-[#64748B]" />
                    <span className="font-semibold text-[#111827]">{activeComplaint.citizenName}</span>
                  </div>
                  <div className="pl-5 text-[#64748B] text-[11px]">{activeComplaint.citizenEmail}</div>
                  {activeComplaint.citizenPhone && (
                    <div className="pl-5 text-[#64748B] text-[11px]">{activeComplaint.citizenPhone}</div>
                  )}

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Logged: {new Date(activeComplaint.createdAt).toLocaleString()}</span>
                  </div>

                  {activeComplaint.resolvedAt && (
                    <div className="flex items-center gap-2 text-[#0F766E] font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>Resolved: {new Date(activeComplaint.resolvedAt).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E2E8F0] flex items-start gap-2 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-[#64748B] mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#111827]">
                        {activeComplaint.departmentName || 'Unassigned Department'}
                      </div>
                      {activeComplaint.assignedOfficer && (
                        <div className="text-[#64748B]">Officer: {activeComplaint.assignedOfficer}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chronological Audit Trail */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-3">
                  <History className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Audit Trail</span>
                </div>

                <div className="space-y-3 text-xs">
                  {activeComplaint.history && activeComplaint.history.length > 0 ? (
                    activeComplaint.history.map((h, i) => (
                      <div
                        key={h.id || i}
                        className="relative pl-3.5 pb-2 border-l border-slate-300 last:border-transparent"
                      >
                        <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-[#111827]"></div>
                        <div className="font-semibold text-[#111827] flex items-center gap-1.5">
                          <StatusBadge status={h.newStatus} />
                        </div>
                        <div className="text-[10px] text-[#64748B] mt-1">
                          {new Date(h.createdAt).toLocaleString()} • by {h.changedByName}
                        </div>
                        {h.remarks && (
                          <div className="mt-1 text-[11px] text-[#111827] bg-white p-2 rounded border border-[#E2E8F0]">
                            {h.remarks}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-[#64748B] text-xs">No status transitions recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Municipal Authority Triage & Action Panel */}
          {isAuthority && (
            <div className="mt-6 pt-5 border-t border-[#E2E8F0] bg-slate-50 p-4 sm:p-5 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Municipal Operational Redressal Actions
                </h3>
                <span className="text-[11px] text-[#64748B]">Authenticated Authority Mode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Status Transition Form */}
                <form
                  onSubmit={handleUpdateStatus}
                  className="space-y-2 bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs"
                >
                  <div className="text-xs font-semibold text-[#111827]">Update Workflow Status</div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                    className="w-full text-xs p-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <textarea
                    rows={2}
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="Official status change remarks..."
                    className="w-full text-xs p-1.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:border-[#111827]"
                  />
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="w-full py-1.5 text-xs font-medium rounded-md bg-[#111827] hover:bg-slate-800 text-white flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>Apply Status</span>
                  </button>
                </form>

                {/* 2. Priority / Urgency Update Form */}
                <form
                  onSubmit={handleUpdatePriority}
                  className="space-y-2 bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs"
                >
                  <div className="text-xs font-semibold text-[#111827]">Set Official Urgency</div>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                    className="w-full text-xs p-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
                  >
                    <option value="LOW">Low Urgency</option>
                    <option value="MEDIUM">Medium Urgency</option>
                    <option value="HIGH">High Urgency</option>
                    <option value="CRITICAL">Critical Urgency</option>
                  </select>
                  <p className="text-[11px] text-[#64748B]">
                    Establishes public safety urgency for department dispatch triage.
                  </p>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="w-full py-1.5 text-xs font-medium rounded-md bg-[#111827] hover:bg-slate-800 text-white flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>Save Urgency</span>
                  </button>
                </form>

                {/* 3. Field Allocation Form */}
                <form
                  onSubmit={handleAssignDepartment}
                  className="space-y-2 bg-white p-3.5 rounded-lg border border-[#E2E8F0] shadow-2xs"
                >
                  <div className="text-xs font-semibold text-[#111827]">Department Assignment</div>
                  <select
                    required
                    value={selectedDepartmentId}
                    onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                    className="w-full text-xs p-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#111827] focus:outline-none focus:border-[#111827]"
                  >
                    <option value="" disabled>Choose Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    placeholder="Field Officer Name"
                    className="w-full text-xs p-1.5 rounded-md border border-[#E2E8F0] focus:outline-none focus:border-[#111827]"
                  />
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="w-full py-1.5 text-xs font-medium rounded-md bg-[#111827] hover:bg-slate-800 text-white flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>Assign Field Team</span>
                  </button>
                </form>
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-red-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-red-900">Delete complaint</div>
                  <p className="mt-0.5 text-[11px] text-red-800">Permanently removes this record and its audit history.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteComplaint}
                  disabled={submittingAction}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {submittingAction ? 'Deleting…' : 'Delete complaint'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
