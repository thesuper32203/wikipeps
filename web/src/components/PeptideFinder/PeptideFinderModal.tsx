import { useEffect, useMemo } from 'react';
import { GOAL_OPTIONS } from '@wikipeps/shared';
import type { PeptideListItem } from '@wikipeps/shared';
import { usePeptideFinder } from '../../hooks/usePeptideFinder.ts';
import SurveyStep from './SurveyStep.tsx';
import ResultsScreen from './ResultsScreen.tsx';

const CONCERN_OPTIONS = [
  'Joint pain', 'Sleep', 'Inflammation', 'Focus',
  'Weight plateau', 'Skin/hair', 'Libido', 'Gut health',
];

const EXPERIENCE_OPTIONS = [
  { label: 'Complete beginner', color: '#60a5fa' },
  { label: 'Some experience',   color: '#2dd4bf' },
  { label: 'Well-researched',   color: '#a78bfa' },
];

const EXPERIENCE_MAP: Record<string, 'beginner' | 'experienced' | 'advanced'> = {
  'Complete beginner': 'beginner',
  'Some experience':   'experienced',
  'Well-researched':   'advanced',
};

interface PeptideFinderModalProps {
  peptides: PeptideListItem[];
  onClose: () => void;
}

export default function PeptideFinderModal({ peptides, onClose }: PeptideFinderModalProps) {
  const finder = usePeptideFinder();

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const results = useMemo(
    () => finder.step === 'results' ? finder.computeResults(peptides) : [],
    [finder.step, peptides, finder.computeResults]
  );

  const handleClose = () => {
    localStorage.setItem('wikipeps_survey_done', '1');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('wikipeps_survey_done', '1');
    onClose();
  };

  const totalSteps = 4;
  const currentStep = finder.step === 'results' ? totalSteps : (finder.step as number);
  const progress = finder.step === 'results' ? 100 : ((currentStep - 1) / totalSteps) * 100;

  const secondaryOptions = [
    ...GOAL_OPTIONS.filter((g) => g.label !== finder.primaryGoal),
    { label: 'Just the one', category: '', color: '#374151' },
  ];

  const canAdvance = (() => {
    if (finder.step === 1) return !!finder.primaryGoal;
    if (finder.step === 2) return !!finder.secondaryGoal;
    if (finder.step === 3) return !!finder.experience;
    if (finder.step === 4) return true;
    return false;
  })();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#0d1117',
        border: '1px solid #21262d',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        position: 'relative',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            color: '#2dd4bf',
            textTransform: 'uppercase',
          }}>
            {finder.step === 'results' ? 'Your Results' : 'Peptide Finder'}
          </span>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#4b5563',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
            }}
          >
            {finder.step === 'results' ? '✕ Close' : 'Skip →'}
          </button>
        </div>

        {/* Progress bar */}
        {finder.step !== 'results' && (
          <div style={{
            height: '3px',
            background: '#21262d',
            borderRadius: '99px',
            marginBottom: '2rem',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2dd4bf, #60a5fa)',
              borderRadius: '99px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}

        {/* Step content */}
        <div style={{ minHeight: '280px' }}>
          {finder.step === 1 && (
            <SurveyStep
              question="What's your primary goal?"
              subtitle="Pick the one that matters most to you right now."
              options={GOAL_OPTIONS}
              selected={finder.primaryGoal}
              onSelect={(label) => { finder.setPrimaryGoal(label); }}
            />
          )}
          {finder.step === 2 && (
            <SurveyStep
              question="Any secondary goal?"
              subtitle="Optional — helps us suggest a stack."
              options={secondaryOptions}
              selected={finder.secondaryGoal}
              onSelect={(label) => {
                finder.setSecondaryGoal(label === 'Just the one' ? null : label);
              }}
            />
          )}
          {finder.step === 3 && (
            <SurveyStep
              question="Your experience with peptides?"
              options={EXPERIENCE_OPTIONS}
              selected={
                finder.experience
                  ? Object.entries(EXPERIENCE_MAP).find(([, v]) => v === finder.experience)?.[0] ?? null
                  : null
              }
              onSelect={(label) => { finder.setExperience(EXPERIENCE_MAP[label]); }}
            />
          )}
          {finder.step === 4 && (
            <SurveyStep
              question="Any specific concerns?"
              subtitle="Pick up to 2 — or just hit Next to skip."
              options={CONCERN_OPTIONS.map((c) => ({ label: c }))}
              selected={finder.concerns}
              multiSelect
              maxSelect={2}
              onSelect={finder.toggleConcern}
            />
          )}
          {finder.step === 'results' && (
            <ResultsScreen
              results={results}
              primaryGoal={finder.primaryGoal}
              secondaryGoal={finder.secondaryGoal}
              onClose={handleClose}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {finder.step !== 'results' && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #21262d',
          }}>
            <button
              onClick={finder.back}
              disabled={finder.step === 1}
              style={{
                background: 'none',
                border: '1px solid #21262d',
                borderRadius: '8px',
                padding: '0.6rem 1.1rem',
                color: finder.step === 1 ? '#1f2937' : '#6b7280',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.875rem',
                cursor: finder.step === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>

            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#374151' }}>
              {currentStep} / {totalSteps}
            </span>

            <button
              onClick={finder.next}
              disabled={!canAdvance}
              style={{
                background: canAdvance ? '#2dd4bf' : '#1a2a35',
                border: `1px solid ${canAdvance ? '#2dd4bf' : '#1e3a3a'}`,
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                color: canAdvance ? '#0d1117' : '#374151',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: canAdvance ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              {finder.step === 4 ? 'See Results →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
