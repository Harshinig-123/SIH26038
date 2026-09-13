import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGrade, ScreeningCase } from '../../types';
import { FUNDUS_IMAGES } from '../../data/mockData';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const NewScreeningModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { patients, addNewCase } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [hba1c, setHba1c] = useState<number>(9.5);
  const [bpSystolic, setBpSystolic] = useState<number>(138);
  const [bpDiastolic, setBpDiastolic] = useState<number>(84);
  const [diabetesYears, setDiabetesYears] = useState<number>(10);
  const [dilationMethod, setDilationMethod] = useState<string>('Pharmacological (Tropicamide 0.5%)');

  // Camera capture simulation
  const [odCaptured, setOdCaptured] = useState<boolean>(true);
  const [osCaptured, setOsCaptured] = useState<boolean>(true);
  const [simulatedGrade, setSimulatedGrade] = useState<DRGrade>('SEVERE_NPDR');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleCaptureCamera = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setOdCaptured(true);
      setOsCaptured(true);
      setIsAnalyzing(false);
      setStep(3);
    }, 1200);
  };

  const handleSubmitCase = () => {
    const newCase: Omit<ScreeningCase, 'id' | 'caseNumber' | 'createdDate' | 'timeAgo'> = {
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      abhaId: currentPatient.abhaId,
      village: currentPatient.village,
      phcCenter: currentPatient.phcCenter,
      nurseName: 'Sister Lakshmi Sharma, RN',
      hba1c: Number(hba1c),
      bp: `${bpSystolic}/${bpDiastolic}`,
      diabetesDurationYears: Number(diabetesYears),
      status: simulatedGrade === 'SEVERE_NPDR' || simulatedGrade === 'PDR' ? 'FLAGGED_URGENT' : 'PENDING_REVIEW',
      urgency: simulatedGrade === 'SEVERE_NPDR' || simulatedGrade === 'PDR' ? 'urgent' : 'routine',
      eyes: {
        od: {
          imageUrl: FUNDUS_IMAGES.severeOD,
          focusQualityScore: 95,
          mediaClarity: 'Excellent',
          cameraModel: 'Remidio NM-FOP Handheld 45°',
          pupilStatus: dilationMethod,
          aiGrading: {
            predictedGrade: simulatedGrade,
            confidence: 96.2,
            edemaRisk: simulatedGrade === 'SEVERE_NPDR' ? 'High' : 'Moderate',
            macularInvolvement: simulatedGrade === 'SEVERE_NPDR',
          },
          lesions: [
            { id: 'l1', type: 'microaneurysm', label: 'Microaneurysms', x: 45, y: 42, confidence: 97 },
            { id: 'l2', type: 'hemorrhage', label: 'Hemorrhage', x: 50, y: 55, confidence: 93 },
          ],
        },
        os: {
          imageUrl: FUNDUS_IMAGES.severeOS,
          focusQualityScore: 92,
          mediaClarity: 'Excellent',
          cameraModel: 'Remidio NM-FOP Handheld 45°',
          pupilStatus: dilationMethod,
          aiGrading: {
            predictedGrade: 'MODERATE_NPDR',
            confidence: 91.4,
            edemaRisk: 'Moderate',
            macularInvolvement: false,
          },
          lesions: [
            { id: 'l3', type: 'microaneurysm', label: 'Microaneurysms', x: 40, y: 48, confidence: 91 },
          ],
        },
      },
    };

    addNewCase(newCase);
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-surface-container-high shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">photo_camera</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">New Retinal Screening Intake</h2>
              <p className="text-xs text-on-surface-variant">Step {step} of 3: {step === 1 ? 'Patient Demographics' : step === 2 ? 'Fundus Camera Capture' : 'AI Analysis Verification'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: PATIENT & BIOMETRIC DETAILS */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Select Patient from Registry</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender}) — ABHA: {p.abhaId} — {p.village}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Quick Preview Card */}
              {currentPatient && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-on-surface">{currentPatient.name}</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      ABHA: {currentPatient.abhaId} • Aadhaar: ****-****-{currentPatient.aadhaarLast4}
                    </div>
                    <div className="text-[11px] text-primary font-medium mt-1">
                      {currentPatient.village} ({currentPatient.phcCenter})
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                    Camp Enrolled
                  </span>
                </div>
              )}

              {/* Clinical Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">HbA1c Level (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hba1c}
                    onChange={(e) => setHba1c(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-[10px] text-on-surface-variant">Standard lab or point-of-care reader</span>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Blood Pressure (mmHg)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(Number(e.target.value))}
                      placeholder="Systolic"
                      className="w-1/2 bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(Number(e.target.value))}
                      placeholder="Diastolic"
                      className="w-1/2 bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Known Diabetes Duration (Years)</label>
                  <input
                    type="number"
                    value={diabetesYears}
                    onChange={(e) => setDiabetesYears(Number(e.target.value))}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-on-surface mb-1">Pupil Dilation Protocol</label>
                  <select
                    value={dilationMethod}
                    onChange={(e) => setDilationMethod(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  >
                    <option value="Pharmacological (Tropicamide 0.5%)">Pharmacological (0.5% Tropicamide)</option>
                    <option value="Non-Mydriatic (Natural Pupil in Darkened Room)">Non-Mydriatic (Dark Room)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FUNDUS CAMERA CAPTURE */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="bg-primary-fixed/20 p-3 rounded-xl border border-primary/20 text-[11px] text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Camera Connected: <strong>Remidio Handheld Fundus NM-FOP (USB-C OTG)</strong></span>
              </div>

              {/* Bilateral Viewports */}
              <div className="grid grid-cols-2 gap-4">
                {/* Right Eye */}
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center">
                  <span className="font-bold text-on-surface mb-2">Right Eye (OD)</span>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={FUNDUS_IMAGES.severeOD}
                      alt="OD Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                      OD • 45°
                    </div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-emerald-700 text-[10px] text-white font-semibold">
                      Quality: 95%
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Sharp Focus & Disc Centered
                  </span>
                </div>

                {/* Left Eye */}
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center">
                  <span className="font-bold text-on-surface mb-2">Left Eye (OS)</span>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={FUNDUS_IMAGES.severeOS}
                      alt="OS Scan"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                      OS • 45°
                    </div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-emerald-700 text-[10px] text-white font-semibold">
                      Quality: 92%
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Sharp Focus & Macula Clear
                  </span>
                </div>
              </div>

              {/* Simulation DR Grade Selector */}
              <div className="bg-surface-container p-3 rounded-xl">
                <span className="font-semibold text-on-surface block mb-1">Simulate AI Diagnostic Grade:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['NO_DR', 'MILD_NPDR', 'MODERATE_NPDR', 'SEVERE_NPDR', 'PDR'] as DRGrade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSimulatedGrade(g)}
                      className={`p-1.5 rounded-lg text-[10px] font-semibold transition-all text-center border ${
                        simulatedGrade === g
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                      }`}
                    >
                      {g.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSTANT AI VERIFICATION */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">Edge AI Diagnostic Triage</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    Offline Model v2.4 (Quantized)
                  </span>
                </div>

                <div className="flex items-center justify-between bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant font-medium">Predicted DR Classification</span>
                    <div className="mt-1">
                      <DRGradeBadge grade={simulatedGrade} size="lg" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant font-medium">Model Certainty</span>
                    <div className="text-lg font-bold text-primary">96.4%</div>
                  </div>
                </div>

                {simulatedGrade === 'SEVERE_NPDR' || simulatedGrade === 'PDR' ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-700 text-[20px] shrink-0">emergency</span>
                    <div>
                      <strong>Urgent Referral Recommended!</strong>
                      <p className="text-[11px] mt-0.5">
                        Multiple microaneurysms and potential macular edema detected. Automated alert dispatched to Dr. Arvind Rao at Sankara Thane Hospital.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-[20px] shrink-0">check_circle</span>
                    <div>
                      <strong>Routine Tracking Recommended</strong>
                      <p className="text-[11px] mt-0.5">
                        Low risk of immediate vision loss. Standard 6-12 month tele-camp follow-up advised.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1) setStep(2);
                if (step === 2) handleCaptureCamera();
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-primary-container hover:bg-primary text-on-primary transition-all shadow-xs"
            >
              <span>{step === 1 ? 'Next: Capture Retina' : isAnalyzing ? 'Running Edge AI...' : 'Analyze Fundus'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSubmitCase}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-on-primary transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Submit Case to Tele-Queue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
