import React from 'react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC<{ onOpenNewScreening?: () => void; onOpenNewPatient?: () => void }> = ({
  onOpenNewScreening,
  onOpenNewPatient,
}) => {
  const { currentRole, activeTab, setActiveTab, pendingSyncCount, cases } = useApp();

  const urgentCount = cases.filter(c => c.status === 'FLAGGED_URGENT').length;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest border-r border-surface-container-high z-30 flex flex-col justify-between overflow-y-auto">
      <div className="p-3">
        {/* Role Header Badge */}
        <div className="mb-3 px-3 py-2 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {currentRole === 'nurse' && 'Frontline Camp Station'}
              {currentRole === 'doctor' && 'Ophthalmic Review Node'}
              {currentRole === 'patient' && 'Patient Vision Portal'}
              {currentRole === 'analytics' && 'State Surveillance Node'}
            </div>
            <div className="text-xs font-semibold text-on-surface truncate">
              {currentRole === 'nurse' && 'PHC Badlapur Cluster'}
              {currentRole === 'doctor' && 'Thane Base Tele-Hub'}
              {currentRole === 'patient' && 'ABHA Linked Vision ID'}
              {currentRole === 'analytics' && 'Maharashtra Directorate'}
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        </div>

        {/* Navigation Links according to Role */}
        <nav className="flex flex-col gap-1">
          {/* NURSE NAVIGATION */}
          {currentRole === 'nurse' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span>Camp Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('patients')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'patients'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Patients Registry</span>
              </button>

              {onOpenNewScreening && (
                <button
                  onClick={onOpenNewScreening}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary-fixed/30 transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                  <span>+ New Screening</span>
                </button>
              )}

              {onOpenNewPatient && (
                <button
                  onClick={onOpenNewPatient}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-secondary hover:bg-secondary-fixed/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>+ Register Patient</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Tele-Appointments</span>
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'sync'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  <span>Offline Storage</span>
                </div>
                {pendingSyncCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* DOCTOR NAVIGATION */}
          {currentRole === 'doctor' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span>Doctor Workspace</span>
              </button>

              <button
                onClick={() => setActiveTab('case-review')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'case-review'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>AI Case Review</span>
                </div>
                {urgentCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                    {urgentCount} Urgent
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">video_camera_front</span>
                <span>Tele-Consultations</span>
              </button>

              <button
                onClick={() => setActiveTab('patients')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'patients'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                <span>Patient EMR Stack</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>District Insights</span>
              </button>
            </>
          )}

          {/* PATIENT NAVIGATION */}
          {currentRole === 'patient' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>My Vision Report</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>My Doctor Appointment</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Consent & Privacy</span>
              </button>
            </>
          )}

          {/* ANALYTICS NAVIGATION */}
          {currentRole === 'analytics' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">monitoring</span>
                <span>Prevalence Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('clusters')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'clusters'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span>PHC Camp Clusters</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Emergency / Support Card */}
      <div className="p-3 m-3 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs">
        <div className="flex items-center gap-1.5 text-primary font-semibold mb-1">
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span>Ayushman Bharat Help</span>
        </div>
        <p className="text-[11px] text-on-surface-variant leading-tight mb-2">
          Tele-Ophthal Toll Free 1800-419-EYES
        </p>
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
          <span>ABHA Gateway</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>
      </div>
    </aside>
  );
};
