import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const PatientDashboard: React.FC = () => {
  const { appointments, selectedPatient, cases } = useApp();

  const [consentApproved, setConsentApproved] = useState(true);

  // Get the selected patient's data and latest case
  const patient = selectedPatient;
  const patientCase = patient ? cases.find(c => c.patientId === patient.id) : null;
  const odGrade = patientCase?.eyes.od.aiGrading.predictedGrade || 'NO_DR';
  const osGrade = patientCase?.eyes.os.aiGrading.predictedGrade || 'NO_DR';
  const overallGrade = patientCase?.verifiedGrade || odGrade;

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
    </div>
  );
};
