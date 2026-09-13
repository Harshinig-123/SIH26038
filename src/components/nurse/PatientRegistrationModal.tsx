import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const PatientRegistrationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addNewPatient } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('+91 98');
  const [abhaId, setAbhaId] = useState('91-');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [village, setVillage] = useState('Sonawale Village');
  const [phcCenter, setPhcCenter] = useState('PHC Badlapur Central');
  const [hba1c, setHba1c] = useState<number>(8.0);
  const [bp, setBp] = useState('130/80');
  const [diabetesYears, setDiabetesYears] = useState<number>(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewPatient({
      name,
      age: Number(age),
      gender,
      phone,
      abhaId: abhaId.length > 5 ? abhaId : `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      aadhaarLast4: aadhaarLast4 || '4820',
      village,
      phcCenter,
      hba1c: Number(hba1c),
      bp,
      diabetesYears: Number(diabetesYears),
      lastScreeningDate: 'Pending initial scan',
      lastDRGrade: 'NO_DR',
    });

    onClose();
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-surface-container-high shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">person_add</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">Patient Registration (ABHA Linked)</h2>
              <p className="text-xs text-on-surface-variant">Ayushman Bharat Digital Health Ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs flex flex-col gap-4">
          <div>
            <label className="block font-semibold text-on-surface mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shakuntala Ramdas More"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Age (Years) *</label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="+91 98200 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Aadhaar (Last 4 digits)</label>
              <input
                type="text"
                maxLength={4}
                placeholder="4819"
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface mb-1">ABHA Health ID (14-Digit)</label>
            <input
              type="text"
              placeholder="91-XXXX-XXXX-XXXX"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Village / Town</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">PHC Center</label>
              <input
                type="text"
                value={phcCenter}
                onChange={(e) => setPhcCenter(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-on-surface mb-1">HbA1c (%)</label>
              <input
                type="number"
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">BP (mmHg)</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">T2D (Years)</label>
              <input
                type="number"
                value={diabetesYears}
                onChange={(e) => setDiabetesYears(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container-high flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-on-primary shadow-xs"
            >
              Save & Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
