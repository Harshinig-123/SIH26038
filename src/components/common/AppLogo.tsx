import React from 'react';

export const AppLogo: React.FC<{ size?: number; className?: string }> = ({ size = 34, className = '' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="retina-bg-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="retina-iris-grad" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      {/* Background rounded squircle */}
      <rect width="40" height="40" rx="10" fill="url(#retina-bg-grad)" />
      {/* Eye outer contour */}
      <path
        d="M7 20C11 13.5 15.5 10.5 20 10.5C24.5 10.5 29 13.5 33 20C29 26.5 24.5 29.5 20 29.5C15.5 29.5 11 26.5 7 20Z"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Iris / Retina target */}
      <circle cx="20" cy="20" r="5.5" fill="url(#retina-iris-grad)" />
      {/* Pupil */}
      <circle cx="20" cy="20" r="2.6" fill="#0f172a" />
      {/* Target reticle scan lines */}
      <line x1="20" y1="11.5" x2="20" y2="14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="25.5" x2="20" y2="28.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="20" x2="14.5" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25.5" y1="20" x2="28.5" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Small optical reflection */}
      <circle cx="18.5" cy="18.5" r="0.9" fill="white" />
    </svg>
  </div>
);
