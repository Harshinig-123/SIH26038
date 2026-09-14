import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const PatientRegistrationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addNewPatient, villages } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [abhaId, setAbhaId] = useState('91-');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.village_id || '');
  const [hba1c, setHba1c] = useState<number>(8.0);
  const [bp, setBp] = useState('130/80');
  const [diabetesYears, setDiabetesYears] = useState<number>(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedVillage = villages.find(v => v.village_id === selectedVillageId);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (age < 1 || age > 120) newErrors.age = 'Age must be 1-120';
    if (phone && !/^\d{10}$/.test(phone.replace(/[\s+\-]/g, '').replace(/^91/, ''))) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }
    if (aadhaarLast4 && !/^\d{4}$/.test(aadhaarLast4)) {
      newErrors.aadhaarLast4 = 'Must be exactly 4 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setName('');
    setAge(55);
    setGender('Female');
    setPhone('');
    setAbhaId('91-');
    setAadhaarLast4('');
    setSelectedVillageId(villages[0]?.village_id || '');
    setHba1c(8.0);
    setBp('130/80');
    setDiabetesYears(5);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addNewPatient({
      name,
      age: Number(age),
      gender,
      phone: phone ? `+91 ${phone}` : '',
      abhaId: abhaId.length > 5 ? abhaId : `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      aadhaarLast4: aadhaarLast4 || '0000',
      village: selectedVillage?.village_name || 'Unknown',
      phcCenter: selectedVillage?.phc_name || 'PHC Badlapur Central',
      hba1c: Number(hba1c),
      bp,
      diabetesYears: Number(diabetesYears),
      lastScreeningDate: 'Pending initial scan',
      lastDRGrade: 'NO_DR',
    });

    resetForm();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
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

        {showSuccess ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-700 text-[32px]">check_circle</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Patient Registered!</h3>
            <p className="text-xs text-on-surface-variant">Record saved and ABHA linked successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs flex flex-col gap-4">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shakuntala Ramdas More"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-surface-container border rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary ${errors.name ? 'border-red-400' : 'border-outline-variant/50'}`}
              />
              {errors.name && <span className="text-[10px] text-red-600 mt-0.5">{errors.name}</span>}
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
                  className={`w-full bg-surface-container border rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary ${errors.age ? 'border-red-400' : 'border-outline-variant/50'}`}
                />
                {errors.age && <span className="text-[10px] text-red-600 mt-0.5">{errors.age}</span>}
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
                  placeholder="9820000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full bg-surface-container border rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary ${errors.phone ? 'border-red-400' : 'border-outline-variant/50'}`}
                />
                {errors.phone && <span className="text-[10px] text-red-600 mt-0.5">{errors.phone}</span>}
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Aadhaar (Last 4 digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="4819"
                  value={aadhaarLast4}
                  onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={`w-full bg-surface-container border rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono ${errors.aadhaarLast4 ? 'border-red-400' : 'border-outline-variant/50'}`}
                />
                {errors.aadhaarLast4 && <span className="text-[10px] text-red-600 mt-0.5">{errors.aadhaarLast4}</span>}
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
                <select
                  value={selectedVillageId}
                  onChange={(e) => setSelectedVillageId(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                >
                  {villages.map((v) => (
                    <option key={v.village_id} value={v.village_id}>
                      {v.village_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">PHC Center</label>
                <input
                  type="text"
                  readOnly
                  value={selectedVillage?.phc_name || 'PHC Badlapur Central'}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-xs text-on-surface-variant cursor-not-allowed"
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
        )}
      </div>
    </div>
  );
};
