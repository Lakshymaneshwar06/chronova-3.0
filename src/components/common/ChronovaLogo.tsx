import React from 'react';

interface ChronovaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'mark';
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
}

export const ChronovaLogo: React.FC<ChronovaLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  onClick,
  showSubtitle = true
}) => {
  // Dimension tokens tailored for viewport presence and razor-sharp rendering
  const dimensions = {
    xs: { icon: 26, text: 'text-sm', sub: 'text-[8px]', star: 12 },
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]', star: 14 },
    md: { icon: 42, text: 'text-xl', sub: 'text-[10px]', star: 18 },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs', star: 22 },
    xl: { icon: 68, text: 'text-3xl', sub: 'text-sm', star: 28 }
  }[size];

  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Eye-Catching Vector Emblem:
          Dual Luminous Gyro-Rings + Cosmic Chrono Arc + Hyper-Radiant Nova Star
      */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl p-1 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-400/40 shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/45 group-hover:scale-105 group-hover:border-indigo-400/70 transition-all duration-300 overflow-hidden"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        {/* Ambient Inner Starlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-sky-400/20 to-amber-300/20 pointer-events-none" />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Luminous Chrono Arc Gradient (Electric Indigo to Neon Cyan) */}
            <linearGradient id="chronoArcVibrantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="40%" stopColor="#6366f1" />
              <stop offset="75%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            {/* Radiant Nova Star Gradient (Blazing Amber-Rose to Golden Starlight) */}
            <linearGradient id="novaStarVibrantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="35%" stopColor="#f43f5e" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>

            {/* Dual Orbital Gyro Glow */}
            <linearGradient id="orbitalRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
            </linearGradient>

            {/* Secondary Tilted Ellipse Glow */}
            <linearGradient id="orbitalCrossGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.75" />
            </linearGradient>

            {/* Center Supernova Core Filter Glow */}
            <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Gyro Orbital Orbit Ring with Dashed Cadence */}
          <circle
            cx="50"
            cy="50"
            r="43"
            stroke="url(#orbitalRingGrad)"
            strokeWidth="2.5"
            strokeDasharray="5 7"
            className="animate-spin-slow origin-center opacity-80"
          />

          {/* 2. Secondary Tilted Elliptical Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="24"
            transform="rotate(-28 50 50)"
            stroke="url(#orbitalCrossGrad)"
            strokeWidth="1.8"
            strokeDasharray="3 5"
            className="opacity-60"
          />

          {/* 3. The Bold Iconic 'C' Chrono Arc (Time Horizon & Gateway) */}
          <path
            d="M 72 20
               C 64 12, 53 8, 41 8
               C 18 8, 8 26, 8 50
               C 8 74, 18 92, 41 92
               C 54 92, 65 87, 73 78
               L 63 68
               C 57 74, 50 78, 41 78
               C 27 78, 22 66, 22 50
               C 22 34, 27 22, 41 22
               C 49 22, 56 26, 62 31
               Z"
            fill="url(#chronoArcVibrantGrad)"
          />

          {/* 4. The Blazing 8-Point Diamond Nova Star (Intelligence & Energy Spark) */}
          {/* Main 4-point Diamond Beam */}
          <path
            d="M 58 50
               Q 73 50, 84 50
               Q 73 50, 58 50
               Q 58 35, 58 20
               Q 58 35, 58 50
               Q 58 65, 58 80
               Q 58 65, 58 50
               Q 43 50, 32 50
               Q 43 50, 58 50
               Z"
            fill="url(#novaStarVibrantGrad)"
            filter="url(#starGlow)"
          />

          {/* Diagonal Secondary Starlight Glints */}
          <path
            d="M 58 50
               L 74 34
               L 58 50
               L 74 66
               L 58 50
               L 42 66
               L 58 50
               L 42 34
               Z"
            stroke="url(#novaStarVibrantGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 5. Radiant Starlight Specular Points */}
          <circle cx="58" cy="50" r="4.2" fill="#ffffff" />
          <circle cx="58" cy="50" r="2" fill="#fde047" />

          {/* Small Celestial Accents */}
          <circle cx="84" cy="50" r="2" fill="#22d3ee" className="animate-ping opacity-75" />
          <circle cx="80" cy="22" r="2.5" fill="#fde047" />
          <circle cx="30" cy="78" r="2" fill="#a855f7" />
        </svg>
      </div>

      {/* Typography: Distinctive Wordmark + Dynamic Gradient Highlight */}
      {variant !== 'mark' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-heading text-slate-900 group-hover:text-indigo-950 transition-colors ${dimensions.text}`}
            >
              CHRON<span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">OVA</span>
            </span>

            {/* Glowing Celestial Accent Starlight Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-indigo-600 to-sky-400" />
            </span>
          </div>

          {variant === 'full' && showSubtitle && (
            <span
              className={`hidden sm:inline font-bold tracking-widest uppercase bg-gradient-to-r from-slate-400 via-indigo-400 to-slate-400 bg-clip-text text-transparent font-sans ${dimensions.sub}`}
            >
              Campus Portal & Vault
            </span>
          )}
        </div>
      )}
    </div>
  );
};
