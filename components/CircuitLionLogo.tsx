'use client';

export function CircuitLionLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circuit pattern */}
      <circle cx="32" cy="32" r="30" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.3" />
      <line x1="32" y1="2" x2="32" y2="10" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="32" y1="54" x2="32" y2="62" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="2" y1="32" x2="10" y2="32" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="54" y1="32" x2="62" y2="32" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Lion head */}
      <circle cx="32" cy="32" r="20" fill="#3b82f6" opacity="0.9" />

      {/* Mane (lion's characteristic) */}
      <circle cx="22" cy="22" r="6" fill="#1f2937" opacity="0.8" />
      <circle cx="42" cy="22" r="6" fill="#1f2937" opacity="0.8" />
      <circle cx="18" cy="32" r="6" fill="#1f2937" opacity="0.8" />
      <circle cx="46" cy="32" r="6" fill="#1f2937" opacity="0.8" />

      {/* Eyes */}
      <circle cx="27" cy="30" r="2" fill="white" />
      <circle cx="37" cy="30" r="2" fill="white" />

      {/* Nose */}
      <circle cx="32" cy="36" r="1.5" fill="white" />

      {/* Mouth */}
      <path d="M 32 36 L 30 38 M 32 36 L 34 38" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

      {/* Circuit nodes */}
      <circle cx="12" cy="12" r="1.5" fill="#3b82f6" />
      <circle cx="52" cy="12" r="1.5" fill="#3b82f6" />
      <circle cx="12" cy="52" r="1.5" fill="#3b82f6" />
      <circle cx="52" cy="52" r="1.5" fill="#3b82f6" />

      {/* Circuit lines */}
      <path d="M 14 14 L 18 18" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
      <path d="M 50 14 L 46 18" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
      <path d="M 14 50 L 18 46" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
      <path d="M 50 50 L 46 46" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
