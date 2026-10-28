import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = 'center',
  light = false,
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`mb-12 ${isCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 mb-3 ${isCentered ? 'justify-center' : ''}`}>
          <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
          <span className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">
            {badge}
          </span>
          <span className="w-6 h-0.5 bg-[#FFB800] rounded-full" />
        </div>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight leading-tight ${
          light ? 'text-white' : 'text-[#123B70]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-200' : 'text-[#65758B]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
