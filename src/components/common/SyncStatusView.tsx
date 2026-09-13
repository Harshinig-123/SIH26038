import React from 'react';
import { useApp } from '../../context/AppContext';

export const SyncStatusView: React.FC = () => {
  const { isOnline, setIsOnline, pendingSyncCount, triggerSync, isSyncing, cases } = useApp();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
              Edge Storage Architecture
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Offline Queue & Cloud Sync Manager</h1>
          <p className="text-sm text-on-surface-variant">
            Zero-data-loss architecture designed for rural vision camps with intermittent cellular connectivity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {isOnline ? 'Online (Connected)' : 'Offline (Disconnected)'}
          </button>

          <button
            onClick={triggerSync}
            disabled={isSyncing || pendingSyncCount === 0 || !isOnline}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-xs transition-all shadow-xs disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Pending Records'}</span>
          </button>
        </div>
      </div>

      {/* Sync Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Local SQLite / Flash Buffer</div>
          <div className="text-3xl font-bold text-on-surface mt-1">128 MB</div>
          <div className="text-xs text-primary font-semibold mt-2">Encrypted with AES-256</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Unsynced Screening Records</div>
          <div className="text-3xl font-bold text-amber-800 mt-1">{pendingSyncCount}</div>
          <div className="text-xs text-on-surface-variant mt-2">Ready to push to state cloud</div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-xs">
          <div className="text-xs text-on-surface-variant font-medium">Last Successful Tele-Sync</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">Today, 10:45 AM</div>
          <div className="text-xs text-emerald-700 font-semibold mt-2">All checksums verified</div>
        </div>
      </div>

      {/* Queue Preview */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Local Records in Device Memory</h2>
          <button
            onClick={() => alert('Exporting local encrypted backup file (.enc)...')}
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export USB Camp Backup</span>
          </button>
        </div>

        <div className="divide-y divide-surface-container-low text-xs">
          {cases.slice(0, 3).map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.eyes.od.imageUrl}
                  alt="scan"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-outline-variant/30"
                />
                <div>
                  <div className="font-bold text-on-surface">{c.patientName}</div>
                  <div className="text-[11px] text-on-surface-variant">{c.caseNumber} • {c.village}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                  Buffered Locally
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
