import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPeptides } from '@wikipeps/shared';
import type { Peptide } from '@wikipeps/shared';
import supabase from '../supabaseClient.ts';

type PeptideListItem = Pick<Peptide, 'id' | 'slug' | 'name'>;

export default function HomePage() {
  const [peptides, setPeptides] = useState<PeptideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPeptides(supabase)
      .then(setPeptides)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load peptides.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading peptides…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (peptides.length === 0) return <p>No published peptides yet.</p>;

  return (
    <>
      <h2>Peptide Encyclopedia</h2>
      <p>{peptides.length} peptide{peptides.length !== 1 ? 's' : ''} documented.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {peptides.map((p) => (
          <li key={p.id} style={{ padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0' }}>
            <Link to={`/peptides/${p.slug}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
