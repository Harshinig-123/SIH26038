import React from 'react';
import { useApp } from '../../context/AppContext';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const DoctorDashboard: React.FC = () => {
  const { cases, setSelectedCaseId, setActiveTab } = useApp();

  const handleOpenReview = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('case-review');
  };

  const urgentCases = cases.filter(c => c.status === 'FLAGGED_URGENT');
  const pendingCases = cases.filter(c => c.status === 'PENDING_REVIEW');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-on-surface">Doctor Triage & Screening Workspace</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Thane Cluster Node #4
            </span>
          </div>
          <p className="text-sm text-on-surface-variant max-w-3xl">
            Real-time AI diagnostic evaluations dispatched from rural Primary Health Centres across Thane district. Grad-CAM visual heatmaps pre-computed for sub-minute grading.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleOpenReview(cases[0]?.id || '')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-semibold text-sm shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            <span>Start Priority Review</span>
          </button>
        </div>
      </div>

      {/* 4-column Bento Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Pending Review */}
        <div className="flex flex-col justify-between p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Cases Pending Review</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-bold">
                +5 new
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{pendingCases.length + urgentCases.length}</span>
              <span className="text-xs text-on-surface-variant">patients in stack</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs">
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              {urgentCases.length} urgent cases
            </span>
            <span className="text-on-surface-variant font-medium">Est. 45 mins</span>
          </div>
        </div>

        {/* Card 2: Reviewed Today */}
        <div className="flex flex-col justify-between p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Reviewed Today</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                Target: 50/day
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-on-surface">41</span>
                <span className="text-xs text-on-surface-variant">/ 50 complete</span>
              </div>
              <span className="text-base font-bold text-primary">82%</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-primary-container" style={{ width: '82%' }} />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-on-surface-variant">
              <span>SLA compliance: 98.4%</span>
              <span className="text-primary font-semibold">9 to target</span>
            </div>
          </div>
        </div>

        {/* Card 3: Macular Edema Threat */}
        <div className="flex flex-col justify-between p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Macular Edema Alert</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                Urgent Action
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-700">3</span>
              <span className="text-xs text-on-surface-variant">sight-threatening</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span>Center-Involving DME</span>
            <span className="text-red-700 font-semibold">Prompt Anti-VEGF</span>
          </div>
        </div>

        {/* Card 4: Tele-Consults Scheduled */}
        <div className="flex flex-col justify-between p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Tele-Consult Roster</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-bold">
                Today
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary">6</span>
              <span className="text-xs text-on-surface-variant">slots remaining</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
            <span>Next session: 02:30 PM</span>
            <span className="text-secondary font-semibold">Sister Lakshmi co-pilot</span>
          </div>
        </div>
      </div>

      {/* Doctor Review Priority Queue */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="p-5 border-b border-surface-container-low flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface">Triage Review Stack</h2>
            <p className="text-xs text-on-surface-variant">
              Cases sorted by algorithm risk score, macular involvement, and waiting duration
            </p>
          </div>

          <span className="text-xs text-on-surface-variant font-medium">
            Showing {cases.length} cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Urgency & Case</th>
                <th className="px-5 py-3">Patient & ABHA ID</th>
                <th className="px-5 py-3">Dispatch Node (PHC)</th>
                <th className="px-5 py-3">AI Preliminary Grade</th>
                <th className="px-5 py-3">Edema & Certainty</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                  {/* Urgency */}
                  <td className="px-5 py-3.5">
                    {c.status === 'FLAGGED_URGENT' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        Urgent
                      </span>
                    ) : c.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant">
                        Routine
                      </span>
                    )}
                    <div className="font-mono text-[11px] text-on-surface-variant mt-1">{c.caseNumber}</div>
                  </td>

                  {/* Patient Info */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-on-surface text-sm">{c.patientName}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {c.patientAge}y, {c.patientGender} • HbA1c: {c.hba1c}%
                    </div>
                  </td>

                  {/* Dispatch Node */}
                  <td className="px-5 py-3.5 text-on-surface">
                    <div className="font-medium">{c.village}</div>
                    <div className="text-[11px] text-on-surface-variant">{c.phcCenter} • {c.timeAgo}</div>
                  </td>

                  {/* AI Preliminary Grade */}
                  <td className="px-5 py-3.5">
                    <DRGradeBadge grade={c.eyes.od.aiGrading.predictedGrade} size="sm" />
                  </td>

                  {/* Edema & Certainty */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-on-surface">
                      Certainty: {c.eyes.od.aiGrading.confidence}%
                    </div>
                    <div className={`text-[11px] ${c.eyes.od.aiGrading.edemaRisk === 'High' ? 'text-red-700 font-bold' : 'text-on-surface-variant'}`}>
                      Macular Risk: {c.eyes.od.aiGrading.edemaRisk}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenReview(c.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-primary-dark transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">biotech</span>
                      <span>Review Scan</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
