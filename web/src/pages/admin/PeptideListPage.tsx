import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAllPeptides, deletePeptide } from '@wikipeps/shared';
import type { Peptide } from '@wikipeps/shared';
import supabase from '../../supabaseClient.ts';

type Row = Pick<Peptide, 'id' | 'slug' | 'name' | 'is_published' | 'updated_at'>;

export default function PeptideListPage() {
  const [peptides, setPeptides] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    listAllPeptides(supabase)
      .then(setPeptides)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deletePeptide(supabase, id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  if (loading) return (
    <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#4b5563', fontSize: '0.9rem' }}>Loading…</p>
  );

  if (error) return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', color: '#f87171', background: '#1c1010', border: '1px solid #3f1515', borderRadius: '8px', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
      {error}
    </div>
  );

  return (
    <>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.5rem', fontWeight: 400, color: '#e6edf3', margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>
            Compounds
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.775rem', color: '#4b5563', margin: 0 }}>
            {peptides.length} {peptides.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Link to="/admin/peptides/new" style={newBtnStyle}>
          + New Peptide
        </Link>
      </div>

      {peptides.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 0',
          border: '1px dashed #21262d',
          borderRadius: '12px',
          fontFamily: '"DM Sans", sans-serif',
          color: '#4b5563',
          fontSize: '0.875rem',
        }}>
          No peptides yet.{' '}
          <Link to="/admin/peptides/new" style={{ color: '#2dd4bf' }}>Create your first one →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid #21262d', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#111318', borderBottom: '1px solid #21262d' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Updated</th>
                <th style={{ ...thStyle, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {peptides.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #1a1f28' : undefined }}>
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, color: '#e6edf3' }}>
                      {p.name}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #1a1f28' : undefined }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.775rem', color: '#6b7280', background: '#161b22', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {p.slug}
                    </code>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #1a1f28' : undefined }}>
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: p.is_published ? '#34d399' : '#fbbf24',
                      background: p.is_published ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                      border: `1px solid ${p.is_published ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                    }}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #1a1f28' : undefined, fontFamily: '"DM Sans", sans-serif', color: '#4b5563', fontSize: '0.775rem' }}>
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #1a1f28' : undefined, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/peptides/${p.slug}`}
                      target="_blank"
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.775rem', color: '#4b5563', textDecoration: 'none', marginRight: '1rem' }}
                    >
                      View ↗
                    </Link>
                    <Link
                      to={`/admin/peptides/${p.id}/edit`}
                      style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.775rem', color: '#8b949e', textDecoration: 'none', marginRight: '1rem' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ fontFamily: '"DM Sans", sans-serif', background: 'none', border: 'none', color: '#6b2020', cursor: 'pointer', fontSize: '0.775rem', padding: 0, transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#6b2020')}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.6rem 0.9rem',
  background: '#111318',
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 600,
  fontSize: '0.72rem',
  color: '#4b5563',
  textAlign: 'left',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 0.9rem',
  background: '#0d1117',
};

const newBtnStyle: React.CSSProperties = {
  fontFamily: '"DM Sans", sans-serif',
  background: '#0d3d38',
  color: '#2dd4bf',
  border: '1px solid #1d5a54',
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '0.825rem',
  fontWeight: 500,
};
