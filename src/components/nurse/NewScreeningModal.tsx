import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGrade, ScreeningCase } from '../../types';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const NewScreeningModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { patients, selectedPatientId: contextPatientId, addNewCase, addFundusImage } = useApp();

  const [step, setStep] = useState<number>(1);
  // Sync with AppContext's selectedPatientId on open
  const [selectedPatientId, setSelectedPatientId] = useState<string>(contextPatientId || patients[0]?.id || '');
  const [hba1c, setHba1c] = useState<number>(9.5);
  const [bpSystolic, setBpSystolic] = useState<number>(138);
  const [bpDiastolic, setBpDiastolic] = useState<number>(84);
  const [diabetesYears, setDiabetesYears] = useState<number>(10);
  const [dilationMethod, setDilationMethod] = useState<string>('Pharmacological (Tropicamide 0.5%)');
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  // Image upload state
  const [odImage, setOdImage] = useState<string | null>(null);
  const [osImage, setOsImage] = useState<string | null>(null);
  const [odFileName, setOdFileName] = useState<string>('');
  const [osFileName, setOsFileName] = useState<string>('');
  const [odQuality, setOdQuality] = useState<{ score: number; status: string } | null>(null);
  const [osQuality, setOsQuality] = useState<{ score: number; status: string } | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const odInputRef = useRef<HTMLInputElement>(null);
  const osInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedCaseId, setSubmittedCaseId] = useState<string>('');

  // Sync selectedPatientId from context when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPatientId(contextPatientId || patients[0]?.id || '');
      // Reset all state on open
      setStep(1);
      setHba1c(9.5);
      setBpSystolic(138);
      setBpDiastolic(84);
      setDiabetesYears(10);
      setDilationMethod('Pharmacological (Tropicamide 0.5%)');
      setConsentChecked(false);
      setOdImage(null);
      setOsImage(null);
      setOdFileName('');
      setOsFileName('');
      setOdQuality(null);
      setOsQuality(null);
      setUploadError('');
      setSubmitted(false);
      setSubmittedCaseId('');
    }
  }, [isOpen, contextPatientId, patients]);

  if (!isOpen) return null;

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Handle file upload and convert to base64 data URL
  const handleImageUpload = (file: File, eye: 'od' | 'os') => {
    setUploadError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Create an image element to check dimensions
      const img = new Image();
      img.onload = () => {
        // Basic quality assessment based on dimensions
        const minDim = Math.min(img.width, img.height);
        let score = 0;
        let status = '';
        if (minDim >= 1000) { score = 95; status = 'Excellent'; }
        else if (minDim >= 500) { score = 85; status = 'Good'; }
        else if (minDim >= 200) { score = 70; status = 'Acceptable'; }
        else { score = 45; status = 'Poor - Consider retake'; }

        if (eye === 'od') {
          setOdImage(dataUrl);
          setOdFileName(file.name);
          setOdQuality({ score, status });
        } else {
          setOsImage(dataUrl);
          setOsFileName(file.name);
          setOsQuality({ score, status });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent, eye: 'od' | 'os') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file, eye);
  };

  const handleSubmitCase = () => {
    if (!currentPatient) return;

    // Create default EyeScan structure
    const createEyeScan = (imageUrl: string, grade: DRGrade) => ({
      imageUrl,
      focusQualityScore: 0,
      mediaClarity: 'Adequate' as const,
      cameraModel: 'Manual Upload',
      pupilStatus: dilationMethod,
      aiGrading: {
        predictedGrade: grade,
        confidence: 0,
        edemaRisk: 'Low' as const,
        macularInvolvement: false,
      },
      lesions: [],
    });

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
      status: 'PENDING_REVIEW',
      urgency: 'routine',
      eyes: {
        od: createEyeScan(odImage || '', 'NO_DR'),
        os: createEyeScan(osImage || '', 'NO_DR'),
      },
    };

    const caseId = addNewCase(newCase);

    // Store fundus images if uploaded
    const now = new Date().toISOString();
    if (odImage) {
      addFundusImage({
        image_id: `IMG-${Math.floor(10000 + Math.random() * 90000)}`,
        case_id: caseId,
        image_data: odImage,
        eye_side: 'OD',
        captured_at: now,
        uploaded_at: now,
        sync_status: 'pending',
        quality_status: odQuality && odQuality.score >= 70 ? 'good' : 'acceptable',
        quality_score: odQuality?.score || 0,
        quality_notes: odQuality?.status || '',
        retake_required: (odQuality?.score || 0) < 50,
      });
    }
    if (osImage) {
      addFundusImage({
        image_id: `IMG-${Math.floor(10000 + Math.random() * 90000)}`,
        case_id: caseId,
        image_data: osImage,
        eye_side: 'OS',
        captured_at: now,
        uploaded_at: now,
        sync_status: 'pending',
        quality_status: osQuality && osQuality.score >= 70 ? 'good' : 'acceptable',
        quality_score: osQuality?.score || 0,
        quality_notes: osQuality?.status || '',
        retake_required: (osQuality?.score || 0) < 50,
      });
    }

    setSubmittedCaseId(caseId);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
  };

  // Success screen after submission
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-surface-container-high shadow-xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-700 text-[36px]">check_circle</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Screening Case Created!</h2>
          <p className="text-sm text-on-surface-variant">
            Case <span className="font-mono font-bold text-primary">#{submittedCaseId}</span> for <strong>{currentPatient?.name}</strong> has been submitted to the tele-review queue.
          </p>
          {(odImage || osImage) && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[16px]">image</span>
              <span>{[odImage && 'OD', osImage && 'OS'].filter(Boolean).join(' + ')} fundus image(s) uploaded</span>
            </div>
          )}
          <p className="text-xs text-on-surface-variant">
            AI analysis will be available once the model is integrated.
          </p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-sm shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-surface-container-high shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">photo_camera</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">New Retinal Screening Intake</h2>
              <p className="text-xs text-on-surface-variant">Step {step} of 3: {step === 1 ? 'Patient & Consent' : step === 2 ? 'Upload Fundus Images' : 'Review & Submit'}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: PATIENT & CONSENT */}
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

              {/* Consent Checkbox */}
              <div className="pt-3 border-t border-surface-container-high">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-on-surface-variant">
                    Patient has provided informed consent for retinal screening, AI-assisted analysis, and ABHA-linked data sharing as per DISHA guidelines.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: IMAGE UPLOAD */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="bg-primary-fixed/20 p-3 rounded-xl border border-primary/20 text-[11px] text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">upload_file</span>
                <span>Upload fundus photographs for both eyes. Drag & drop or click to browse. Supports JPEG, PNG (max 10MB each).</span>
              </div>

              {uploadError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Bilateral Upload Zones */}
              <div className="grid grid-cols-2 gap-4">
                {/* Right Eye (OD) Upload */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-on-surface">Right Eye (OD)</span>
                  <div
                    onClick={() => odInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'od')}
                    className={`relative w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all overflow-hidden ${
                      odImage
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-outline-variant/50 bg-surface-container-low hover:border-primary hover:bg-primary-fixed/10'
                    }`}
                  >
                    {odImage ? (
                      <>
                        <img src={odImage} alt="OD Fundus" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                          OD
                        </div>
                        {odQuality && (
                          <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] text-white font-semibold ${
                            odQuality.score >= 70 ? 'bg-emerald-700' : 'bg-amber-600'
                          }`}>
                            Quality: {odQuality.score}%
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setOdImage(null); setOdFileName(''); setOdQuality(null); }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-on-surface-variant text-[36px]">add_photo_alternate</span>
                        <span className="text-[11px] text-on-surface-variant mt-1">Click or drag to upload</span>
                        <span className="text-[10px] text-on-surface-variant">Right Eye (OD)</span>
                      </>
                    )}
                    <input
                      ref={odInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'od'); }}
                    />
                  </div>
                  {odFileName && (
                    <span className="text-[10px] text-on-surface-variant truncate max-w-full">{odFileName}</span>
                  )}
                  {odQuality && (
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      odQuality.score >= 70 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {odQuality.score >= 70 ? 'check_circle' : 'warning'}
                      </span>
                      {odQuality.status}
                    </span>
                  )}
                </div>

                {/* Left Eye (OS) Upload */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-on-surface">Left Eye (OS)</span>
                  <div
                    onClick={() => osInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'os')}
                    className={`relative w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-all overflow-hidden ${
                      osImage
                        ? 'border-emerald-400 bg-emerald-50/30'
                        : 'border-outline-variant/50 bg-surface-container-low hover:border-primary hover:bg-primary-fixed/10'
                    }`}
                  >
                    {osImage ? (
                      <>
                        <img src={osImage} alt="OS Fundus" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                          OS
                        </div>
                        {osQuality && (
                          <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] text-white font-semibold ${
                            osQuality.score >= 70 ? 'bg-emerald-700' : 'bg-amber-600'
                          }`}>
                            Quality: {osQuality.score}%
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setOsImage(null); setOsFileName(''); setOsQuality(null); }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-on-surface-variant text-[36px]">add_photo_alternate</span>
                        <span className="text-[11px] text-on-surface-variant mt-1">Click or drag to upload</span>
                        <span className="text-[10px] text-on-surface-variant">Left Eye (OS)</span>
                      </>
                    )}
                    <input
                      ref={osInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'os'); }}
                    />
                  </div>
                  {osFileName && (
                    <span className="text-[10px] text-on-surface-variant truncate max-w-full">{osFileName}</span>
                  )}
                  {osQuality && (
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                      osQuality.score >= 70 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {osQuality.score >= 70 ? 'check_circle' : 'warning'}
                      </span>
                      {osQuality.status}
                    </span>
                  )}
                </div>
              </div>

              {/* AI Analysis Note */}
              <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/30 text-[11px] text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">smart_toy</span>
                <span>AI analysis (DR grading, Grad-CAM heatmap, lesion detection) will be available once the AI model is integrated. Images will be stored for future analysis.</span>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
                <span className="font-bold text-sm text-on-surface">Screening Summary</span>

                {/* Patient Info */}
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                  <div className="font-semibold text-on-surface">{currentPatient?.name}</div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                    {currentPatient?.age}y, {currentPatient?.gender} • ABHA: {currentPatient?.abhaId}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    HbA1c: {hba1c}% • BP: {bpSystolic}/{bpDiastolic} • T2D: {diabetesYears}y
                  </div>
                </div>

                {/* Uploaded Images Preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-on-surface">Right Eye (OD)</span>
                    {odImage ? (
                      <img src={odImage} alt="OD" className="w-full aspect-square rounded-lg object-cover" />
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="text-[11px]">No image</span>
                      </div>
                    )}
                    {odQuality && (
                      <span className="text-[10px] text-emerald-700 font-semibold">Quality: {odQuality.score}%</span>
                    )}
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-on-surface">Left Eye (OS)</span>
                    {osImage ? (
                      <img src={osImage} alt="OS" className="w-full aspect-square rounded-lg object-cover" />
                    ) : (
                      <div className="w-full aspect-square rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="text-[11px]">No image</span>
                      </div>
                    )}
                    {osQuality && (
                      <span className="text-[10px] text-emerald-700 font-semibold">Quality: {osQuality.score}%</span>
                    )}
                  </div>
                </div>

                {/* AI Pending Notice */}
                <div className="p-3 bg-surface-container rounded-xl text-xs text-on-surface-variant flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">hourglass_top</span>
                  <div>
                    <strong className="text-on-surface">AI Analysis Pending</strong>
                    <p className="text-[11px] mt-0.5">
                      DR grading, lesion detection, and Grad-CAM heatmaps will be generated once the AI model is integrated. This case will be queued for manual doctor review.
                    </p>
                  </div>
                </div>
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
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !consentChecked}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-primary-container hover:bg-primary text-on-primary transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{step === 1 ? 'Next: Upload Images' : 'Next: Review'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleSubmitCase}
              disabled={!odImage && !osImage}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-on-primary transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Submit Screening Case</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
