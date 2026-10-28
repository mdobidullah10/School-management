import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  const imgSizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800] rounded-lg p-1 transition-transform"
      aria-label="Future Leaders School Home"
    >
      <div className={`relative flex items-center justify-center shrink-0 ${imgSizes[size]} rounded-lg overflow-hidden bg-white shadow-xs border border-slate-100`}>
        <img
          src="/images/logo.jpg"
          alt="Future Leaders School Crest"
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // High-fidelity fallback SVG if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <svg viewBox="0 0 48 48" class="w-full h-full text-[#123B70]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4L4 14L24 24L44 14L24 4Z" fill="#123B70"/>
                  <path d="M24 2L26 6L30 6L27 9L28 13L24 10L20 13L21 9L18 6L22 6L24 2Z" fill="#FFB800"/>
                  <path d="M10 21V33C10 39 16 43 24 43C32 43 38 39 38 33V21L24 28L10 21Z" fill="#2167B2"/>
                </svg>
              `;
            }
          }}
        />
      </div>

      <div className="flex flex-col text-left">
        <span
          className={`font-serif font-bold tracking-tight leading-tight ${titleSizes[size]} ${
            isDark ? 'text-white' : 'text-[#123B70]'
          } group-hover:text-[#2167B2] transition-colors`}
        >
          Future Leaders School
        </span>
        {showTagline && (
          <span
            className={`font-medium tracking-wider flex items-center gap-1.5 uppercase ${taglineSizes[size]} ${
              isDark ? 'text-slate-300' : 'text-[#65758B]'
            }`}
          >
            <span>Learn</span>
            <span className="text-[#FFB800] text-[10px]">•</span>
            <span>Grow</span>
            <span className="text-[#FFB800] text-[10px]">•</span>
            <span>Lead</span>
          </span>
        )}
      </div>
    </Link>
  );
};
