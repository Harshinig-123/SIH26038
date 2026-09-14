import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { AppLogo } from '../common/AppLogo';

export const LoginPage: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const { currentRole, setCurrentRole, isOnline, setIsOnline } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'nurse');

  // Form states
  const [nurseStaffId, setNurseStaffId] = useState('RN-8812 (Lakshmi Sharma)');
  const [nursePin, setNursePin] = useState('123456');
  const [nursePhc, setNursePhc] = useState('PHC Badlapur Central (District Thane)');
  const [offlineEncryption, setOfflineEncryption] = useState(true);
  const [showNursePin, setShowNursePin] = useState(false);

  const [doctorId, setDoctorId] = useState('MMC-2014-9812 (Dr. Arvind Rao)');
  const [doctorPassword, setDoctorPassword] = useState('retina#2026');
  const [doctorHospital, setDoctorHospital] = useState('Sankara District Base Eye Hospital (Thane Hub)');
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);

  const [patientAbha, setPatientAbha] = useState('91-4502-8841-3920');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'voice'>('sms');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentRole(role);
  };

  const executeLogin = (role: UserRole, personName: string, workspaceName: string) => {
    setIsAuthenticating(true);
    setAuthMessage(`Authenticating ${personName} for ${workspaceName}...`);
    setTimeout(() => {
      onLogin(role);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-container-low/40 text-on-surface flex flex-col justify-between selection:bg-primary selection:text-on-primary">
      {/* Top Clinical Header Bar */}
      <header className="w-full px-4 lg:px-8 py-3 flex justify-between items-center bg-surface-container-lowest border-b border-surface-container-high shadow-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <AppLogo size={36} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-primary text-base tracking-tight leading-none">Retina-AI</span>
              <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded-full text-[10px] font-bold border border-primary/20">
                v2.4 ABDM
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight hidden sm:block">
              AI-Powered Rural Retinopathy Diagnostic Gateway
            </p>
          </div>
        </div>

        {/* System Badges & Online Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden sm:inline">{isOnline ? 'Offline-First Ready (Online)' : 'Offline Terminal Mode'}</span>
            <span className="sm:hidden">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-full border border-outline-variant/40 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            <span className="font-semibold text-[11px]">ABDM M3 Certified</span>
          </div>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-5xl mx-auto w-full">
        {/* Central Auth Hero Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-md overflow-hidden">
          {/* Card Header Banner */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-surface-container-low to-surface-container-lowest border-b border-surface-container-low text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-container text-on-primary shadow-xs mb-3">
              <span className="material-symbols-outlined text-[28px]">visibility</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              Retina-AI Unified Clinical Portal
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-md mx-auto mt-1">
              Smart India Hackathon • Ayushman Bharat Digital Mission (ABDM)
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-outline-variant/40 text-[11px] font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[15px]">health_and_safety</span>
              <span>National Health Authority (NHA) &amp; DISHA Compliant</span>
            </div>
          </div>

          {/* EXACT ROLE SWITCHER PILL BAR (From User Screenshot) */}
          <div className="px-6 md:px-8 pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Select Your Clinical Role
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Switch role to load tailored workstation
              </span>
            </div>

            {/* Pill Bar */}
            <div className="bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/40 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {/* Role 1: Nurse / Camp */}
              <button
                type="button"
                onClick={() => handleRoleChange('nurse')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${
                  selectedRole === 'nurse'
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  <div>
                    <span className="block text-xs font-bold">Nurse / Camp</span>
                    <span className={`block text-[10px] ${selectedRole === 'nurse' ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                      PHC Field Screener
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  selectedRole === 'nurse' ? 'bg-white/20 text-white' : 'bg-surface-container text-primary'
                }`}>
                  Triage
                </span>
              </button>

              {/* Role 2: Ophthalmologist */}
              <button
                type="button"
                onClick={() => handleRoleChange('doctor')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${
                  selectedRole === 'doctor'
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                  <div>
                    <span className="block text-xs font-bold">Ophthalmologist</span>
                    <span className={`block text-[10px] ${selectedRole === 'doctor' ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                      Doctor Review Hub
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  selectedRole === 'doctor' ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary'
                }`}>
                  Tele-Review
                </span>
              </button>

              {/* Role 3: Patient View */}
              <button
                type="button"
                onClick={() => handleRoleChange('patient')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <div>
                    <span className="block text-xs font-bold">Patient View</span>
                    <span className={`block text-[10px] ${selectedRole === 'patient' ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
                      Citizen Health Portal
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  selectedRole === 'patient' ? 'bg-white/20 text-white' : 'bg-surface-container text-tertiary'
                }`}>
                  ABHA
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Role Forms Container */}
          <div className="p-6 md:p-8 pt-4">
            {/* =================== ROLE 1: NURSE & CAMP WORKER FORM =================== */}
            {selectedRole === 'nurse' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Active Operator Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1594824813689-51475c40049a?auto=format&fit=crop&w=200&q=80"
                      alt="Sister Lakshmi Sharma, RN"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">Sister Lakshmi Sharma, RN</span>
                        <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Camp Lead
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Public Health Nurse • PHC Badlapur Cluster</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNurseStaffId('RN-8812 (Lakshmi Sharma)');
                      setNursePin('123456');
                      setNursePhc('PHC Badlapur Central (District Thane)');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary text-xs font-semibold transition-all self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[15px]">bolt</span>
                    <span>Demo Credentials</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeLogin('nurse', 'Sister Lakshmi Sharma', 'Nurse Screening Station');
                  }}
                  className="space-y-4 pt-1 text-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">
                        Staff ID / Registered Mobile *
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                          badge
                        </span>
                        <input
                          type="text"
                          required
                          value={nurseStaffId}
                          onChange={(e) => setNurseStaffId(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-on-surface-variant">NHM Staff Roster Registered</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-semibold text-on-surface">Security PIN / Password *</label>
                        <span className="text-[10px] text-primary hover:underline cursor-pointer">Forgot PIN?</span>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                          lock
                        </span>
                        <input
                          type={showNursePin ? 'text' : 'password'}
                          required
                          value={nursePin}
                          onChange={(e) => setNursePin(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNursePin(!showNursePin)}
                          className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showNursePin ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      <p className="mt-1 text-[10px] text-on-surface-variant">Default Demo PIN: 123456</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Assigned Primary Health Center (PHC)
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                        location_on
                      </span>
                      <select
                        value={nursePhc}
                        onChange={(e) => setNursePhc(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                      >
                        <option value="PHC Badlapur Central (District Thane)">PHC Badlapur Central (District Thane)</option>
                        <option value="Sonawale Sub-Center (Outreach Camp)">Sonawale Sub-Center (Outreach Camp)</option>
                        <option value="Kashele Rural PHC (Vision Node 4)">Kashele Rural PHC (Vision Node 4)</option>
                        <option value="Vangani CHC Center">Vangani CHC Center</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="offline-enc"
                      checked={offlineEncryption}
                      onChange={(e) => setOfflineEncryption(e.target.checked)}
                      className="mt-0.5 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="offline-enc" className="cursor-pointer">
                      <span className="font-semibold text-on-surface block">
                        Enable local encrypted storage for low-connectivity rural camps
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Enables autonomous offline AI screening inference and fundus image caching
                      </span>
                    </label>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="flex-1 py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Sign In to Nurse Workspace</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeLogin('nurse', 'Sister Lakshmi Sharma', 'Nurse Screening Station')}
                      className="py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-primary font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>⚡ 1-Click Nurse Login</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =================== ROLE 2: OPHTHALMOLOGIST FORM =================== */}
            {selectedRole === 'doctor' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                      alt="Dr. Arvind Rao"
                      className="w-12 h-12 rounded-full object-cover border-2 border-secondary/40 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">Dr. Arvind Rao, MS (Ophthalmology)</span>
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Tele-Specialist
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Vitreo-Retinal Consultant • Sankara District Base Hospital</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDoctorId('MMC-2014-9812 (Dr. Arvind Rao)');
                      setDoctorPassword('retina#2026');
                      setDoctorHospital('Sankara District Base Eye Hospital (Thane Hub)');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary text-xs font-semibold transition-all self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[15px]">bolt</span>
                    <span>Demo Credentials</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeLogin('doctor', 'Dr. Arvind Rao', 'Ophthalmology Review Workspace');
                  }}
                  className="space-y-4 pt-1 text-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-on-surface mb-1">
                        Medical Council Reg / Doctor ID *
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                          assignment_ind
                        </span>
                        <input
                          type="text"
                          required
                          value={doctorId}
                          onChange={(e) => setDoctorId(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-secondary"
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-on-surface-variant">NMC / MMC Certified Specialist</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-semibold text-on-surface">Institutional Password *</label>
                        <span className="text-[10px] text-secondary hover:underline cursor-pointer">Reset Token?</span>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                          vpn_key
                        </span>
                        <input
                          type={showDoctorPassword ? 'text' : 'password'}
                          required
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                          className="w-full pl-9 pr-9 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-secondary font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                          className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showDoctorPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      <p className="mt-1 text-[10px] text-on-surface-variant">Default Demo: retina#2026</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      Affiliated Hospital Node &amp; Review Hub
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                        domain
                      </span>
                      <select
                        value={doctorHospital}
                        onChange={(e) => setDoctorHospital(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-secondary"
                      >
                        <option value="Sankara District Base Eye Hospital (Thane Hub)">Sankara District Base Eye Hospital (Thane Hub)</option>
                        <option value="Thane Civil Hospital Ophthalmic Unit">Thane Civil Hospital Ophthalmic Unit</option>
                        <option value="State Rural Tele-Retinopathy Hub">State Rural Tele-Retinopathy Hub</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">token</span>
                      <div>
                        <span className="font-semibold text-on-surface block">Digital Signature Certificate (e-Sign/DSC)</span>
                        <span className="text-[10px] text-on-surface-variant">USB Class-3 Hardware Token Detected</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Ready</span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="flex-1 py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Access Diagnostic Review Console</span>
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeLogin('doctor', 'Dr. Arvind Rao', 'Ophthalmology Review Workspace')}
                      className="py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-secondary font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>⚡ 1-Click Doctor Login</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =================== ROLE 3: PATIENT & CITIZEN FORM =================== */}
            {selectedRole === 'patient' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                      alt="Kasturba Bai"
                      className="w-12 h-12 rounded-full object-cover border-2 border-tertiary/40 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">Kasturba Bai Sakharam (68y)</span>
                        <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          ABHA Linked
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Village Sonawale • Citizen Vision Health Card</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPatientAbha('91-4502-8841-3920');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary text-xs font-semibold transition-all self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[15px]">bolt</span>
                    <span>Demo Patient</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeLogin('patient', 'Kasturba Bai Sakharam', 'Patient Vision Portal');
                  }}
                  className="space-y-4 pt-1 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">
                      14-Digit ABHA Health ID or Aadhaar Number *
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                        credit_card
                      </span>
                      <input
                        type="text"
                        required
                        value={patientAbha}
                        onChange={(e) => setPatientAbha(e.target.value)}
                        placeholder="e.g. 91-4502-8841-3920"
                        className="w-full pl-9 pr-3 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono tracking-wide"
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-on-surface-variant">
                      <span>Linked with Ayushman Bharat Digital Mission (ABDM)</span>
                      <span className="text-primary hover:underline cursor-pointer">Find ABHA ID</span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <span className="font-semibold text-on-surface block mb-2">Select OTP Delivery Method</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        otpChannel === 'sms' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 bg-surface-container-lowest'
                      }`}>
                        <input
                          type="radio"
                          name="otp_chan"
                          checked={otpChannel === 'sms'}
                          onChange={() => setOtpChannel('sms')}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="material-symbols-outlined text-[18px] text-primary">sms</span>
                        <span className="text-xs text-on-surface">SMS OTP on +91 ••••• 54321</span>
                      </label>

                      <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        otpChannel === 'voice' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 bg-surface-container-lowest'
                      }`}>
                        <input
                          type="radio"
                          name="otp_chan"
                          checked={otpChannel === 'voice'}
                          onChange={() => setOtpChannel('voice')}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="material-symbols-outlined text-[18px] text-secondary">record_voice_over</span>
                        <span className="text-xs text-on-surface">Bilingual Voice OTP (मराठी/हिंदी)</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="flex-1 py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Sign In with ABHA / OTP</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => executeLogin('patient', 'Kasturba Bai', 'Patient Vision Portal')}
                      className="py-2.5 px-4 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-primary font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>⚡ 1-Click Patient Login</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Toast Notification when Authenticating */}
          {isAuthenticating && (
            <div className="mx-6 md:mx-8 mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">task_alt</span>
                <span>{authMessage}</span>
              </div>
              <span className="text-[11px] text-emerald-700">Entering Workspace...</span>
            </div>
          )}
        </div>

        {/* REVIEWER 1-CLICK QUICK-SWITCH HUB */}
        <div className="w-full mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Quick Test Personas (1-Click Instant Login for Evaluators)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Persona 1: Nurse */}
            <button
              type="button"
              onClick={() => {
                handleRoleChange('nurse');
                executeLogin('nurse', 'Sister Lakshmi Sharma', 'Nurse Screening Station');
              }}
              className="p-3.5 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary transition-all text-left flex items-center gap-3 shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1594824813689-51475c40049a?auto=format&fit=crop&w=200&q=80"
                alt="Lakshmi Sharma"
                className="w-10 h-10 rounded-full object-cover border border-outline-variant/40 group-hover:border-primary transition-colors shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors truncate">
                    1. Nurse Triage
                  </span>
                  <span className="text-[9px] bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-bold">
                    CAMP
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">Lakshmi Sharma, RN • PHC</p>
              </div>
            </button>

            {/* Persona 2: Doctor */}
            <button
              type="button"
              onClick={() => {
                handleRoleChange('doctor');
                executeLogin('doctor', 'Dr. Arvind Rao', 'Doctor Review Workspace');
              }}
              className="p-3.5 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-secondary transition-all text-left flex items-center gap-3 shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80"
                alt="Dr. Arvind Rao"
                className="w-10 h-10 rounded-full object-cover border border-outline-variant/40 group-hover:border-secondary transition-colors shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface group-hover:text-secondary transition-colors truncate">
                    2. Doctor Station
                  </span>
                  <span className="text-[9px] bg-secondary-fixed text-secondary px-1.5 py-0.5 rounded font-bold">
                    TELE-MD
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">Dr. Arvind Rao, MS • Sankara</p>
              </div>
            </button>

            {/* Persona 3: Patient */}
            <button
              type="button"
              onClick={() => {
                handleRoleChange('patient');
                executeLogin('patient', 'Kasturba Bai', 'Patient Vision Portal');
              }}
              className="p-3.5 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-tertiary transition-all text-left flex items-center gap-3 shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                alt="Kasturba Bai"
                className="w-10 h-10 rounded-full object-cover border border-outline-variant/40 group-hover:border-tertiary transition-colors shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface group-hover:text-tertiary transition-colors truncate">
                    3. Patient View
                  </span>
                  <span className="text-[9px] bg-tertiary-fixed text-tertiary px-1.5 py-0.5 rounded font-bold">
                    CITIZEN
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">Kasturba Bai Sakharam</p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Trust, Security & Compliance Footer */}
      <footer className="w-full px-4 lg:px-8 py-4 bg-surface-container-lowest border-t border-surface-container-high text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-primary font-semibold">
              <span className="material-symbols-outlined text-[15px]">lock</span>
              256-Bit Encrypted
            </span>
            <span>•</span>
            <span>ABDM Certified (M1, M2 &amp; M3)</span>
            <span>•</span>
            <span>DISHA &amp; DPDPA 2023 Compliant</span>
            <span>•</span>
            <span>Edge Offline Storage</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px]">
            <span>Helpline: <strong className="text-on-surface">1800-419-EYES</strong></span>
            <span>•</span>
            <span>Emergency: <strong className="text-red-700">108</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
