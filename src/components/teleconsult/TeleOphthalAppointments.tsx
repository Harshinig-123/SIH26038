import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeleconsultAppointment } from '../../types';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const TeleOphthalAppointments: React.FC = () => {
  const { appointments, scheduleAppointment, completeAppointment, patients, doctors, currentRole } = useApp();

  const [activeCall, setActiveCall] = useState<TeleconsultAppointment | null>(null);
  const [rxNotes, setRxNotes] = useState<string>('Tab Metformin 500mg BD • Eye Drop Nepafenac 0.1% TDS (OD) • Strict Glycemic & BP Control');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showCompletedNotice, setShowCompletedNotice] = useState<string>('');

  const handleEndConsultation = () => {
    if (activeCall) {
      completeAppointment(activeCall.id, rxNotes);
      const patName = activeCall.patientName;
      setActiveCall(null);
      setShowCompletedNotice(`Consultation for ${patName} ended successfully. Status marked as Completed.`);
      setTimeout(() => setShowCompletedNotice(''), 4000);
    }
  };

  // New appointment form state
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');
  const [reason, setReason] = useState('Follow-up evaluation on severe macular exudation');

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId);
    const doc = doctors.find(d => d.doctor_id === selectedDoctorId);
    scheduleAppointment({
      patientId: selectedPatientId || patients[0]?.id || '',
      patientName: pat?.name || patients[0]?.name || 'Unknown',
      doctorName: doc ? `${doc.name}, ${doc.specialization}` : doctors[0] ? `${doctors[0].name}, ${doctors[0].specialization}` : 'TBD',
      phcCenter: pat?.phcCenter || 'PHC Badlapur Central',
      scheduledTime: scheduledDate && scheduledTimeSlot ? `${scheduledDate}, ${scheduledTimeSlot}` : 'TBD',
      urgency,
      reason,
      drGrade: pat?.lastDRGrade || 'NO_DR',
    });
    setShowNewModal(false);
    setSelectedPatientId('');
    setSelectedDoctorId('');
    setScheduledDate('');
    setScheduledTimeSlot('');
    setReason('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-secondary-fixed/50 px-2 py-0.5 rounded">
              Tele-Medicine Gateway
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Tele-Ophthalmology Appointments</h1>
          <p className="text-sm text-on-surface-variant">
            Virtual clinic connecting district retina specialists with rural PHC screening camps
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-sm transition-all shadow-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Schedule Tele-Consult</span>
        </button>
      </div>

      {showCompletedNotice && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <span className="material-symbols-outlined text-emerald-700 text-[22px]">check_circle</span>
          <span>{showCompletedNotice}</span>
        </div>
      )}

      {/* ACTIVE VIDEO CALL LOBBY SIMULATOR (DOCTOR ONLY) */}
      {activeCall && currentRole === 'doctor' && (
        <div className="bg-surface-container-lowest rounded-2xl border-2 border-primary/30 p-6 shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-base font-bold text-on-surface">
                Live Video Session with {activeCall.patientName}
              </h2>
              <span className="text-xs text-on-surface-variant">({activeCall.phcCenter})</span>
            </div>

            <button
              onClick={handleEndConsultation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call_end</span>
              <span>End Consultation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Left: Video Feed Stream (Simulated) */}
            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                alt="Patient Video"
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
              />
              {isVideoOff && (
                <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[36px]">videocam_off</span>
                  <span>Video Feed Muted</span>
                </div>
              )}

              {/* Inset Doctor PiP */}
              <div className="absolute bottom-3 right-3 w-32 aspect-video rounded-lg overflow-hidden border-2 border-white/40 shadow-md bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
                  alt="Doctor PiP"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Video Controls HUD */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-full backdrop-blur-md text-white text-xs ${isMuted ? 'bg-red-600' : 'bg-black/60 hover:bg-black/80'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-2 rounded-full backdrop-blur-md text-white text-xs ${isVideoOff ? 'bg-red-600' : 'bg-black/60 hover:bg-black/80'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isVideoOff ? 'videocam_off' : 'videocam'}
                  </span>
                </button>
              </div>

              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                Field Co-Pilot: Sister Lakshmi Sharma, RN
              </div>
            </div>

            {/* Right: E-Prescription & Doctor Note Pad */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface text-sm">Tele-Ophthal e-Prescription</span>
                <DRGradeBadge grade={activeCall.drGrade} size="sm" />
              </div>

              <div>
                <label className="block text-on-surface-variant font-medium mb-1">
                  Physician Orders & Treatment Advice:
                </label>
                <textarea
                  rows={4}
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                <span className="text-[11px] text-on-surface-variant">ABHA Consent Linked • Signed Digitally</span>
                <button
                  onClick={handleEndConsultation}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs shadow-xs"
                >
                  Transmit Rx & Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT ROSTER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-bold text-base text-on-surface">{app.patientName}</div>
                  <div className="text-xs text-on-surface-variant">{app.phcCenter}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {app.status === 'COMPLETED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">done_all</span>
                      Completed
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.urgency === 'Emergency' || app.urgency === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {app.urgency}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                <span className="text-xs font-semibold text-primary">{app.scheduledTime}</span>
              </div>

              <div className="mb-3">
                <DRGradeBadge grade={app.drGrade} size="sm" />
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                {app.reason}
              </p>

              {/* Doctor's clinical notes & orders */}
              <div className="mt-2.5 mb-3 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px]">clinical_notes</span>
                  <span>Doctor Clinical Orders / Rx</span>
                </div>
                <p className="text-[11px] text-on-surface leading-relaxed">
                  {app.doctorNotes || (app.patientName.includes('Kasturba')
                    ? 'Tab Metformin 500mg BD • Eye Drop Nepafenac 0.1% TDS (OD) • Referral to Base Hospital within 7 days.'
                    : 'Routine glycemic control advised. Follow up tele-screening in 6 months.')}
                </p>
              </div>
            </div>

            {app.status === 'COMPLETED' ? (
              <div className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>Consultation Over • Prescription Signed</span>
              </div>
            ) : currentRole === 'doctor' ? (
              <button
                onClick={() => {
                  setActiveCall(app);
                  setRxNotes(app.doctorNotes || 'Tab Metformin 500mg BD • Eye Drop Nepafenac 0.1% TDS (OD) • Strict Glycemic & BP Control');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-semibold text-xs transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">video_call</span>
                <span>Launch Video Consult</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-surface-container text-xs border border-outline-variant/30">
                <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">videocam</span>
                  <span>Specialist Video Call</span>
                </span>
                <span className="text-[10px] font-semibold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded">
                  Attended by Doctor
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SCHEDULE MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-surface-container-high shadow-xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
              <h3 className="text-base font-bold text-on-surface">Book Tele-Ophthalmology Session</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="flex flex-col gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Select Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.age}y, {p.village})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Select Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.doctor_id} value={d.doctor_id}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTimeSlot}
                    onChange={(e) => setScheduledTimeSlot(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Clinical Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface font-medium"
                >
                  <option value="Routine">Routine (Elective Review)</option>
                  <option value="Urgent">Urgent (Macular Threat / Grade 3)</option>
                  <option value="Emergency">Emergency (Grade 4 / Neovascular)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Clinical Referral Reason</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-2 text-xs text-on-surface"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-on-primary shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
