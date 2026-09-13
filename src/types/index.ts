export type UserRole = 'nurse' | 'doctor' | 'patient' | 'analytics';

export type Language = 'en' | 'hi' | 'mr';

export type DRGrade = 
  | 'NO_DR'          // Grade 0
  | 'MILD_NPDR'     // Grade 1
  | 'MODERATE_NPDR' // Grade 2
  | 'SEVERE_NPDR'   // Grade 3
  | 'PDR';          // Grade 4

export type ScreeningStatus = 'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED_URGENT' | 'VERIFIED' | 'REFERRED';

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
