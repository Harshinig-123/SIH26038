import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NurseDashboard } from './components/nurse/NurseDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { CaseReviewWorkspace } from './components/doctor/CaseReviewWorkspace';
import { TeleOphthalAppointments } from './components/teleconsult/TeleOphthalAppointments';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { PopulationAnalytics } from './components/analytics/PopulationAnalytics';
import { PatientsRegistry } from './components/nurse/PatientsRegistry';
import { SyncStatusView } from './components/common/SyncStatusView';
import { NewScreeningModal } from './components/nurse/NewScreeningModal';
import { PatientRegistrationModal } from './components/nurse/PatientRegistrationModal';

export const App: React.FC = () => {
  const { currentRole, activeTab } = useApp();

  const [isNewScreeningOpen, setIsNewScreeningOpen] = useState(false);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);

  // Render main content area depending on current role and active tab
  const renderMainContent = () => {
    if (currentRole === 'nurse') {
      if (activeTab === 'patients') {
        return (
          <PatientsRegistry
            onOpenNewPatient={() => setIsNewPatientOpen(true)}
            onOpenNewScreening={() => setIsNewScreeningOpen(true)}
          />
        );
      }
      if (activeTab === 'appointments') {
        return <TeleOphthalAppointments />;
      }
      if (activeTab === 'sync') {
        return <SyncStatusView />;
      }
      return (
        <NurseDashboard
          onOpenNewScreening={() => setIsNewScreeningOpen(true)}
          onOpenNewPatient={() => setIsNewPatientOpen(true)}
        />
      );
    }

    if (currentRole === 'doctor') {
      if (activeTab === 'case-review') {
        return <CaseReviewWorkspace />;
      }
      if (activeTab === 'appointments') {
        return <TeleOphthalAppointments />;
      }
      if (activeTab === 'patients') {
        return (
          <PatientsRegistry
            onOpenNewPatient={() => setIsNewPatientOpen(true)}
            onOpenNewScreening={() => setIsNewScreeningOpen(true)}
          />
        );
      }
      if (activeTab === 'analytics') {
        return <PopulationAnalytics />;
      }
      return <DoctorDashboard />;
    }

    if (currentRole === 'patient') {
      if (activeTab === 'appointments') {
        return <TeleOphthalAppointments />;
      }
      return <PatientDashboard />;
    }

    if (currentRole === 'analytics') {
      return <PopulationAnalytics />;
    }

    return (
      <NurseDashboard
        onOpenNewScreening={() => setIsNewScreeningOpen(true)}
        onOpenNewPatient={() => setIsNewPatientOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      {/* Top Navbar */}
      <Header />

      {/* Main Layout: Fixed Sidebar + Main Scrollable Canvas */}
      <div className="flex pt-16 flex-1">
        <Sidebar
          onOpenNewScreening={() => setIsNewScreeningOpen(true)}
          onOpenNewPatient={() => setIsNewPatientOpen(true)}
        />

        <main className="ml-64 flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Modals */}
      <NewScreeningModal
        isOpen={isNewScreeningOpen}
        onClose={() => setIsNewScreeningOpen(false)}
      />

      <PatientRegistrationModal
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
      />
    </div>
  );
};
