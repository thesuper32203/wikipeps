import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GOAL_OPTIONS, CATEGORIES } from '@wikipeps/shared';
import type { ScoredPeptide } from '../../hooks/usePeptideFinder.ts';

interface ResultsScreenProps {
  results: ScoredPeptide[];
  primaryGoal: string | null;
  secondaryGoal: string | null;
  onClose: () => void;
}

export default function ResultsScreen({ results, primaryGoal, onClose }: ResultsScreenProps) {
  const top = results.slice(0, 2);
  const isStack = top.length === 2
    && top[0].peptide.category !== top[1].peptide.category
    && top[0].score >= 3
    && top[1].score >= 3;

  if (top.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ fontFamily: '"Inter", sans-serif', color: '#6b7266', marginBottom: '1.5rem' }}>
          No strong matches found. Browse all compounds to explore.
        </p>
        <button onClick={onClose} style={ctaStyle('#4a7a5a')}>Browse All Compounds</button>
      </div>
    );
  }

  const primaryColor = GOAL_OPTIONS.find((g) => g.label === primaryGoal)?.color ?? '#2dd4bf';

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          color: primaryColor,
          textTransform: 'uppercase',
          margin: '0 0 0.5rem',
        }}>
          {isStack ? 'Recommended Stack' : 'Top Match'}
        </p>
        <h2 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 400,
          color: '#111110',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {isStack
            ? `${top[0].peptide.name} + ${top[1].peptide.name}`
            : top[0].peptide.name}
        </h2>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        marginBottom: '1.75rem',
      }}>
        {top.slice(0, isStack ? 2 : 1).map((r, i) => (
          <React.Fragment key={r.peptide.id}>
            <ResultCard result={r} onClose={onClose} />
            {isStack && i === 0 && (
              <div key="plus" style={{
                display: 'flex',
                alignItems: 'center',
                color: '#9ca39a',
                fontFamily: '"Instrument Serif", serif',
                fontSize: '1.75rem',
                flexShrink: 0,
                alignSelf: 'center',
              }}>
                +
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {isStack && (
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.82rem',
          color: '#6b7266',
          margin: '0 0 1.75rem',
          lineHeight: 1.65,
          background: '#f4f4f0',
          border: '1px solid #e4e4de',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
        }}>
          <span style={{ color: '#9ca39a' }}>Why this stack: </span>
          {top[0].peptide.name} targets{' '}
          <span style={{ color: getCategoryColor(top[0].peptide.category) }}>
            {top[0].peptide.category ?? 'your primary goal'}
          </span>{' '}
          while {top[1].peptide.name} complements with{' '}
          <span style={{ color: getCategoryColor(top[1].peptide.category) }}>
            {top[1].peptide.category ?? 'a secondary benefit'}
          </span>.
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={onClose} style={ctaStyle('#4a7a5a', true)}>
          Browse All Compounds
        </button>
      </div>
    </div>
  );
}

function ResultCard({ result, onClose }: { result: ScoredPeptide; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  const catColor = getCategoryColor(result.peptide.category);
  const snippet = result.peptide.overview
    ? result.peptide.overview.length > 100
      ? result.peptide.overview.slice(0, 100).trimEnd() + '…'
      : result.peptide.overview
    : 'No overview yet.';

  return (
    <Link
      to={`/peptides/${result.peptide.slug}`}
      onClick={onClose}
      style={{ textDecoration: 'none', flex: '1 1 200px', minWidth: '180px' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#f4f4f0' : '#ffffff',
          border: `1px solid ${hovered ? 'rgba(74,122,90,0.3)' : '#e4e4de'}`,
          borderRadius: '14px',
          padding: '1.25rem',
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {result.peptide.category && (
          <span style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.65rem',
            color: catColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            {result.peptide.category}
          </span>
        )}
        <h3 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '1.35rem',
          fontWeight: 400,
          color: '#111110',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          {result.peptide.name}
        </h3>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.8rem',
          color: '#6b7266',
          margin: '0 0 1rem',
          lineHeight: 1.6,
        }}>
          {snippet}
        </p>
        <span style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.775rem',
          color: hovered ? '#4a7a5a' : '#9ca39a',
          transition: 'color 0.2s',
        }}>
          View compound →
        </span>
      </div>
    </Link>
  );
}

function getCategoryColor(category: string | null | undefined): string {
  if (!category) return '#2dd4bf';
  return CATEGORIES.find((c) => c.label === category)?.color ?? '#2dd4bf';
}

function ctaStyle(color: string, ghost = false): React.CSSProperties {
  return {
    background: ghost ? 'transparent' : color,
    border: `1px solid ${color}`,
    borderRadius: '8px',
    padding: '0.65rem 1.25rem',
    color: ghost ? color : '#ffffff',
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  };
}
