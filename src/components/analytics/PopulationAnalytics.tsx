import React, { useState } from 'react';
import { CLUSTER_ANALYTICS } from '../../data/mockData';

export const PopulationAnalytics: React.FC = () => {
  const data = CLUSTER_ANALYTICS;
  const [exportMsg, setExportMsg] = useState('');

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded">
              Epidemiological Surveillance
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Population Analytics & DR Prevalence</h1>
          <p className="text-sm text-on-surface-variant">
            Thane District Vision Health Outreach Mission • NPCB Telemetry
          </p>
        </div>

        <button
          onClick={() => { setExportMsg('Report exported successfully!'); setTimeout(() => setExportMsg(''), 3000); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-sm transition-all shadow-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export DHO Report</span>
        </button>
        {exportMsg && (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {exportMsg}
          </span>
        )}
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Total Citizens Screened</div>
          <div className="text-3xl font-bold text-on-surface mt-1">12,480</div>
          <div className="text-xs text-primary font-semibold mt-2">83.2% of District Target</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Sight-Threatening DR (STDR)</div>
          <div className="text-3xl font-bold text-red-700 mt-1">770</div>
          <div className="text-xs text-red-700 font-semibold mt-2">6.2% of Screened Population</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Referral Compliance Rate</div>
          <div className="text-3xl font-bold text-emerald-700 mt-1">88.6%</div>
          <div className="text-xs text-emerald-700 font-semibold mt-2">Treated at Base Hospitals</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Mean AI Turnaround Time</div>
          <div className="text-3xl font-bold text-secondary mt-1">24.2s</div>
          <div className="text-xs text-secondary font-semibold mt-2">Edge Model (Sub-minute)</div>
        </div>
      </div>

      {/* Disease Distribution Severity Chart */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs flex flex-col gap-4">
        <h2 className="text-base font-bold text-on-surface">Diabetic Retinopathy Severity Breakdown</h2>

        <div className="flex flex-col gap-3">
          {[
            { label: 'No DR (Grade 0)', count: data.totalNoDR, pct: 66.0, color: 'bg-emerald-500' },
            { label: 'Mild NPDR (Grade 1)', count: data.totalMild, pct: 17.5, color: 'bg-amber-400' },
            { label: 'Moderate NPDR (Grade 2)', count: data.totalModerate, pct: 10.3, color: 'bg-orange-500' },
            { label: 'Severe NPDR (Grade 3)', count: data.totalSevere, pct: 4.5, color: 'bg-red-500' },
            { label: 'Proliferative DR (PDR / Grade 4)', count: data.totalPDR, pct: 1.7, color: 'bg-rose-700' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between items-center text-on-surface">
                <span className="font-semibold">{item.label}</span>
                <span className="font-mono text-on-surface-variant">
                  {item.count.toLocaleString()} cases ({item.pct}%)
                </span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cluster Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="p-5 border-b border-surface-container-low">
          <h2 className="text-base font-bold text-on-surface">PHC Cluster Performance & Screening Density</h2>
          <p className="text-xs text-on-surface-variant">Outreach camp telemetry across Thane district sub-centers</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Cluster Center</th>
                <th className="px-5 py-3">Screenings Done</th>
                <th className="px-5 py-3">DR Prevalence</th>
                <th className="px-5 py-3">Urgent Referrals</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {data.clusters.map((cl) => (
                <tr key={cl.name} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-on-surface">{cl.name}</td>
                  <td className="px-5 py-3 font-mono">{cl.screened.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold text-amber-800">{cl.drPrevalence}</td>
                  <td className="px-5 py-3 font-bold text-red-700">{cl.urgentReferred}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Operational
                    </span>
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
