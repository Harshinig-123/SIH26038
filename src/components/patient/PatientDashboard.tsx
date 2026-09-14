import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const PatientDashboard: React.FC = () => {
  const { appointments, selectedPatient, cases, requestAppointment } = useApp();

  const [consentApproved, setConsentApproved] = useState(true);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqReason, setReqReason] = useState('Vision evaluation / Retinal follow-up');
  const [reqUrgency, setReqUrgency] = useState<'Routine' | 'Urgent'>('Routine');
  const [requestSent, setRequestSent] = useState(false);

  // Get the selected patient's data and latest case
  const patient = selectedPatient;
  const patientCase = patient ? cases.find(c => c.patientId === patient.id) : null;
  const odGrade = patientCase?.eyes.od.aiGrading.predictedGrade || 'NO_DR';
  const osGrade = patientCase?.eyes.os.aiGrading.predictedGrade || 'NO_DR';
  const overallGrade = patientCase?.verifiedGrade || odGrade;

  // Filter patient appointments
  const patientAppointments = appointments.filter(a => a.patientId === patient?.id || a.patientName === patient?.name);
  const activeApp = patientAppointments.find(a => a.status === 'SCHEDULED' || a.status === 'REQUESTED' || a.status === 'IN_PROGRESS');
  const lastCompletedApp = patientAppointments.find(a => a.status === 'COMPLETED');

  // Plain English health advice for patient accessibility
  const t = {
    title: 'My Vision Health Record',
    subtitle: 'Ayushman Bharat Digital Mission • Diabetic Retinopathy Care',
    statusTitle: 'Latest Eye Checkup Result',
    date: patientCase ? `Screened on ${patientCase.createdDate} at ${patientCase.phcCenter}` : 'Screened at PHC Badlapur Camp',
    doctorVerdict: overallGrade === 'SEVERE_NPDR' || overallGrade === 'PDR'
      ? 'High Priority Specialist Follow-Up Recommended'
      : 'Routine Follow-Up & Monitoring Recommended',
    doctorVerdictDesc: patientCase?.doctorNotes || 'Retinal photography recorded. Maintain regular blood sugar and blood pressure medications as advised by your physician.',
    whatToDo: 'What Should I Do Next?',
    step1: 'Attend your scheduled tele-consultation appointment with the specialist doctor.',
    step2: 'Continue taking your prescribed diabetes and blood pressure medications regularly.',
    step3: 'Follow doctor advice and schedule periodic follow-up eye screenings.',
    historyTitle: 'My Screening History & Progress',
    consentTitle: 'My Health Data & ABHA Consent',
    consentDesc: `Your retinal images and screening results are encrypted and linked to your ABHA ID (${patient?.abhaId || '91-4502-8841-3920'}) for continuity of care across government hospitals.`,
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Welcome Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded">
              Citizen Health Card
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">{t.title}</h1>
          <p className="text-sm text-on-surface-variant">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
            alt="Kasturba Bai"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40"
          />
          <div>
            <div className="font-bold text-sm text-on-surface">{patient?.name || 'No patient selected'}</div>
            <div className="text-xs text-on-surface-variant">Age: {patient?.age || '-'} • {patient?.village || '-'}</div>
            <div className="text-[11px] font-mono text-primary font-semibold">ABHA: {patient?.abhaId || '-'}</div>
          </div>
        </div>
      </div>

      {/* LATEST RESULT CARD */}
      <div className="bg-surface-container-lowest rounded-2xl border-2 border-amber-300 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-low pb-4">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t.statusTitle}
            </span>
            <div className="text-base font-bold text-on-surface mt-0.5">{t.doctorVerdict}</div>
            <div className="text-xs text-on-surface-variant mt-0.5">{t.date}</div>
          </div>

          <div className="flex items-center gap-2">
            <DRGradeBadge grade={overallGrade} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Right Eye Card */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-black overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80"
                alt="OD"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Right Eye (OD)</span>
              <div className="mt-1">
                <DRGradeBadge grade={odGrade} size="sm" />
              </div>
              <span className="text-[11px] text-on-surface-variant font-semibold block mt-1">
                {patientCase ? `Edema Risk: ${patientCase.eyes.od.aiGrading.edemaRisk}` : 'Awaiting screening'}
              </span>
            </div>
          </div>

          {/* Left Eye Card */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-black overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80"
                alt="OS"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Left Eye (OS)</span>
              <div className="mt-1">
                <DRGradeBadge grade={osGrade} size="sm" />
              </div>
              <span className="text-[11px] text-on-surface-variant font-semibold block mt-1">
                {patientCase ? `Edema Risk: ${patientCase.eyes.os.aiGrading.edemaRisk}` : 'Awaiting screening'}
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Explanation */}
        <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            <span>Explanation from Dr. Arvind Rao:</span>
          </div>
          <p className="leading-relaxed">{t.doctorVerdictDesc}</p>
        </div>

        {/* Action Checklist */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="font-bold text-xs text-on-surface">{t.whatToDo}</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-surface-container rounded-xl flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <span>{t.step1}</span>
            </div>
            <div className="p-3 bg-surface-container rounded-xl flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <span>{t.step2}</span>
            </div>
            <div className="p-3 bg-surface-container rounded-xl flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <span>{t.step3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TELE-CONSULTATION APPOINTMENT SECTION */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-low pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">video_camera_front</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">My Tele-Consultation Appointment</h2>
              <p className="text-xs text-on-surface-variant">
                Direct tele-medicine connection with district retina specialists
              </p>
            </div>
          </div>

          {/* Request Button or Active Status Badge */}
          {activeApp ? (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                activeApp.status === 'REQUESTED'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                <span className="material-symbols-outlined text-[14px]">
                  {activeApp.status === 'REQUESTED' ? 'hourglass_top' : 'schedule'}
                </span>
                <span>{activeApp.status === 'REQUESTED' ? 'Request Awaiting Nurse Scheduling' : 'Appointment Confirmed • Doctor to Attend'}</span>
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                setRequestSent(false);
                setShowReqModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs transition-all shadow-xs self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>{lastCompletedApp ? 'Request Follow-Up Appointment' : 'Request Doctor Appointment'}</span>
            </button>
          )}
        </div>

        {/* ACTIVE APPOINTMENT: EITHER REQUESTED OR SCHEDULED */}
        {activeApp && (
          <div className={`p-5 rounded-xl border flex flex-col gap-3 ${
            activeApp.status === 'REQUESTED'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-blue-50/70 border-blue-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {activeApp.status === 'REQUESTED' ? 'pending_actions' : 'event'}
                </span>
                <span className="font-bold text-sm text-on-surface">
                  {activeApp.status === 'REQUESTED'
                    ? 'Appointment Request Submitted to Nurse'
                    : `Scheduled Session: ${activeApp.scheduledTime}`}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                activeApp.status === 'REQUESTED'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-blue-200 text-blue-900'
              }`}>
                {activeApp.status === 'REQUESTED' ? 'Nurse Assigning Slot' : 'Doctor to Attend'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-on-surface-variant block text-[11px]">Specialist Doctor</span>
                <span className="font-semibold text-on-surface">{activeApp.doctorName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">PHC Tele-Clinic Center</span>
                <span className="font-semibold text-on-surface">{activeApp.phcCenter}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Urgency / Reason</span>
                <span className="font-semibold text-on-surface">{activeApp.urgency} • {activeApp.reason}</span>
              </div>
            </div>

            <div className="mt-2 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0">lock</span>
              <div className="text-on-surface">
                <span className="font-semibold">New Request Locked: </span>
                <span>
                  {activeApp.status === 'REQUESTED'
                    ? 'Your request is currently being processed by the PHC nurse. You can only request another appointment after your scheduled consultation has completed.'
                    : 'Doctor has not attended yet. You can only request another appointment after this session has ended.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAST COMPLETED APPOINTMENT (IF EXISTS) */}
        {lastCompletedApp && !activeApp && (
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">task_alt</span>
                <span className="font-bold text-sm text-emerald-950">Previous Consultation Completed</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900">
                Attended & Signed by Doctor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-on-surface-variant block text-[11px]">Consulted Doctor</span>
                <span className="font-semibold text-on-surface">{lastCompletedApp.doctorName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Session Concluded</span>
                <span className="font-semibold text-on-surface">{lastCompletedApp.scheduledTime}</span>
              </div>
            </div>

            <div className="mt-1 p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-on-surface">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-[14px]">clinical_notes</span>
                <span>Doctor Clinical Orders & Prescription:</span>
              </div>
              <p className="leading-relaxed">
                {lastCompletedApp.doctorNotes || 'Consultation concluded. Maintain medications and follow-up as advised.'}
              </p>
            </div>

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-emerald-200 text-xs">
              <span className="text-emerald-900">
                Session is over. You may now request a follow-up consultation whenever required.
              </span>
              <button
                onClick={() => {
                  setRequestSent(false);
                  setShowReqModal(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Request Follow-Up</span>
              </button>
            </div>
          </div>
        )}

        {/* NO APPOINTMENTS AT ALL */}
        {!activeApp && !lastCompletedApp && (
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-semibold text-on-surface block text-sm">No Active Tele-Consultation</span>
              <span className="text-on-surface-variant">
                If you have vision concerns or require specialist review of your retinal checkup, submit an appointment request to your PHC nurse.
              </span>
            </div>
            <button
              onClick={() => {
                setRequestSent(false);
                setShowReqModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shrink-0 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Request Appointment</span>
            </button>
          </div>
        )}
      </div>

      {/* SCREENING HISTORY TIMELINE */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-6 shadow-xs flex flex-col gap-4">
        <h2 className="text-base font-bold text-on-surface">{t.historyTitle}</h2>

        <div className="flex flex-col gap-3">
          {[
            { date: '13 Sep 2026', location: 'PHC Badlapur Center', grade: 'SEVERE_NPDR' as const, note: 'Specialist referral dispatched' },
            { date: '14 Oct 2024', location: 'Sonawale Outreach Camp', grade: 'MODERATE_NPDR' as const, note: 'Lifestyle counseling given' },
            { date: '10 Nov 2022', location: 'Thane Civil Hospital', grade: 'MILD_NPDR' as const, note: 'Initial early detection' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold">
                  {3 - idx}
                </div>
                <div>
                  <div className="font-bold text-on-surface">{item.date}</div>
                  <div className="text-[11px] text-on-surface-variant">{item.location} • {item.note}</div>
                </div>
              </div>

              <DRGradeBadge grade={item.grade} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* ABHA CONSENT & PRIVACY */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-6 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[22px]">lock</span>
            <h2 className="text-base font-bold text-on-surface">{t.consentTitle}</h2>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={consentApproved}
              onChange={(e) => setConsentApproved(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <span>Consent Active</span>
          </label>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">{t.consentDesc}</p>
      </div>

      {/* REQUEST APPOINTMENT MODAL */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-surface-container-high shadow-xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">calendar_add_on</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Request Tele-Consultation</h3>
                  <p className="text-[11px] text-on-surface-variant">Request will be routed to your PHC Nurse for scheduling</p>
                </div>
              </div>
              <button
                onClick={() => setShowReqModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {requestSent ? (
              <div className="py-6 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-700 text-[32px]">check_circle</span>
                </div>
                <h4 className="text-base font-bold text-on-surface">Appointment Request Sent!</h4>
                <p className="text-xs text-on-surface-variant max-w-xs">
                  Your request has been sent to <strong>Sister Lakshmi Sharma (PHC Nurse)</strong>. She will assign a specialist doctor and schedule your time slot.
                </p>
                <button
                  onClick={() => setShowReqModal(false)}
                  className="mt-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (patient) {
                    requestAppointment(patient.id, reqReason, reqUrgency);
                    setRequestSent(true);
                  }
                }}
                className="flex flex-col gap-4"
              >
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-on-surface">{patient?.name || 'Patient'}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      ABHA: {patient?.abhaId} • {patient?.phcCenter}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-primary">
                    Citizen
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Reason for Consultation *</label>
                  <textarea
                    required
                    rows={3}
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    placeholder="Describe your vision symptoms or reason for consulting the eye doctor..."
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Urgency Level</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface font-medium"
                  >
                    <option value="Routine">Routine (Regular vision check / Sugar follow-up)</option>
                    <option value="Urgent">Urgent (Blurry vision / Eye irritation / High sugar)</option>
                  </select>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">info</span>
                  <span>
                    The PHC nurse will review your case images and schedule an available ophthalmologist slot at the PHC clinic.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-low">
                  <button
                    type="button"
                    onClick={() => setShowReqModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit Request to Nurse</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
