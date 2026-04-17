import { useState } from 'react';

interface Option {
  label: string;
  color?: string;
}

interface SurveyStepProps {
  question: string;
  subtitle?: string;
  options: Option[];
  selected: string | string[] | null;
  multiSelect?: boolean;
  maxSelect?: number;
  onSelect: (value: string) => void;
}

export default function SurveyStep({
  question,
  subtitle,
  options,
  selected,
  multiSelect = false,
  maxSelect = 2,
  onSelect,
}: SurveyStepProps) {
  const isSelected = (label: string) =>
    Array.isArray(selected) ? selected.includes(label) : selected === label;

  const atMax = Array.isArray(selected) && selected.length >= maxSelect;

  return (
    <div>
      <h2 style={{
        fontFamily: '"Instrument Serif", serif',
        fontSize: 'clamp(1.4rem, 4vw, 2rem)',
        fontWeight: 400,
        color: '#e6edf3',
        margin: '0 0 0.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      }}>
        {question}
      </h2>
      {subtitle && (
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.85rem',
          color: '#6b7280',
          margin: '0 0 1.75rem',
        }}>
          {subtitle}
        </p>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '0.65rem',
      }}>
        {options.map((opt) => (
          <OptionCard
            key={opt.label}
            label={opt.label}
            color={opt.color}
            selected={isSelected(opt.label)}
            disabled={!isSelected(opt.label) && atMax && multiSelect}
            onClick={() => onSelect(opt.label)}
          />
        ))}
      </div>
    </div>
  );
}

function OptionCard({
  label,
  color,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  color?: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = color ?? '#2dd4bf';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? `${accent}18` : hovered ? '#161b22' : '#111318',
        border: `1px solid ${selected ? accent : hovered ? '#30363d' : '#21262d'}`,
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        color: selected ? '#e6edf3' : disabled ? '#374151' : hovered ? '#c9d1d9' : '#9ca3af',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.875rem',
        fontWeight: selected ? 500 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: selected ? accent : '#374151',
        flexShrink: 0,
        transition: 'background 0.15s',
      }} />
      {label}
    </button>
  );
}
