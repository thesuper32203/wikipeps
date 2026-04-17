import { useState, useCallback } from 'react';
import { GOAL_OPTIONS, CONCERN_TAGS } from '@wikipeps/shared';
import type { PeptideListItem } from '@wikipeps/shared';

export type Experience = 'beginner' | 'experienced' | 'advanced';
export type Step = 1 | 2 | 3 | 4 | 'results';

export interface ScoredPeptide {
  peptide: PeptideListItem;
  score: number;
}

export interface FinderState {
  step: Step;
  primaryGoal: string | null;
  secondaryGoal: string | null;
  experience: Experience | null;
  concerns: string[];
}

export interface FinderActions {
  setPrimaryGoal: (goal: string) => void;
  setSecondaryGoal: (goal: string | null) => void;
  setExperience: (exp: Experience) => void;
  toggleConcern: (concern: string) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  computeResults: (peptides: PeptideListItem[]) => ScoredPeptide[];
}

const INITIAL_STATE: FinderState = {
  step: 1,
  primaryGoal: null,
  secondaryGoal: null,
  experience: null,
  concerns: [],
};

export function usePeptideFinder(): FinderState & FinderActions {
  const [state, setState] = useState<FinderState>(INITIAL_STATE);

  const setPrimaryGoal = useCallback((goal: string) => {
    setState((s) => ({ ...s, primaryGoal: goal }));
  }, []);

  const setSecondaryGoal = useCallback((goal: string | null) => {
    setState((s) => ({ ...s, secondaryGoal: goal }));
  }, []);

  const setExperience = useCallback((exp: Experience) => {
    setState((s) => ({ ...s, experience: exp }));
  }, []);

  const toggleConcern = useCallback((concern: string) => {
    setState((s) => {
      const already = s.concerns.includes(concern);
      if (already) return { ...s, concerns: s.concerns.filter((c) => c !== concern) };
      if (s.concerns.length >= 2) return s;
      return { ...s, concerns: [...s.concerns, concern] };
    });
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (s.step === 1 && !s.primaryGoal) return s;
      if (s.step === 4) return { ...s, step: 'results' };
      if (typeof s.step === 'number') return { ...s, step: (s.step + 1) as Step };
      return s;
    });
  }, []);

  const back = useCallback(() => {
    setState((s) => {
      if (s.step === 'results') return { ...s, step: 4 };
      if (typeof s.step === 'number' && s.step > 1) return { ...s, step: (s.step - 1) as Step };
      return s;
    });
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const computeResults = useCallback((peptides: PeptideListItem[]): ScoredPeptide[] => {
    const primaryCategory = GOAL_OPTIONS.find((g) => g.label === state.primaryGoal)?.category ?? null;
    const secondaryCategory = state.secondaryGoal && state.secondaryGoal !== 'none'
      ? GOAL_OPTIONS.find((g) => g.label === state.secondaryGoal)?.category ?? null
      : null;

    const normalize = (s: string) => s.toLowerCase().replace(/[-\s]/g, '_');

    const scored = peptides.map((p) => {
      let score = 0;

      if (primaryCategory && p.category === primaryCategory) score += 5;
      if (secondaryCategory && p.category === secondaryCategory) score += 2;

      const pTags = p.peptide_tags.map((t) => normalize(t.tag));
      const isAdvanced = pTags.includes('advanced');

      for (const concern of state.concerns) {
        const matchTags = CONCERN_TAGS[concern] ?? [];
        const hits = matchTags.filter((mt) => pTags.some((pt) => pt.includes(mt) || mt.includes(pt)));
        score += hits.length;
      }

      if (state.experience === 'beginner' && isAdvanced) score = Math.max(0, score - 4);

      return { peptide: p, score };
    });

    return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  }, [state]);

  return {
    ...state,
    setPrimaryGoal,
    setSecondaryGoal,
    setExperience,
    toggleConcern,
    next,
    back,
    reset,
    computeResults,
  };
}
