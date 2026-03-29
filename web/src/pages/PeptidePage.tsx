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

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!peptide) {
    return (
      <>
        <p>Peptide not found.</p>
        <Link to="/">← Back to index</Link>
      </>
    );
  }

  return (
    <article>
      <Link to="/" style={{ fontSize: '0.9rem' }}>← All peptides</Link>

      <h1 style={{ marginTop: '0.5rem' }}>{peptide.name}</h1>

      {peptide.peptide_aliases.length > 0 && (
        <p style={{ color: '#555', fontStyle: 'italic' }}>
          Also known as: {peptide.peptide_aliases.map((a) => a.alias).join(', ')}
        </p>
      )}

      {peptide.overview && (
        <section style={{ marginTop: '1rem' }}>
          <h2>Overview</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{peptide.overview}</p>
        </section>
      )}

      {peptide.peptide_research_links.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>Research Links</h2>
          <ul>
            {peptide.peptide_research_links.map((link) => (
              <li key={link.id}>
                <a href={link.research_link} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {peptide.vendor_links.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>Where to Buy</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {peptide.vendor_links.map((v) => (
              <li key={v.id} style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                {v.vendor_name && <strong>{v.vendor_name}</strong>}
                {v.url && (
                  <span>
                    {' '}
                    <a href={v.url} target="_blank" rel="noopener noreferrer">Visit store</a>
                  </span>
                )}
                {v.referral_code && (
                  <span style={{ marginLeft: '0.5rem', color: '#555', fontSize: '0.875rem' }}>
                    Code: <code>{v.referral_code}</code>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#888' }}>
        Last updated: {new Date(peptide.updated_at).toLocaleDateString()}
      </footer>
    </article>
  );
}
