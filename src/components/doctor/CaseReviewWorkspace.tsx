import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGrade } from '../../types';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const CaseReviewWorkspace: React.FC = () => {
  const { selectedCase, cases, setSelectedCaseId, verifyCase, setActiveTab } = useApp();

  const activeCase = selectedCase || cases[0];

  // Viewport states
  const [activeEye, setActiveEye] = useState<'od' | 'os'>('od');
  const [zoomLevel, setZoomLevel] = useState<number>(120);
  const [redFreeFilter, setRedFreeFilter] = useState<boolean>(false);
  const [invertFilter, setInvertFilter] = useState<boolean>(false);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [showLesions, setShowLesions] = useState<boolean>(true);

  // Doctor Clinical Decision state
  const [verifiedGrade, setVerifiedGrade] = useState<DRGrade>(
    activeCase?.eyes[activeEye].aiGrading.predictedGrade || 'SEVERE_NPDR'
  );
  const [doctorNotes, setDoctorNotes] = useState<string>(
    activeCase?.doctorNotes ||
      'Severe non-proliferative diabetic retinopathy (Grade 3) with imminent macular edema risk. Urgent referral to Sankara Eye Hospital for OCT angiography and possible anti-VEGF injection within 7 days.'
  );
  const [referralHospital, setReferralHospital] = useState<string>(
    'Sankara Eye Hospital, Thane Base'
  );
  const [signedSuccess, setSignedSuccess] = useState<boolean>(false);

  if (!activeCase) {
    return (
      <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high">
        <p className="text-on-surface-variant text-sm">No case selected for review.</p>
      </div>
    );
  }

  const eyeData = activeCase.eyes[activeEye];

  // Case navigation helper
  const currentIndex = cases.findIndex(c => c.id === activeCase.id);
  const prevCase = currentIndex > 0 ? cases[currentIndex - 1] : null;
  const nextCase = currentIndex < cases.length - 1 ? cases[currentIndex + 1] : null;

  const handleSignAndFinalize = () => {
    verifyCase(activeCase.id, verifiedGrade, doctorNotes, referralHospital);
    setSignedSuccess(true);
    setTimeout(() => {
      setSignedSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* 1. TOP PATIENT DEMOGRAPHICS & NAVIGATION BAR */}
      <section className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs p-5 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-on-surface">{activeCase.patientName}</span>
              <span className="text-xs text-on-surface-variant font-medium">
                ({activeCase.patientAge}y, {activeCase.patientGender})
              </span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
              <span>{activeCase.village} ({activeCase.phcCenter})</span>
            </div>
            <span className="text-outline-variant">•</span>
            <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-xs font-mono font-semibold text-on-surface">
              <span className="text-on-surface-variant text-[10px] font-sans">ABHA:</span>
              <span>{activeCase.abhaId}</span>
            </div>
          </div>

          {/* Action & Nav Cluster */}
          <div className="flex items-center gap-2">
            {activeCase.status === 'FLAGGED_URGENT' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 animate-pulse">
                <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                High Priority Urgent Review
              </span>
            )}

            <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs">
              <button
                disabled={!prevCase}
                onClick={() => prevCase && setSelectedCaseId(prevCase.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Prev</span>
              </button>
              <div className="w-px h-4 bg-outline-variant/40" />
              <button
                disabled={!nextCase}
                onClick={() => nextCase && setSelectedCaseId(nextCase.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-primary font-bold hover:bg-surface-container-lowest disabled:opacity-30"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Biomarkers Sub-row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-surface-container-low rounded-xl px-4 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
            <div>
              <span>Type 2 Diabetes: </span>
              <strong className="text-on-surface">{activeCase.diabetesDurationYears} Years History</strong>
            </div>
            <div>
              <span>HbA1c: </span>
              <strong className={`px-1.5 py-0.5 rounded text-[11px] ${activeCase.hba1c > 8 ? 'bg-red-100 text-red-800' : 'bg-surface text-on-surface'}`}>
                {activeCase.hba1c}% ({activeCase.hba1c > 8 ? 'Uncontrolled' : 'Controlled'})
              </strong>
            </div>
            <div>
              <span>BP: </span>
              <strong className="text-on-surface">{activeCase.bp} mmHg</strong>
            </div>
            <div>
              <span>Pupil Dilation: </span>
              <strong className="text-on-surface">{eyeData.pupilStatus}</strong>
            </div>
          </div>

          <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">history</span>
            Screened {activeCase.createdDate} by {activeCase.nurseName}
          </span>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN CLINICAL DIAGNOSTIC WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANEL: FUNDUS IMAGERY & EXPLAINABLE AI HEATMAP (col-span-7) */}
        <section className="lg:col-span-7 flex flex-col gap-3 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs p-5">
          {/* Viewport Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-surface-container-low">
            {/* Bilateral Eye Tabs */}
            <div className="flex items-center bg-surface-container rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveEye('od')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeEye === 'od'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Right Eye (OD)</span>
                {activeCase.eyes.od.aiGrading.predictedGrade === 'SEVERE_NPDR' && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveEye('os')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeEye === 'os'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Left Eye (OS)</span>
              </button>
            </div>

            {/* Optical Filters & Zoom Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-xs text-on-surface-variant">
                <button
                  onClick={() => setZoomLevel(Math.max(80, zoomLevel - 20))}
                  className="p-1 hover:bg-surface-container-high rounded"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                </button>
                <span className="px-2 font-mono text-[11px] font-semibold">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(220, zoomLevel + 20))}
                  className="p-1 hover:bg-surface-container-high rounded"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 hover:bg-surface-container-high rounded"
                  title="Reset Fit"
                >
                  <span className="material-symbols-outlined text-[18px]">fit_screen</span>
                </button>
              </div>

              {/* Red-Free Filter Button */}
              <button
                onClick={() => setRedFreeFilter(!redFreeFilter)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  redFreeFilter
                    ? 'bg-emerald-700 text-white border-emerald-800 font-semibold'
                    : 'bg-surface-container border-outline-variant/40 text-on-surface hover:bg-surface-container-high'
                }`}
                title="Green-channel monochromatic filter to highlight microaneurysms"
              >
                <span className="material-symbols-outlined text-[16px]">filter_vintage</span>
                <span>Red-Free</span>
              </button>

              {/* Invert Contrast Button */}
              <button
                onClick={() => setInvertFilter(!invertFilter)}
                className={`p-1.5 rounded-lg text-xs border transition-colors ${
                  invertFilter
                    ? 'bg-primary text-on-primary border-primary font-semibold'
                    : 'bg-surface-container border-outline-variant/40 text-on-surface hover:bg-surface-container-high'
                }`}
                title="Invert Contrast"
              >
                <span className="material-symbols-outlined text-[16px]">invert_colors</span>
              </button>
            </div>
          </div>

          {/* MAIN RETINAL FUNDUS VIEWPORT */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-surface-container-high">
            {/* The Image with zoom & optical filters */}
            <div
              className="relative w-full h-full transition-transform duration-200 origin-center flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                filter: `${redFreeFilter ? 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(300%) contrast(140%)' : ''} ${invertFilter ? 'invert(100%)' : ''}`,
              }}
            >
              <img
                src={eyeData.imageUrl}
                alt={`${activeEye.toUpperCase()} Retinal Scan`}
                className="w-full h-full object-cover select-none"
              />

              {/* Explainable AI Grad-CAM Visual Heatmap Simulation Overlay */}
              {showGradCam && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70 transition-opacity duration-300"
                  style={{
                    background: `
                      radial-gradient(circle at 45% 40%, rgba(255, 0, 0, 0.75) 0%, rgba(255, 140, 0, 0.5) 25%, rgba(255, 255, 0, 0.3) 45%, transparent 65%),
                      radial-gradient(circle at 58% 52%, rgba(255, 0, 0, 0.6) 0%, rgba(255, 200, 0, 0.4) 30%, transparent 55%)
                    `,
                  }}
                />
              )}

              {/* Annotated Lesion Markers */}
              {showLesions &&
                eyeData.lesions.map((les) => (
                  <div
                    key={les.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${les.x}%`, top: `${les.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Ring highlight */}
                    <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-pulse flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    </div>
                    {/* Hover Tooltip */}
                    <div className="absolute left-1/2 -top-7 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30 font-sans pointer-events-none">
                      <span>{les.label}</span>
                      <span className="text-amber-400 font-bold">({les.confidence}%)</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Viewport Floating HUD Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
              <span className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded-md font-bold">
                {activeEye.toUpperCase()} • 45° Macula-Disc
              </span>
              <span className="bg-emerald-800/90 text-white text-[10px] font-semibold px-2 py-1 rounded-md">
                Focus Score: {eyeData.focusQualityScore}% ({eyeData.mediaClarity})
              </span>
            </div>

            {/* Toggles on the bottom right */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setShowGradCam(!showGradCam)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md shadow-md transition-all ${
                  showGradCam
                    ? 'bg-amber-500 text-black border border-amber-400'
                    : 'bg-black/70 text-white hover:bg-black/90'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>Grad-CAM AI Heatmap: {showGradCam ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setShowLesions(!showLesions)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md shadow-md transition-all ${
                  showLesions
                    ? 'bg-primary text-on-primary'
                    : 'bg-black/70 text-white hover:bg-black/90'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">target</span>
                <span>Lesions: {showLesions ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Lesions Found Summary */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                Detected Retinal Pathology ({eyeData.lesions.length} identified)
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Camera: {eyeData.cameraModel}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {eyeData.lesions.map((les) => (
                <div
                  key={les.id}
                  className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/30 text-[11px]"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-on-surface">{les.label}</span>
                  <span className="text-primary font-bold">({les.confidence}%)</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: AI ASSESSMENT & DOCTOR DECISIONING (col-span-5) */}
        <section className="lg:col-span-5 flex flex-col gap-4 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs p-5">
          {/* AI Model Findings Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Explainable AI Diagnostic Synthesis
              </span>
              <span className="text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                Model Certainty: {eyeData.aiGrading.confidence}%
              </span>
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-on-surface-variant font-medium block">
                  Recommended DR Classification
                </span>
                <div className="mt-1">
                  <DRGradeBadge grade={eyeData.aiGrading.predictedGrade} size="md" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant font-medium block">Macular Edema</span>
                <span className={`text-xs font-bold ${eyeData.aiGrading.edemaRisk === 'High' ? 'text-red-700' : 'text-emerald-700'}`}>
                  {eyeData.aiGrading.edemaRisk} Risk
                </span>
              </div>
            </div>

            {eyeData.aiGrading.macularInvolvement && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-red-700 text-[18px]">warning</span>
                <span><strong>Clinically Significant Macular Edema (CSME) Threat:</strong> Exudates encroaching within 1 disc diameter of fovea centralis.</span>
              </div>
            )}
          </div>

          {/* Doctor Clinical Sign-Off Form */}
          <div className="flex flex-col gap-3 text-xs">
            <label className="font-bold text-on-surface text-xs block">
              1. Confirm or Override Clinical DR Grade:
            </label>

            <div className="grid grid-cols-1 gap-1.5">
              {[
                { grade: 'NO_DR' as DRGrade, label: 'Grade 0: No Apparent Retinopathy' },
                { grade: 'MILD_NPDR' as DRGrade, label: 'Grade 1: Mild NPDR (Microaneurysms only)' },
                { grade: 'MODERATE_NPDR' as DRGrade, label: 'Grade 2: Moderate NPDR (More than microaneurysms)' },
                { grade: 'SEVERE_NPDR' as DRGrade, label: 'Grade 3: Severe NPDR (4:2:1 Rule triggered)' },
                { grade: 'PDR' as DRGrade, label: 'Grade 4: Proliferative Diabetic Retinopathy (PDR)' },
              ].map((item) => (
                <label
                  key={item.grade}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    verifiedGrade === item.grade
                      ? 'bg-primary-fixed/30 border-primary font-semibold text-primary'
                      : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="drGrade"
                      checked={verifiedGrade === item.grade}
                      onChange={() => setVerifiedGrade(item.grade)}
                      className="text-primary focus:ring-primary"
                    />
                    <span>{item.label}</span>
                  </div>
                  {eyeData.aiGrading.predictedGrade === item.grade && (
                    <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.2 rounded font-mono">
                      AI match
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Doctor Recommendation & Notes */}
            <div className="pt-2">
              <label className="font-bold text-on-surface text-xs block mb-1">
                2. Clinical Impressions & Ophthalmology Plan:
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Referral Destination */}
            <div>
              <label className="font-bold text-on-surface text-xs block mb-1">
                3. Triage Routing / Base Hospital:
              </label>
              <select
                value={referralHospital}
                onChange={(e) => setReferralHospital(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface font-medium"
              >
                <option value="Sankara Eye Hospital, Thane Base">Sankara Eye Hospital, Thane Base (Tertiary)</option>
                <option value="KEM Hospital Ophthalmology, Mumbai">KEM Hospital Ophthalmology, Mumbai</option>
                <option value="District Civil Hospital, Thane">District Civil Hospital, Thane</option>
                <option value="Routine PHC Community Followup">Routine PHC Community Followup (6 Months)</option>
              </select>
            </div>

            {/* Success Banner */}
            {signedSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-bounce">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Case #{activeCase.caseNumber} successfully signed by Dr. Arvind Rao! Tele-order dispatched.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-secondary text-secondary font-semibold hover:bg-secondary-fixed/30 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">video_call</span>
                <span>Tele-Consult</span>
              </button>

              <button
                onClick={handleSignAndFinalize}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">draw</span>
                <span>Sign & Finalize</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
