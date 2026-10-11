import React from 'react';
import type { User } from '../types';
import { LogOut, Plus, Shield, User as UserIcon, Activity } from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
  onOpenReportModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<Props> = ({ user, onLogout, onOpenReportModal, onOpenAuthModal }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur">
      <div className="civic-shell flex min-h-[68px] items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#111827] text-white shadow-sm select-none">
            <Activity className="h-[18px] w-[18px] stroke-[2.2]" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827] tracking-tight text-[17px]">
                CivicPulse
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-slate-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#475569]">
                Municipal Portal
              </span>
            </div>
            <span className="mt-0.5 hidden text-[11px] leading-none text-[#64748B] md:block">
              Local services · complaint tracking
            </span>
          </div>
        </div>

        {/* User / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {user.role === 'ROLE_CITIZEN' && onOpenReportModal && (
                <button
                  onClick={onOpenReportModal}
                  className="civic-primary-button min-h-[38px] px-3 py-1.5 text-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Report a problem</span>
                  <span className="sm:hidden">Report</span>
                </button>
              )}

              {/* User Identity Pill */}
              <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold uppercase text-[#111827] select-none">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-none text-[#111827]">{user.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#64748B]">
                    {user.role === 'ROLE_AUTHORITY' ? (
                      <>
                        <Shield className="w-3 h-3 text-[#2563EB] inline" />
                        <span>Municipal Authority</span>
                      </>
                    ) : (
                      <>
                        <UserIcon className="w-3 h-3 text-[#64748B] inline" />
                        <span>Registered Citizen</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="rounded-lg p-2 text-[#64748B] transition-colors hover:bg-slate-100 hover:text-[#111827] cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#111827] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
