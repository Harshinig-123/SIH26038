import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { AppLogo } from './AppLogo';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    isOnline, 
    setIsOnline,
    pendingSyncCount,
    triggerSync,
    isSyncing
  } = useApp();

  const roleInfo = {
    nurse: {
      name: 'Sister Lakshmi Sharma, RN',
      title: 'PHC Badlapur Central, Thane',
      avatar: 'https://images.unsplash.com/photo-1594824813689-51475c40049a?auto=format&fit=crop&w=200&q=80',
    },
    doctor: {
      name: 'Dr. Arvind Rao, MS (Ophth)',
      title: 'Sankara District Hospital, Thane',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    },
    patient: {
      name: 'Kasturba Bai Sakharam',
      title: 'ABHA: 91-4502-8841-3920',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    }
  };

  const user = roleInfo[currentRole];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-high z-40 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Brand & Left Cluster */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <AppLogo size={34} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-primary text-base tracking-tight leading-none">Retina-AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary-fixed/60 text-primary px-1.5 py-0.5 rounded">
                Clinical Live
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight hidden sm:block">
              AI Diabetic Retinopathy Diagnostic Platform
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-outline-variant/40 hidden md:block" />

        {/* Role Selector Tabs */}
        <div className="hidden lg:flex items-center bg-surface-container p-1 rounded-lg gap-1 text-xs font-medium">
          <span className="text-[11px] text-on-surface-variant font-semibold px-2">Role:</span>
          {(['nurse', 'doctor', 'patient'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-3 py-1 rounded-md transition-all capitalize ${
                currentRole === r
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {r === 'nurse' && 'Nurse / Camp'}
              {r === 'doctor' && 'Ophthalmologist'}
              {r === 'patient' && 'Patient View'}
            </button>
          ))}
        </div>
      </div>

      {/* Right Cluster: Sync, Languages, Profile */}
      <div className="flex items-center gap-3">
        {/* Responsive Role Selector for mobile/tablet */}
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value as UserRole)}
          className="lg:hidden text-xs bg-surface-container border border-outline-variant/50 rounded-lg px-2 py-1 text-on-surface font-medium focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="nurse">Nurse View</option>
          <option value="doctor">Doctor View</option>
          <option value="patient">Patient View</option>
        </select>

        {/* Connectivity & Offline Sync simulation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            title="Toggle Online/Offline simulation"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Online Sync' : 'Offline Mode'}</span>
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={triggerSync}
              disabled={isSyncing || !isOnline}
              className="flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Syncing...' : `${pendingSyncCount} pending`}</span>
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/40">
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-xs font-semibold text-on-surface leading-tight truncate max-w-[160px]">
              {user.name}
            </span>
            <span className="text-[11px] text-on-surface-variant leading-tight truncate max-w-[160px]">
              {user.title}
            </span>
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/30"
          />
        </div>
      </div>
    </header>
  );
};
