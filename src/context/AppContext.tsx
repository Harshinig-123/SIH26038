import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  ScreeningCase, 
  PatientRecord, 
  TeleconsultAppointment, 
  DRGrade 
} from '../types';
import { INITIAL_CASES, INITIAL_PATIENTS, INITIAL_APPOINTMENTS } from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  cases: ScreeningCase[];
  patients: PatientRecord[];
  appointments: TeleconsultAppointment[];
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
  addNewCase: (newCase: Omit<ScreeningCase, 'id' | 'caseNumber' | 'createdDate' | 'timeAgo'>) => void;
  addNewPatient: (patient: Omit<PatientRecord, 'id' | 'registeredDate'>) => void;
  verifyCase: (caseId: string, verifiedGrade: DRGrade, doctorNotes: string, referralHospital?: string) => void;
  scheduleAppointment: (appointment: Omit<TeleconsultAppointment, 'id' | 'status'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('nurse');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [cases, setCases] = useState<ScreeningCase[]>(INITIAL_CASES);
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<TeleconsultAppointment[]>(INITIAL_APPOINTMENTS);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_CASES[0]?.id || '');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0]?.id || '');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(3);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // When changing role, default to appropriate active tab
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentRole]);

  const triggerSync = () => {
    if (pendingSyncCount === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
    }, 1400);
  };

  const addNewCase = (caseData: Omit<ScreeningCase, 'id' | 'caseNumber' | 'createdDate' | 'timeAgo'>) => {
    const newId = `CAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCaseItem: ScreeningCase = {
      ...caseData,
      id: newId,
      caseNumber: `#${newId}`,
      createdDate: 'Just now',
      timeAgo: 'Just now',
    };
    setCases(prev => [newCaseItem, ...prev]);
    setSelectedCaseId(newId);
    if (!isOnline) {
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const addNewPatient = (patientData: Omit<PatientRecord, 'id' | 'registeredDate'>) => {
    const newId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatientItem: PatientRecord = {
      ...patientData,
      id: newId,
      registeredDate: 'Today',
    };
    setPatients(prev => [newPatientItem, ...prev]);
    setSelectedPatientId(newId);
    if (!isOnline) {
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const verifyCase = (caseId: string, verifiedGrade: DRGrade, doctorNotes: string, referralHospital?: string) => {
    setCases(prev => prev.map(item => {
      if (item.id === caseId) {
        return {
          ...item,
          status: 'VERIFIED',
          verifiedBy: 'Dr. Arvind Rao, MS',
          verifiedDate: 'Today, Just now',
          verifiedGrade,
          doctorNotes,
          referralHospital: referralHospital || 'Sankara Eye Hospital, Thane Base',
        };
      }
      return item;
    }));
  };

  const scheduleAppointment = (appointmentData: Omit<TeleconsultAppointment, 'id' | 'status'>) => {
    const newId = `APP-${Math.floor(100 + Math.random() * 900)}`;
    const newAppointment: TeleconsultAppointment = {
      ...appointmentData,
      id: newId,
      status: 'SCHEDULED',
    };
    setAppointments(prev => [newAppointment, ...prev]);
  };

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
