import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPeptideBySlug } from '@wikipeps/shared';
import type { PeptideWithRelations } from '@wikipeps/shared';
import supabase from '../supabaseClient.ts';

export default function PeptidePage() {
  const { slug } = useParams<{ slug: string }>();
  const [peptide, setPeptide] = useState<PeptideWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    getPeptideBySlug(supabase, slug)
      .then(setPeptide)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load peptide.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <p style={{ fontFamily: '"Inter", sans-serif', color: '#9ca39a' }}>Loading…</p>
  );

  if (error) return (
    <p style={{ fontFamily: '"Inter", sans-serif', color: '#dc4a3d' }}>{error}</p>
  );

  if (!peptide) return (
    <>
      <p style={{ fontFamily: '"Inter", sans-serif', color: '#9ca39a' }}>Peptide not found.</p>
      <Link to="/">← Back to index</Link>
    </>
  );

  return (
    <article>
      <Link
        to="/"
        style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.825rem', color: '#9ca39a', textDecoration: 'none' }}
      >
        ← All peptides
      </Link>

      <h1 style={{
        fontFamily: '"Instrument Serif", serif',
        fontSize: 'clamp(2rem, 5vw, 2.75rem)',
        fontWeight: 400,
        color: '#111110',
        margin: '0.6rem 0 0.4rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}>
        {peptide.name}
      </h1>

      {peptide.peptide_aliases.length > 0 && (
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#6b7266', fontStyle: 'italic', margin: '0 0 1.5rem' }}>
          Also known as: {peptide.peptide_aliases.map((a) => a.alias).join(', ')}
        </p>
      )}

      {peptide.overview && (
        <section style={{ marginTop: '1.5rem' }}>
          <SectionHeading>Overview</SectionHeading>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.95rem', color: '#6b7266', whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
            {peptide.overview}
          </p>
        </section>
      )}

      {peptide.peptide_research_links.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <SectionHeading>Research Links</SectionHeading>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {peptide.peptide_research_links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.research_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem' }}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {peptide.vendor_links.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <SectionHeading>Where to Buy</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {peptide.vendor_links.map((v) => (
              <div key={v.id} style={{
                padding: '0.9rem 1.1rem',
                border: '1px solid #e4e4de',
                borderRadius: '10px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}>
                {v.vendor_name && (
                  <strong style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#111110' }}>
                    {v.vendor_name}
                  </strong>
                )}
                {v.url && (
                  <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
                    Visit store
                  </a>
                )}
                {v.referral_code && (
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#6b7266' }}>
                    Code: <code style={{ background: '#edf4ee', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#2d5438' }}>{v.referral_code}</code>
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <footer style={{ marginTop: '3rem', paddingTop: '1.25rem', borderTop: '1px solid #e4e4de' }}>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#9ca39a', margin: 0 }}>
          Last updated: {new Date(peptide.updated_at).toLocaleDateString()}
        </p>
      </footer>
    </article>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: '"Instrument Serif", serif',
      fontSize: '1.2rem',
      fontWeight: 400,
      color: '#111110',
      margin: '0 0 0.75rem',
      letterSpacing: '-0.01em',
    }}>
      {children}
    </h2>
  );
}
