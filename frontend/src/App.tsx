import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import type { Complaint, Category, Department, DashboardStats, User } from './types';
import { authApi, complaintApi, categoryApi, departmentApi, dashboardApi } from './services/api';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AuthModal } from './components/AuthModal';
import { Shield, Users, CheckCircle2 } from 'lucide-react';

const ReportComplaintModal = lazy(() => import('./components/ReportComplaintModal').then((module) => ({ default: module.ReportComplaintModal })));
const ComplaintDetailsModal = lazy(() => import('./components/ComplaintDetailsModal').then((module) => ({ default: module.ComplaintDetailsModal })));

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('civic_user');
    if (!savedUser || !localStorage.getItem('civic_token')) return null;
    try { return JSON.parse(savedUser) as User; } catch { return null; }
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  // Filters for admin
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('civic_token');
    if (!token) return;
    authApi.getMe().then(setCurrentUser).catch(() => {
      localStorage.removeItem('civic_token');
      localStorage.removeItem('civic_user');
      setCurrentUser(null);
    });
  }, []);

  // Fetch categories and departments
  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
    if (currentUser?.role === 'ROLE_AUTHORITY') {
      departmentApi.getAll().then(setDepartments).catch(console.error);
    }
  }, [currentUser]);

  // Load complaints & stats
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    const requestId = ++requestSequence.current;
    setDataLoading(true);
    setDataError(null);
    try {
      if (currentUser.role === 'ROLE_AUTHORITY') {
        const [complaintsData, statsData, deptData] = await Promise.all([
          complaintApi.getAll({
            status: selectedStatus && selectedStatus !== 'PENDING' ? selectedStatus : undefined,
            categoryId: selectedCategory ? Number(selectedCategory) : undefined,
            priority: selectedPriority || undefined,
            search: searchQuery || undefined,
          }),
          dashboardApi.getStats(),
          departmentApi.getAll(),
        ]);
        if (requestId !== requestSequence.current) return;
        setComplaints(selectedStatus === 'PENDING'
          ? complaintsData.filter((complaint: Complaint) => complaint.status === 'SUBMITTED' || complaint.status === 'UNDER_REVIEW')
          : complaintsData);
        setStats(statsData);
        setDepartments(deptData);
      } else {
        const complaintsData = await complaintApi.getAll();
        if (requestId !== requestSequence.current) return;
        setComplaints(complaintsData);
      }
    } catch (err) {
      if (requestId !== requestSequence.current) return;
      console.error('Failed to load civic data:', err);
      setDataError('We could not load your civic records. Check your connection and try again.');
    } finally {
      if (requestId === requestSequence.current) setDataLoading(false);
    }
  }, [currentUser, selectedStatus, selectedCategory, selectedPriority, searchQuery]);

  useEffect(() => {
    let isCurrent = true;
    queueMicrotask(() => {
      if (isCurrent) void loadData();
    });
    return () => { isCurrent = false; };
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
    setCurrentUser(null);
    setComplaints([]);
    setStats(null);
  };

  const handleComplaintUpdated = (updated: Complaint) => {
    setSelectedComplaint(updated);
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    void loadData();
  };

  const handleComplaintCreated = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    void loadData();
  };

  const handleComplaintDeleted = (complaintId: number) => {
    setSelectedComplaint(null);
    setComplaints((prev) => prev.filter((complaint) => complaint.id !== complaintId));
    void loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {currentUser && dataError && (
          <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{dataError}</span>
            <button onClick={() => void loadData()} className="shrink-0 font-semibold underline underline-offset-2">Retry</button>
          </div>
        )}
        {currentUser && dataLoading && complaints.length === 0 && !dataError && (
          <div role="status" className="mb-5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">Loading your civic records…</div>
        )}
        {currentUser ? (
          currentUser.role === 'ROLE_AUTHORITY' ? (
            <AdminDashboard
              complaints={complaints}
              categories={categories}
              stats={stats}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRefresh={loadData}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              loading={dataLoading}
            />
          ) : (
            <CitizenDashboard
              complaints={complaints}
              categories={categories}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSelectComplaint={(c) => setSelectedComplaint(c)}
              userName={currentUser.name}
            />
          )
        ) : (
          /* Public Landing View when not logged in */
          <div className="py-10 space-y-10 sm:py-14">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Official municipal portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Report a local problem. Follow its progress.
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                A structured channel for citizens to report local civic issues—including damaged roads, uncollected waste, broken street lighting, and water line bursts—with geographic coordinates and verified status tracking.
              </p>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="civic-primary-button"
                >
                  Sign in or create an account
                </button>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Users className="w-4 h-4 stroke-[1.75]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Direct Citizen Intake</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Submit localized reports with optional photo attachments and precise map coordinates for immediate municipal inspection.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Shield className="w-4 h-4 stroke-[1.75]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Municipal Field Triage</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Authorities prioritize incoming complaints, assign responsible field departments and officers, and append operational remarks.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 stroke-[1.75]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">End-to-End Audit Trail</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Immutable chronological log tracking every status transition from initial intake to field verification and closure.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadData();
        }}
      />

      {isReportModalOpen && (
        <Suspense fallback={<div role="status" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 text-sm font-medium text-white">Opening report form…</div>}>
          <ReportComplaintModal
            isOpen={true}
            onClose={() => setIsReportModalOpen(false)}
            categories={categories}
            onComplaintCreated={handleComplaintCreated}
          />
        </Suspense>
      )}

      {selectedComplaint && (
        <Suspense fallback={<div role="status" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 text-sm font-medium text-white">Loading complaint details…</div>}>
          <ComplaintDetailsModal
            isOpen={true}
            onClose={() => setSelectedComplaint(null)}
            complaint={selectedComplaint}
            departments={departments}
            currentUser={currentUser}
            onUpdated={handleComplaintUpdated}
            onDeleted={handleComplaintDeleted}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
