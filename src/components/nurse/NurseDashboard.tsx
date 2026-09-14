import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGradeBadge } from '../common/DRGradeBadge';
import { ScreeningCase } from '../../types';

export const NurseDashboard: React.FC<{ onOpenNewScreening: () => void; onOpenNewPatient: () => void }> = ({
  onOpenNewScreening,
  onOpenNewPatient,
}) => {
  const { cases, triggerSync, pendingSyncCount, isSyncing, totalPatientsCount, urgentCasesCount } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewNotesCase, setViewNotesCase] = useState<ScreeningCase | null>(null);

  const filteredCases = searchTerm.trim()
    ? cases.filter(c =>
        c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.abhaId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cases;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Banner & Primary Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded">
              Camp Telemetry Active
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Nurse Screening Station</h1>
          <p className="text-sm text-on-surface-variant">
            Rural Vision Health Outreach Camp • PHC Badlapur Center (District Thane)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewPatient}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface hover:bg-surface-container font-semibold text-sm transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Register Patient</span>
          </button>

          <button
            onClick={onOpenNewScreening}
            className="flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            <span>+ New Screening</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Metric Cards (Exact Stitch Bento Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Patients Registered */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +18 this week
            </span>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-medium">Patients Registered</div>
            <div className="text-2xl font-bold text-on-surface mt-0.5">{totalPatientsCount.toLocaleString()}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span>Total Camp Coverage</span>
            <span className="text-primary font-semibold">92% of target</span>
          </div>
        </div>

        {/* Stat 2: Screenings Today */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">visibility</span>
            </div>
            {/* Mini Progress Circle */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="75, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-secondary">75%</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-medium">Screenings Today</div>
            <div className="text-2xl font-bold text-on-surface mt-0.5">{cases.length}</div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '75.5%' }} />
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px]">
              <span className="text-on-surface-variant">Goal: 45</span>
              <span className="text-secondary font-semibold">11 remaining</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Pending Offline Sync */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              {pendingSyncCount} records queued
            </span>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-medium">Pending Sync</div>
            <div className="text-2xl font-bold text-on-surface mt-0.5">{pendingSyncCount}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Local Flash DB</span>
            <button
              onClick={triggerSync}
              disabled={isSyncing || pendingSyncCount === 0}
              className="text-primary hover:underline font-semibold flex items-center gap-1 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Stat 4: Immediate Referrals */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-700">
              <span className="material-symbols-outlined text-[22px]">emergency</span>
            </div>
            <span className="text-[11px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              High Priority
            </span>
          </div>
          <div>
            <div className="text-xs text-on-surface-variant font-medium">Urgent Referrals</div>
            <div className="text-2xl font-bold text-red-700 mt-0.5">{urgentCasesCount}</div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span>Ophthalmology SLA</span>
            <span className="text-emerald-700 font-semibold">Under 4 hrs</span>
          </div>
        </div>
      </div>

      {/* Screenings Queue Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="p-5 border-b border-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-on-surface">Screening Cohort Queue</h2>
            <p className="text-xs text-on-surface-variant">
              Cases awaiting doctor verification or tele-ophthalmology escalation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search patient, ABHA, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-surface-container rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary w-60"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Patient & ABHA ID</th>
                <th className="px-5 py-3">Village / PHC</th>
                <th className="px-5 py-3">Biomarkers</th>
                <th className="px-5 py-3">Fundus & Quality</th>
                <th className="px-5 py-3">AI Diagnostic Result</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                  {/* Patient Info */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-on-surface text-sm">{c.patientName}</div>
                    <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span>{c.patientAge}y / {c.patientGender}</span>
                      <span>•</span>
                      <span className="font-mono">{c.abhaId}</span>
                    </div>
                  </td>

                  {/* Village / PHC */}
                  <td className="px-5 py-3.5 text-on-surface">
                    <div className="font-medium">{c.village}</div>
                    <div className="text-[11px] text-on-surface-variant">{c.timeAgo}</div>
                  </td>

                  {/* Biomarkers */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <span className="text-on-surface-variant">HbA1c:</span>
                      <span className={`font-semibold ${c.hba1c > 8.0 ? 'text-red-700' : 'text-on-surface'}`}>
                        {c.hba1c}%
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      BP: {c.bp} • T2D: {c.diabetesDurationYears}y
                    </div>
                  </td>

                  {/* Fundus Thumbnail & Focus Score */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.eyes.od.imageUrl}
                        alt="OD Fundus"
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-outline-variant/40"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-primary">{c.eyes.od.focusQualityScore}%</span>
                          <span className="text-[10px] text-on-surface-variant">Quality</span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                          {c.eyes.od.mediaClarity}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* AI Diagnostic Result */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1 items-start">
                      <DRGradeBadge grade={c.eyes.od.aiGrading.predictedGrade} size="sm" />
                      <span className="text-[10px] text-on-surface-variant">
                        AI Confidence: {c.eyes.od.aiGrading.confidence}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5">
                    {c.status === 'FLAGGED_URGENT' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        Urgent Referral
                      </span>
                    )}
                    {c.status === 'PENDING_REVIEW' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                        In Doctor Queue
                      </span>
                    )}
                    {c.status === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                        Doctor Verified
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewNotesCase(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-fixed/40 hover:bg-primary text-primary hover:text-on-primary font-semibold text-xs transition-colors shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        <span>Doctor Notes</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Notes & Clinical Orders Modal for Nurse */}
      {viewNotesCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-surface-container-high shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">clinical_notes</span>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Doctor's Clinical Notes & Orders</h2>
                  <p className="text-xs text-on-surface-variant">
                    Patient: {viewNotesCase.patientName} ({viewNotesCase.caseNumber})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewNotesCase(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs flex flex-col gap-4">
              {/* Patient Details Preview */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-on-surface">{viewNotesCase.patientName}</div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                    {viewNotesCase.patientAge}y • {viewNotesCase.patientGender} • ABHA: {viewNotesCase.abhaId}
                  </div>
                  <div className="text-[11px] text-primary font-medium mt-0.5">
                    {viewNotesCase.village} ({viewNotesCase.phcCenter})
                  </div>
                </div>
                <DRGradeBadge grade={viewNotesCase.verifiedGrade || viewNotesCase.eyes.od.aiGrading.predictedGrade} size="md" />
              </div>

              {/* Fundus Preview Thumbnails */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1 bg-surface-container-low p-2 rounded-xl border border-outline-variant/30">
                  <span className="text-[10px] font-bold text-on-surface-variant">Right Eye (OD)</span>
                  <img src={viewNotesCase.eyes.od.imageUrl} alt="OD" className="w-full aspect-square rounded-lg object-cover bg-black" />
                </div>
                <div className="flex flex-col items-center gap-1 bg-surface-container-low p-2 rounded-xl border border-outline-variant/30">
                  <span className="text-[10px] font-bold text-on-surface-variant">Left Eye (OS)</span>
                  <img src={viewNotesCase.eyes.os.imageUrl} alt="OS" className="w-full aspect-square rounded-lg object-cover bg-black" />
                </div>
              </div>

              {/* Doctor Verdict Card */}
              <div className="p-4 rounded-xl bg-primary-fixed/20 border border-primary/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                    <span>Verified By: {viewNotesCase.verifiedBy || 'Dr. Arvind Rao, MS (Ophthalmology)'}</span>
                  </span>
                  <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium">
                    {viewNotesCase.verifiedDate || viewNotesCase.createdDate}
                  </span>
                </div>

                <div className="pt-2 border-t border-primary/20">
                  <span className="text-xs font-bold text-on-surface block mb-1">Doctor's Clinical Impression:</span>
                  <p className="text-xs text-on-surface leading-relaxed bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                    {viewNotesCase.doctorNotes || 'Severe non-proliferative diabetic retinopathy (Grade 3) with imminent macular edema risk. Urgent referral to base hospital for OCT angiography and anti-VEGF evaluation within 7 days.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Triage / Base Hospital:</span>
                  <span className="font-bold text-primary">
                    {viewNotesCase.referralHospital || 'Sankara Eye Hospital, Thane Base'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-surface-container-high flex items-center justify-end bg-surface-container-low/50">
              <button
                onClick={() => setViewNotesCase(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-dark shadow-xs"
              >
                Close Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
