import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { AppLogo } from '../common/AppLogo';

export const LoginPage: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  const { currentRole, setCurrentRole, isOnline, setIsOnline } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'nurse');

  // Form states — all empty initially, no pre-filled credentials
  const [nurseStaffId, setNurseStaffId] = useState('');
  const [nursePin, setNursePin] = useState('');
  const [nursePhc, setNursePhc] = useState('PHC Badlapur Central (District Thane)');
  const [offlineEncryption, setOfflineEncryption] = useState(true);
  const [showNursePin, setShowNursePin] = useState(false);

  const [doctorId, setDoctorId] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('Sankara District Base Eye Hospital (Thane Hub)');
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);

  const [patientAbha, setPatientAbha] = useState('');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'voice'>('sms');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentRole(role);
  };

  const executeLogin = (role: UserRole, workspaceName: string) => {
    setIsAuthenticating(true);
    setAuthMessage(`Signing in to ${workspaceName}...`);
    setTimeout(() => {
      onLogin(role);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-surface-container-low/30 text-on-surface flex flex-col justify-between selection:bg-primary selection:text-on-primary">
      {/* Top Clinical Header Bar with ROLE SWITCHER AT THE TOP */}
      <header className="w-full px-4 lg:px-8 py-2.5 flex justify-between items-center bg-surface-container-lowest border-b border-surface-container-high shadow-xs sticky top-0 z-50">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <AppLogo size={34} />
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

        {/* Center: ROLE SWITCHER PILL BAR IN TOP BAR (Exactly as requested) */}
        <div className="flex items-center bg-surface-container p-1 rounded-xl gap-1 text-xs font-medium border border-outline-variant/40 shadow-xs">
          <span className="text-[11px] text-on-surface-variant font-semibold px-2 hidden sm:inline">Role:</span>
          {(['nurse', 'doctor', 'patient'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                selectedRole === r
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {r === 'nurse' && 'Nurse / Camp'}
              {r === 'doctor' && 'Ophthalmologist'}
              {r === 'patient' && 'Patient View'}
            </button>
          ))}
        </div>

        {/* Right: Connectivity & Compliance */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden md:inline">{isOnline ? 'Offline-First Ready (Online)' : 'Offline Terminal Mode'}</span>
            <span className="md:hidden">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-full border border-outline-variant/40 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            <span className="font-semibold text-[11px]">ABDM M3 Certified</span>
          </div>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 max-w-xl mx-auto w-full">
        {/* Central Auth Card — Clean, Professional, No personal profile displayed */}
        <div className="w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-md overflow-hidden">
          {/* Card Header */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-surface-container-low to-surface-container-lowest border-b border-surface-container-low text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-container text-on-primary shadow-xs mb-3">
              <span className="material-symbols-outlined text-[28px]">
                {selectedRole === 'nurse' && 'medical_services'}
                {selectedRole === 'doctor' && 'visibility'}
                {selectedRole === 'patient' && 'person'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
              {selectedRole === 'nurse' && 'Nurse & Camp Screener Portal'}
              {selectedRole === 'doctor' && 'Ophthalmologist Diagnostic Login'}
              {selectedRole === 'patient' && 'Patient & Citizen Health Portal'}
            </h1>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
              {selectedRole === 'nurse' && 'Sign in to access rural screening camps, fundus capture, and triage'}
              {selectedRole === 'doctor' && 'Secure clinical sign-in for AI image review and tele-consultations'}
              {selectedRole === 'patient' && 'Access your retinal reports, tele-appointments, and ABHA records'}
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-outline-variant/40 text-[11px] font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[15px]">health_and_safety</span>
              <span>National Health Authority (NHA) &amp; DISHA Compliant</span>
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-6 md:p-8">
            {/* =================== ROLE 1: NURSE FORM =================== */}
            {selectedRole === 'nurse' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeLogin('nurse', 'Nurse Workspace');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-on-surface mb-1" htmlFor="nurse-id">
                    Staff ID / Registered Mobile Number
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      badge
                    </span>
                    <input
                      id="nurse-id"
                      type="text"
                      value={nurseStaffId}
                      onChange={(e) => setNurseStaffId(e.target.value)}
                      placeholder="e.g. RN-8812 or 9820154321"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>e.g. Staff ID: <strong className="text-primary font-mono">RN-8812</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setNurseStaffId('RN-8812');
                        setNursePin('123456');
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Fill demo
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-on-surface" htmlFor="nurse-pwd">
                      Security PIN / Password
                    </label>
                    <span className="text-[11px] text-primary hover:underline cursor-pointer">Forgot PIN?</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      lock
                    </span>
                    <input
                      id="nurse-pwd"
                      type={showNursePin ? 'text' : 'password'}
                      value={nursePin}
                      onChange={(e) => setNursePin(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full pl-9 pr-9 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest font-mono"
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
                  <p className="mt-1 text-[11px] text-on-surface-variant">
                    e.g. Default PIN: <strong className="text-primary font-mono">123456</strong>
                  </p>
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
                      className="w-full pl-9 pr-8 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
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
                  <label htmlFor="offline-enc" className="cursor-pointer text-xs">
                    <span className="font-semibold text-on-surface block">
                      Enable local encrypted storage for low-connectivity rural camps
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Autonomous offline AI screening inference and encrypted local caching
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Sign In to Nurse Workspace</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}

            {/* =================== ROLE 2: DOCTOR FORM =================== */}
            {selectedRole === 'doctor' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeLogin('doctor', 'Doctor Review Console');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-on-surface mb-1" htmlFor="doc-id">
                    Medical Council Registration No / Doctor ID
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      assignment_ind
                    </span>
                    <input
                      id="doc-id"
                      type="text"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      placeholder="e.g. MMC-2014-9812 or DOC-104"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-secondary focus:bg-surface-container-lowest"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>e.g. Doctor Reg: <strong className="text-secondary font-mono">MMC-2014-9812</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setDoctorId('MMC-2014-9812');
                        setDoctorPassword('retina#2026');
                      }}
                      className="text-secondary hover:underline font-semibold"
                    >
                      Fill demo
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-on-surface" htmlFor="doc-pwd">
                      Institutional Password
                    </label>
                    <span className="text-[11px] text-secondary hover:underline cursor-pointer">Reset Token?</span>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      vpn_key
                    </span>
                    <input
                      id="doc-pwd"
                      type={showDoctorPassword ? 'text' : 'password'}
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      placeholder="e.g. retina#2026"
                      className="w-full pl-9 pr-9 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-secondary focus:bg-surface-container-lowest font-mono"
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
                  <p className="mt-1 text-[11px] text-on-surface-variant">
                    e.g. Demo Password: <strong className="text-secondary font-mono">retina#2026</strong>
                  </p>
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
                      className="w-full pl-9 pr-8 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-secondary"
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
                      <span className="text-[10px] text-on-surface-variant">USB Class-3 Cryptographic Hardware Token Ready</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Ready</span>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Access Diagnostic Review Console</span>
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </button>
                </div>
              </form>
            )}

            {/* =================== ROLE 3: PATIENT FORM =================== */}
            {selectedRole === 'patient' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeLogin('patient', 'Patient Vision Portal');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-on-surface mb-1" htmlFor="pat-abha">
                    14-Digit ABHA Health ID or Mobile Number
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                      credit_card
                    </span>
                    <input
                      id="pat-abha"
                      type="text"
                      value={patientAbha}
                      onChange={(e) => setPatientAbha(e.target.value)}
                      placeholder="e.g. 91-4502-8841-3920 or 9820012345"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container border border-outline-variant/50 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest font-mono tracking-wide"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>e.g. ABHA: <strong className="text-primary font-mono">91-4502-8841-3920</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setPatientAbha('91-4502-8841-3920');
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Fill demo
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <span className="font-semibold text-on-surface block mb-2">Select Authentication Channel</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      otpChannel === 'sms' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 bg-surface-container-lowest'
                    }`}>
                      <input
                        type="radio"
                        name="otp_channel_sel"
                        checked={otpChannel === 'sms'}
                        onChange={() => setOtpChannel('sms')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="material-symbols-outlined text-[18px] text-primary">sms</span>
                      <span className="text-xs text-on-surface">SMS OTP on Registered Mobile</span>
                    </label>

                    <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      otpChannel === 'voice' ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/40 bg-surface-container-lowest'
                    }`}>
                      <input
                        type="radio"
                        name="otp_channel_sel"
                        checked={otpChannel === 'voice'}
                        onChange={() => setOtpChannel('voice')}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="material-symbols-outlined text-[18px] text-secondary">record_voice_over</span>
                      <span className="text-xs text-on-surface">Bilingual Voice OTP (मराठी/हिंदी)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Sign In with ABHA / OTP</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Feedback Banner */}
          {isAuthenticating && (
            <div className="mx-6 md:mx-8 mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[18px]">task_alt</span>
                <span>{authMessage}</span>
              </div>
              <span className="text-[11px] text-emerald-700">Loading...</span>
            </div>
          )}
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
