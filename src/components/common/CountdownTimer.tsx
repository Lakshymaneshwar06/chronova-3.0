import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  accentColor?: 'cyan' | 'indigo' | 'amber';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  compact = false,
  accentColor = 'cyan'
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live Now / Ongoing
      </span>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-mono text-slate-800 shadow-xs">
        <Clock className="w-3.5 h-3.5 text-cyan-600" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  const borderClass =
    accentColor === 'indigo'
      ? 'border-pastel-lavender bg-pastel-lavender/40'
      : accentColor === 'amber'
      ? 'border-pastel-peach bg-pastel-peach/40'
      : 'border-pastel-sky bg-pastel-sky/40';

  const textClass =
    accentColor === 'indigo'
      ? 'text-indigo-700'
      : accentColor === 'amber'
      ? 'text-amber-700'
      : 'text-cyan-700';

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 max-w-full">
      {[
        { label: 'DAYS', val: timeLeft.days },
        { label: 'HRS', val: timeLeft.hours },
        { label: 'MIN', val: timeLeft.minutes },
        { label: 'SEC', val: timeLeft.seconds }
      ].map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center min-w-[44px] sm:min-w-[62px] px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border ${borderClass} backdrop-blur-md shadow-inner`}
        >
          <span className={`font-mono text-base sm:text-xl font-bold tracking-tight ${textClass}`}>
            {String(item.val).padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-[10px] font-medium tracking-wider text-slate-400 mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
