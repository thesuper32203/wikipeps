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

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>Peptides ({peptides.length})</h2>
        <Link to="/admin/peptides/new" style={newBtnStyle}>+ New Peptide</Link>
      </div>

      {peptides.length === 0 ? (
        <p style={{ color: '#888' }}>No peptides yet. Create your first one.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', background: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Slug</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Updated</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {peptides.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={tdStyle}><strong>{p.name}</strong></td>
                <td style={tdStyle}><code style={{ fontSize: '0.8rem', color: '#555' }}>{p.slug}</code></td>
                <td style={tdStyle}>
                  <span style={{
                    color: p.is_published ? '#16a34a' : '#d97706',
                    background: p.is_published ? '#f0fdf4' : '#fffbeb',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#888', fontSize: '0.8rem' }}>
                  {new Date(p.updated_at).toLocaleDateString()}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link to={`/peptides/${p.slug}`} target="_blank" style={{ fontSize: '0.8rem', marginRight: '0.75rem', color: '#888' }}>
                    View
                  </Link>
                  <Link to={`/admin/peptides/${p.id}/edit`} style={{ fontSize: '0.8rem', marginRight: '0.75rem' }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

const thStyle: React.CSSProperties = { padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.8rem', color: '#555' };
const tdStyle: React.CSSProperties = { padding: '0.65rem 0.75rem' };
const newBtnStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#fff',
  padding: '0.4rem 1rem',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '0.875rem',
};
