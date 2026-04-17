import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAllPeptides, deletePeptide, CATEGORIES } from '@wikipeps/shared';
import type { Peptide } from '@wikipeps/shared';
import supabase from '../../supabaseClient.ts';

type Row = Pick<Peptide, 'id' | 'slug' | 'name' | 'category' | 'is_published' | 'updated_at'>;

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
    <p style={{ fontFamily: '"Inter", sans-serif', color: '#9ca39a', fontSize: '0.9rem' }}>Loading…</p>
  );

  if (error) return (
    <div style={{ fontFamily: '"Inter", sans-serif', color: '#dc4a3d', background: '#fef2f1', border: '1px solid rgba(220,74,61,0.2)', borderRadius: '8px', padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
      {error}
    </div>
  );

  return (
    <>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.5rem', fontWeight: 400, color: '#111110', margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>
            Compounds
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#9ca39a', margin: 0 }}>
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
          border: '1px dashed #d0d0c8',
          borderRadius: '12px',
          fontFamily: '"Inter", sans-serif',
          color: '#9ca39a',
          fontSize: '0.875rem',
        }}>
          No peptides yet.{' '}
          <Link to="/admin/peptides/new" style={{ color: '#4a7a5a' }}>Create your first one →</Link>
        </div>
      ) : (
        <div style={{ border: '1px solid #e4e4de', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f4f4f0', borderBottom: '1px solid #e4e4de' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Updated</th>
                <th style={{ ...thStyle, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {peptides.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                    <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, color: '#111110' }}>
                      {p.name}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.775rem', color: '#6b7266', background: '#f4f4f0', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {p.slug}
                    </code>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                    {p.category ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.75rem',
                        color: '#6b7266',
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: CATEGORIES.find(c => c.label === p.category)?.color ?? '#9ca39a',
                          flexShrink: 0,
                        }} />
                        {p.category}
                      </span>
                    ) : (
                      <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#9ca39a' }}>—</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                    <span style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: p.is_published ? '#4a7a5a' : '#b45309',
                      background: p.is_published ? '#edf4ee' : '#fef3c7',
                      border: `1px solid ${p.is_published ? 'rgba(74,122,90,0.25)' : 'rgba(180,83,9,0.2)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                    }}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined, fontFamily: '"Inter", sans-serif', color: '#9ca39a', fontSize: '0.775rem' }}>
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/peptides/${p.slug}`}
                      target="_blank"
                      style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#9ca39a', textDecoration: 'none', marginRight: '1rem' }}
                    >
                      View ↗
                    </Link>
                    <Link
                      to={`/admin/peptides/${p.id}/edit`}
                      style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#6b7266', textDecoration: 'none', marginRight: '1rem' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ fontFamily: '"Inter", sans-serif', background: 'none', border: 'none', color: '#c0a0a0', cursor: 'pointer', fontSize: '0.775rem', padding: 0, transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#dc4a3d')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#c0a0a0')}
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
  background: '#f4f4f0',
  fontFamily: '"Inter", sans-serif',
  fontWeight: 600,
  fontSize: '0.72rem',
  color: '#9ca39a',
  textAlign: 'left',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 0.9rem',
  background: '#ffffff',
};

const newBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: '#4a7a5a',
  color: '#ffffff',
  border: '1px solid transparent',
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '0.825rem',
  fontWeight: 500,
};
