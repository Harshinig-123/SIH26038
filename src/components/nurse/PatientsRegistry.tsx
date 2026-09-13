import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DRGradeBadge } from '../common/DRGradeBadge';

export const PatientsRegistry: React.FC<{ onOpenNewPatient: () => void; onOpenNewScreening: () => void }> = ({
  onOpenNewPatient,
  onOpenNewScreening,
}) => {
  const { patients, setSelectedPatientId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.abhaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Registered Patients EMR Database</h1>
          <p className="text-sm text-on-surface-variant">
            Citizens enrolled across PHC Badlapur and outreach camp clusters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewPatient}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-sm transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Enroll Patient</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="p-4 border-b border-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, ABHA ID, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <span className="text-xs text-on-surface-variant font-medium">
            Total {filtered.length} patients registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Patient Name & Demographics</th>
                <th className="px-5 py-3">ABHA & Aadhaar</th>
                <th className="px-5 py-3">Village / Cluster</th>
                <th className="px-5 py-3">Vitals (HbA1c / BP)</th>
                <th className="px-5 py-3">Last Retinal Grade</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-on-surface text-sm">{p.name}</div>
                    <div className="text-[11px] text-on-surface-variant">
                      {p.age} years • {p.gender} • {p.phone}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 font-mono text-[11px] text-on-surface">
                    <div className="font-semibold text-primary">{p.abhaId}</div>
                    <div className="text-on-surface-variant">Aadhaar: ****-****-{p.aadhaarLast4}</div>
                  </td>

                  <td className="px-5 py-3.5 text-on-surface">
                    <div className="font-medium">{p.village}</div>
                    <div className="text-[11px] text-on-surface-variant">{p.phcCenter}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-on-surface-variant">HbA1c:</span>
                      <span className={`font-semibold ${p.hba1c > 8.0 ? 'text-red-700' : 'text-on-surface'}`}>
                        {p.hba1c}%
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      BP: {p.bp} • T2D: {p.diabetesYears}y
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <DRGradeBadge grade={p.lastDRGrade} size="sm" />
                    <div className="text-[10px] text-on-surface-variant mt-1">
                      {p.lastScreeningDate}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        onOpenNewScreening();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-semibold text-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>Scan Now</span>
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
