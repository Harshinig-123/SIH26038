import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole, 
  Language, 
  ScreeningCase, 
  PatientRecord, 
  TeleconsultAppointment, 
  DRGrade,
  FundusImage,
  Doctor,
  HealthWorker,
  VillagePHCNode,
} from '../types';
import { 
  INITIAL_CASES, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_DOCTORS, 
  INITIAL_HEALTH_WORKERS, 
  INITIAL_VILLAGES 
} from '../data/mockData';

// localStorage helpers
function loadState<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage quota exceeded — silently fail
  }
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  cases: ScreeningCase[];
  patients: PatientRecord[];
  appointments: TeleconsultAppointment[];
  fundusImages: FundusImage[];
  doctors: Doctor[];
  healthWorkers: HealthWorker[];
  villages: VillagePHCNode[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: ScreeningCase | undefined;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: PatientRecord | undefined;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncCount: number;
  triggerSync: () => void;
  isSyncing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addNewCase: (newCase: Omit<ScreeningCase, 'id' | 'caseNumber' | 'createdDate' | 'timeAgo'>) => string;
  addNewPatient: (patient: Omit<PatientRecord, 'id' | 'registeredDate'>) => string;
  verifyCase: (caseId: string, verifiedGrade: DRGrade, doctorNotes: string, referralHospital?: string) => void;
  scheduleAppointment: (appointment: Omit<TeleconsultAppointment, 'id' | 'status'>) => void;
  addFundusImage: (image: FundusImage) => void;
  // Computed KPIs
  totalPatientsCount: number;
  todayScreeningsCount: number;
  urgentCasesCount: number;
  pendingReviewCount: number;
  verifiedTodayCount: number;
  edemaAlertCount: number;
  scheduledAppointmentsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('nurse');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [cases, setCases] = useState<ScreeningCase[]>(() => loadState('retina_cases', INITIAL_CASES));
  const [patients, setPatients] = useState<PatientRecord[]>(() => loadState('retina_patients', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState<TeleconsultAppointment[]>(() => loadState('retina_appointments', INITIAL_APPOINTMENTS));
  const [fundusImages, setFundusImages] = useState<FundusImage[]>(() => loadState('retina_fundus_images', []));
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [healthWorkers] = useState<HealthWorker[]>(INITIAL_HEALTH_WORKERS);
  const [villages] = useState<VillagePHCNode[]>(INITIAL_VILLAGES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    const stored = loadState<ScreeningCase[]>('retina_cases', INITIAL_CASES);
    return stored[0]?.id || '';
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    const stored = loadState<PatientRecord[]>('retina_patients', INITIAL_PATIENTS);
    return stored[0]?.id || '';
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => loadState('retina_sync_count', 3));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Persist to localStorage on state changes
  useEffect(() => { saveState('retina_cases', cases); }, [cases]);
  useEffect(() => { saveState('retina_patients', patients); }, [patients]);
  useEffect(() => { saveState('retina_appointments', appointments); }, [appointments]);
  useEffect(() => { saveState('retina_fundus_images', fundusImages); }, [fundusImages]);
  useEffect(() => { saveState('retina_sync_count', pendingSyncCount); }, [pendingSyncCount]);

  // When changing role, default to appropriate active tab
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentRole]);

  // Computed KPI values derived from actual state
  const totalPatientsCount = patients.length;
  const todayScreeningsCount = cases.filter(c => {
    const d = c.createdDate.toLowerCase();
    return d.includes('today') || d.includes('just now');
  }).length;
  const urgentCasesCount = cases.filter(c => c.status === 'FLAGGED_URGENT').length;
  const pendingReviewCount = cases.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'FLAGGED_URGENT').length;
  const verifiedTodayCount = cases.filter(c => c.status === 'VERIFIED').length;
  const edemaAlertCount = cases.filter(c => 
    c.eyes.od.aiGrading.edemaRisk === 'High' || c.eyes.os.aiGrading.edemaRisk === 'High'
  ).length;
  const scheduledAppointmentsCount = appointments.filter(a => a.status === 'SCHEDULED').length;

  const triggerSync = useCallback(() => {
    if (pendingSyncCount === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
    }, 1400);
  }, [pendingSyncCount]);

  const addNewCase = useCallback((caseData: Omit<ScreeningCase, 'id' | 'caseNumber' | 'createdDate' | 'timeAgo'>): string => {
    const newId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = `Today, ${timeStr}`;
    const newCaseItem: ScreeningCase = {
      ...caseData,
      id: newId,
      caseNumber: `#${newId}`,
      createdDate: dateStr,
      timeAgo: 'Just now',
    };
    setCases(prev => [newCaseItem, ...prev]);
    setSelectedCaseId(newId);
    if (!isOnline) {
      setPendingSyncCount(prev => prev + 1);
    }
    return newId;
  }, [isOnline]);

  const addNewPatient = useCallback((patientData: Omit<PatientRecord, 'id' | 'registeredDate'>): string => {
    const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatientItem: PatientRecord = {
      ...patientData,
      id: newId,
      registeredDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setPatients(prev => [newPatientItem, ...prev]);
    setSelectedPatientId(newId);
    if (!isOnline) {
      setPendingSyncCount(prev => prev + 1);
    }
    return newId;
  }, [isOnline]);

  const verifyCase = useCallback((caseId: string, verifiedGrade: DRGrade, doctorNotes: string, referralHospital?: string) => {
    setCases(prev => prev.map(item => {
      if (item.id === caseId) {
        return {
          ...item,
          status: 'VERIFIED' as const,
          verifiedBy: 'Dr. Arvind Rao, MS',
          verifiedDate: new Date().toLocaleString('en-IN'),
          verifiedGrade,
          doctorNotes,
          referralHospital: referralHospital || 'Sankara Eye Hospital, Thane Base',
        };
      }
      return item;
    }));
  }, []);

  const scheduleAppointment = useCallback((appointmentData: Omit<TeleconsultAppointment, 'id' | 'status'>) => {
    const newId = `APP-${Math.floor(100 + Math.random() * 900)}`;
    const newAppointment: TeleconsultAppointment = {
      ...appointmentData,
      id: newId,
      status: 'SCHEDULED',
    };
    setAppointments(prev => [newAppointment, ...prev]);
  }, []);

  const addFundusImage = useCallback((image: FundusImage) => {
    setFundusImages(prev => [image, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentLanguage,
        setCurrentLanguage,
        cases,
        patients,
        appointments,
        fundusImages,
        doctors,
        healthWorkers,
        villages,
        selectedCaseId,
        setSelectedCaseId,
        selectedCase,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        isOnline,
        setIsOnline,
        pendingSyncCount,
        triggerSync,
        isSyncing,
        activeTab,
        setActiveTab,
        addNewCase,
        addNewPatient,
        verifyCase,
        scheduleAppointment,
        addFundusImage,
        totalPatientsCount,
        todayScreeningsCount,
        urgentCasesCount,
        pendingReviewCount,
        verifiedTodayCount,
        edemaAlertCount,
        scheduledAppointmentsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
