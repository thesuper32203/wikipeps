import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { listPeptides, CATEGORY_FILTERS } from '@wikipeps/shared';
import type { PeptideListItem } from '@wikipeps/shared';
import supabase from '../supabaseClient.ts';

const KEYFRAMES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export default function HomePage() {
  const [peptides, setPeptides] = useState<PeptideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cardsReady, setCardsReady] = useState(false);

  useEffect(() => {
    listPeptides(supabase)
      .then(setPeptides)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load peptides.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setCardsReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [loading]);


  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ── Top nav ──────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: '1px solid #e4e4de',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        height: '52px',
        background: '#ffffff',
      }}>
        <span style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '1.2rem',
          color: '#111110',
          letterSpacing: '-0.01em',
          marginRight: 'auto',
        }}>
          WikiPeps
        </span>
        <NavLink
          to="/"
          style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.825rem', color: '#4a7a5a', textDecoration: 'none' }}
        >
          Compounds
        </NavLink>
        <NavLink
          to="/vendors"
          style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.825rem', color: '#6b7266', textDecoration: 'none' }}
        >
          Vendors
        </NavLink>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'radial-gradient(ellipse at 50% -20%, #edf4ee 0%, #fafaf8 55%)',
        padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem clamp(3rem, 6vw, 5rem)',
        textAlign: 'center',
        borderBottom: '1px solid #e4e4de',
      }}>
        <div style={{ animation: 'fadeIn 0.7s ease both' }}>
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            color: '#4a7a5a',
            textTransform: 'uppercase',
            margin: '0 0 1rem',
          }}>
            The Open Peptide Encyclopedia
          </p>

          <h1 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(3.25rem, 9vw, 6rem)',
            fontWeight: 400,
            color: '#111110',
            margin: '0 0 1rem',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
          }}>
            WikiPeps
          </h1>

          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#6b7266',
            maxWidth: '500px',
            margin: '0 auto 1.25rem',
            lineHeight: 1.65,
          }}>
            Peer-reviewed summaries of peptide research,<br />
            mechanisms, and clinical data — in plain language.
          </p>

        </div>

        {/* Search bar */}
        <div style={{
          animation: 'fadeIn 0.7s 0.15s ease both',
          maxWidth: '580px',
          margin: '0 auto',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            left: '1.1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca39a',
            fontSize: '1.05rem',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search peptides, effects, mechanisms…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.9rem 3.5rem 0.9rem 2.8rem',
              background: '#ffffff',
              border: '1px solid #d0d0c8',
              borderRadius: '14px',
              color: '#111110',
              fontSize: '0.975rem',
              fontFamily: '"Inter", sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4a7a5a';
              e.target.style.boxShadow = '0 0 0 3px rgba(74,122,90,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d0d0c8';
              e.target.style.boxShadow = 'none';
            }}
          />
          <kbd style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#f4f4f0',
            border: '1px solid #e4e4de',
            borderRadius: '5px',
            padding: '0.15rem 0.4rem',
            fontSize: '0.65rem',
            color: '#9ca39a',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.03em',
          }}>
            ⌘K
          </kbd>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div style={{
        background: '#f4f4f0',
        borderBottom: '1px solid #e4e4de',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(1.5rem, 5vw, 3.5rem)',
        animation: 'fadeIn 0.6s 0.25s ease both',
      }}>
        {[
          { value: loading ? '—' : String(peptides.length), label: 'Compounds Documented' },
          { value: '7',        label: 'Categories'          },
          { value: 'Ongoing',  label: 'Research Updates'    },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: '1.5rem',
              color: '#4a7a5a',
              lineHeight: 1,
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.65rem',
              color: '#9ca39a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '0.2rem',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '2.25rem 1.5rem 5rem' }}>

        {/* Category filter pills */}
        <div style={{
          display: 'flex',
          gap: '0.45rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          animation: 'fadeIn 0.5s 0.35s ease both',
        }}>
          {CATEGORY_FILTERS.map((cat) => {
            const active = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  background: active ? '#edf4ee' : '#ffffff',
                  border: `1px solid ${active ? '#4a7a5a' : '#e4e4de'}`,
                  borderRadius: '999px',
                  color: active ? '#2d5438' : '#6b7266',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: active ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.01em',
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: active ? cat.color : '#d0d0c8',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Section heading row */}
        {(() => {
          const normalize = (s: string) => s.toLowerCase().replace(/[-_]/g, ' ');
          const q = normalize(searchQuery.trim());
          const catLower = activeCategory.toLowerCase();
          const displayed = peptides.filter((p) => {
            const pTags = p.peptide_tags.map((t) => normalize(t.tag));
            const matchesCategory = activeCategory === 'All'
              || p.category === activeCategory
              || pTags.some((t) => catLower.includes(t) || t.includes(catLower.replace(/[^a-z]/g, '')));
            const matchesSearch = q === '' ||
              normalize(p.name).includes(q) ||
              (p.overview ? normalize(p.overview).includes(q) : false) ||
              pTags.some((t) => t.includes(q));
            return matchesCategory && matchesSearch;
          });
          return (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e4e4de',
              }}>
                <h2 style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  color: '#111110',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}>
                  {activeCategory === 'All' ? 'All Compounds' : activeCategory}
                </h2>
                {!loading && (
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#9ca39a' }}>
                    {displayed.length} {displayed.length === 1 ? 'entry' : 'entries'}
                  </span>
                )}
              </div>

              {/* Loading state */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '5rem 0', fontFamily: '"Inter", sans-serif', color: '#9ca39a', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  Loading compounds…
                </div>
              )}

              {/* Error state */}
              {error && (
                <div style={{ fontFamily: '"Inter", sans-serif', color: '#dc4a3d', background: '#fef2f1', border: '1px solid rgba(220,74,61,0.2)', borderRadius: '8px', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && displayed.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', fontFamily: '"Inter", sans-serif', color: '#9ca39a' }}>
                  {activeCategory === 'All' ? 'No published compounds yet.' : `No compounds in "${activeCategory}" yet.`}
                </div>
              )}

              {/* Cards grid */}
              {!loading && !error && displayed.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
                  {displayed.map((p, i) => (
                    <PeptideCard key={p.id} peptide={p} index={i} visible={cardsReady} />
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #e4e4de',
        padding: '2.5rem 1.5rem',
        background: '#f4f4f0',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.72rem',
          color: '#9ca39a',
          maxWidth: '600px',
          margin: '0 auto 1rem',
          lineHeight: 1.75,
        }}>
          <span style={{ color: '#6b7266', fontWeight: 500 }}>Research Disclaimer: </span>
          WikiPeps is intended for educational and informational purposes only. Nothing on this site
          constitutes medical advice. All peptide research should be conducted in compliance with
          applicable laws and regulations. Consult a qualified healthcare professional before use.
        </p>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.68rem',
          color: '#c8c8c0',
          margin: 0,
        }}>
          © {new Date().getFullYear()} WikiPeps
        </p>
      </footer>
    </>
  );
}

function PeptideCard({
  peptide,
  index,
  visible,
}: {
  peptide: PeptideListItem;
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const snippet = peptide.overview
    ? peptide.overview.length > 115
      ? peptide.overview.slice(0, 115).trimEnd() + '…'
      : peptide.overview
    : null;

  return (
    <Link to={`/peptides/${peptide.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#f4f4f0' : '#ffffff',
          border: `1px solid ${hovered ? 'rgba(74,122,90,0.3)' : '#e4e4de'}`,
          borderRadius: '14px',
          padding: '1.35rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(74,122,90,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
          opacity: visible ? 1 : 0,
          animation: visible ? `fadeUp 0.45s ${Math.min(index * 0.055, 0.6)}s ease both` : 'none',
        }}
      >
        {/* Top row: dot + type badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: hovered ? '#4a7a5a' : '#c8dbc8',
            display: 'block',
            transition: 'background 0.2s',
          }} />
          <span style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.65rem',
            color: '#9ca39a',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Peptide
          </span>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '1.35rem',
          fontWeight: 400,
          color: '#111110',
          margin: '0 0 0.55rem',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          {peptide.name}
        </h3>

        {/* Snippet */}
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.815rem',
          color: '#6b7266',
          margin: '0 0 1.1rem',
          lineHeight: 1.65,
          flexGrow: 1,
          minHeight: snippet ? undefined : '2.4rem',
        }}>
          {snippet ?? <span style={{ color: '#c8c8c0', fontStyle: 'italic' }}>No overview yet.</span>}
        </p>

        {/* CTA */}
        <div style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.775rem',
          color: hovered ? '#4a7a5a' : '#9ca39a',
          transition: 'color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          Explore
          <span style={{
            display: 'inline-block',
            transform: hovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform 0.2s',
          }}>→</span>
        </div>
      </div>
    </Link>
  );
}
