export type UserRole = 'nurse' | 'doctor' | 'patient';

export type Language = 'en' | 'hi' | 'mr';

export type DRGrade = 
  | 'NO_DR'          // Grade 0
  | 'MILD_NPDR'     // Grade 1
  | 'MODERATE_NPDR' // Grade 2
  | 'SEVERE_NPDR'   // Grade 3
  | 'PDR';          // Grade 4

export type ScreeningStatus = 'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED_URGENT' | 'VERIFIED' | 'REFERRED';

// --- ER Diagram Entities ---

// HEALTH_WORKER (Nurse / ASHA / ANM)
export interface HealthWorker {
  worker_id: string;
  name: string;
  role: 'Nurse' | 'ASHA' | 'ANM';
  phone: string;
  phc_name: string;
  email: string;
  status: 'active' | 'inactive';
}

// DOCTOR
export interface Doctor {
  doctor_id: string;
  name: string;
  specialization: string;
  phone: string;
  hospital_name: string;
  email: string;
  status: 'active' | 'inactive';
}

// VILLAGE_PHC_NODE
export interface VillagePHCNode {
  village_id: string;
  village_name: string;
  phc_name: string;
  district: string;
  population: number;
  diabetes_prevalence: number;
  latitude: number;
  longitude: number;
}

// CONSENT
export interface Consent {
  consent_id: string;
  patient_id: string;
  consent_status: 'granted' | 'denied' | 'withdrawn';
  consent_date: string;
  consent_type: 'screening' | 'data_sharing' | 'teleconsult';
}

// FUNDUS_IMAGE — stores actual uploaded image data
export interface FundusImage {
  image_id: string;
  case_id: string;
  image_data: string; // base64 data URL from file upload
  eye_side: 'OD' | 'OS';
  captured_at: string;
  uploaded_at: string;
  sync_status: 'synced' | 'pending' | 'failed';
  quality_status: 'good' | 'acceptable' | 'poor' | 'pending';
  quality_score: number; // 0-100
  quality_notes: string;
  retake_required: boolean;
}

// AI_ANALYSIS (Tier 1 – Individual) — placeholder for future AI integration
export interface AIAnalysis {
  analysis_id: string;
  image_id: string;
  icdr_level: DRGrade;
  confidence_score: number;
  uncertainty: number;
  trust_flag: boolean;
  priority: 'routine' | 'moderate' | 'urgent';
  analysis_status: 'pending' | 'completed' | 'failed';
  inference_time_ms: number;
}

// AI_REPORT — placeholder for future AI integration
export interface AIReport {
  report_id: string;
  analysis_id: string;
  grade_name: string;
  severity: string;
  summary: string;
  urgency: string;
  lesion_counts: number;
  gradcam_path: string;
  generated_at: string;
}

// DOCTOR_REVIEW
export interface DoctorReview {
  review_id: string;
  case_id: string;
  doctor_id: string;
  report_id: string;
  decision: 'confirmed' | 'overridden' | 'referred';
  doctor_notes: string;
  final_diagnosis: string;
  reviewed_at: string;
}

// --- Existing Component-Level Types (kept for backward compat) ---

export interface LesionMarker {
  id: string;
  type: 'microaneurysm' | 'hemorrhage' | 'hard_exudate' | 'cotton_wool_spot' | 'neovascularization';
  label: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  confidence: number;
}

export interface EyeScan {
  imageUrl: string;
  focusQualityScore: number; // 0-100
  mediaClarity: 'Excellent' | 'Adequate' | 'Suboptimal';
  cameraModel: string;
  pupilStatus: string;
  aiGrading: {
    predictedGrade: DRGrade;
    confidence: number;
    edemaRisk: 'Low' | 'Moderate' | 'High';
    macularInvolvement: boolean;
  };
  lesions: LesionMarker[];
}

export interface ScreeningCase {
  id: string;
  caseNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  abhaId: string;
  village: string;
  phcCenter: string;
  createdDate: string;
  timeAgo: string;
  nurseName: string;
  hba1c: number;
  bp: string;
  diabetesDurationYears: number;
  status: ScreeningStatus;
  urgency: 'routine' | 'moderate' | 'urgent';
  verifiedBy?: string;
  verifiedDate?: string;
  verifiedGrade?: DRGrade;
  doctorNotes?: string;
  referralHospital?: string;
  teleconsultScheduled?: boolean;
  eyes: {
    od: EyeScan; // Right Eye
    os: EyeScan; // Left Eye
  };
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  abhaId: string;
  aadhaarLast4: string;
  village: string;
  phcCenter: string;
  hba1c: number;
  bp: string;
  diabetesYears: number;
  lastScreeningDate: string;
  lastDRGrade: DRGrade;
  nextAppointmentDate?: string;
  registeredDate: string;
  consentStatus?: 'granted' | 'denied' | 'withdrawn';
  consentDate?: string;
}

export interface TeleconsultAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  phcCenter: string;
  scheduledTime: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reason: string;
  drGrade: DRGrade;
}
