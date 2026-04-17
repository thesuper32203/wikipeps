import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient.ts';

interface Partnership {
  id: string;
  vendor_name: string;
  partner_code: string | null;
  referral_link: string | null;
  dashboard_url: string | null;
  notes: string | null;
  is_active: boolean;
  commission_payout: number | null;
  first_time_commission: number | null;
  recurring_commission: number | null;
  created_at: string;
}

const empty = (): Omit<Partnership, 'id' | 'created_at'> => ({
  vendor_name: '',
  partner_code: '',
  referral_link: '',
  dashboard_url: '',
  notes: '',
  is_active: true,
  commission_payout: null,
  first_time_commission: null,
  recurring_commission: null,
});

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(empty());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('partnerships')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setPartnerships(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!addForm.vendor_name.trim()) return;
    setSaving(true);
    const { error: err } = await supabase.from('partnerships').insert([{
      vendor_name: addForm.vendor_name.trim(),
      partner_code: addForm.partner_code?.trim() || null,
      referral_link: addForm.referral_link?.trim() || null,
      dashboard_url: addForm.dashboard_url?.trim() || null,
      notes: addForm.notes?.trim() || null,
      is_active: addForm.is_active,
      commission_payout: addForm.commission_payout,
      first_time_commission: addForm.first_time_commission,
      recurring_commission: addForm.recurring_commission,
    }]);
    setSaving(false);
    if (err) { alert(err.message); return; }
    setShowAdd(false);
    setAddForm(empty());
    load();
  }

  async function handleSaveEdit(id: string) {
    if (!editForm.vendor_name.trim()) return;
    setSaving(true);
    const { error: err } = await supabase.from('partnerships').update({
      vendor_name: editForm.vendor_name.trim(),
      partner_code: editForm.partner_code?.trim() || null,
      referral_link: editForm.referral_link?.trim() || null,
      dashboard_url: editForm.dashboard_url?.trim() || null,
      notes: editForm.notes?.trim() || null,
      is_active: editForm.is_active,
      commission_payout: editForm.commission_payout,
      first_time_commission: editForm.first_time_commission,
      recurring_commission: editForm.recurring_commission,
    }).eq('id', id);
    setSaving(false);
    if (err) { alert(err.message); return; }
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remove partnership with "${name}"? This cannot be undone.`)) return;
    const { error: err } = await supabase.from('partnerships').delete().eq('id', id);
    if (err) { alert(err.message); return; }
    load();
  }

  function startEdit(p: Partnership) {
    setEditingId(p.id);
    setEditForm({
      vendor_name: p.vendor_name,
      partner_code: p.partner_code ?? '',
      referral_link: p.referral_link ?? '',
      dashboard_url: p.dashboard_url ?? '',
      notes: p.notes ?? '',
      is_active: p.is_active,
      commission_payout: p.commission_payout,
      first_time_commission: p.first_time_commission,
      recurring_commission: p.recurring_commission,
    });
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.5rem', fontWeight: 400, color: '#111110', margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>
            Partnerships
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#9ca39a', margin: 0 }}>
            {partnerships.length} {partnerships.length === 1 ? 'partner' : 'partners'}
          </p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} style={addBtnStyle}>
            + Add Partner
          </button>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={formCardStyle}>
          <h3 style={formTitleStyle}>New Partnership</h3>
          <div style={formGridStyle}>
            <label style={labelStyle}>
              Vendor Name *
              <input
                style={inputStyle}
                value={addForm.vendor_name}
                onChange={e => setAddForm(f => ({ ...f, vendor_name: e.target.value }))}
                placeholder="e.g. Amino Club"
                autoFocus
              />
            </label>
            <label style={labelStyle}>
              Partner Code
              <input
                style={inputStyle}
                value={addForm.partner_code ?? ''}
                onChange={e => setAddForm(f => ({ ...f, partner_code: e.target.value }))}
                placeholder="e.g. WIKI15"
              />
            </label>
            <label style={labelStyle}>
              Referral Link
              <input
                style={inputStyle}
                value={addForm.referral_link ?? ''}
                onChange={e => setAddForm(f => ({ ...f, referral_link: e.target.value }))}
                placeholder="https://..."
              />
            </label>
            <label style={labelStyle}>
              Partner Dashboard URL
              <input
                style={inputStyle}
                value={addForm.dashboard_url ?? ''}
                onChange={e => setAddForm(f => ({ ...f, dashboard_url: e.target.value }))}
                placeholder="https://..."
              />
            </label>
            <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
              Notes
              <input
                style={inputStyle}
                value={addForm.notes ?? ''}
                onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Optional notes"
              />
            </label>
            <label style={labelStyle}>
              Commission Payout (%)
              <input
                type="number"
                min="0"
                step="0.01"
                style={inputStyle}
                value={addForm.commission_payout ?? ''}
                onChange={e => setAddForm(f => ({ ...f, commission_payout: e.target.value ? Number(e.target.value) : null }))}
                placeholder="e.g. 15"
              />
            </label>
            <label style={labelStyle}>
              First-Time Commission (%)
              <input
                type="number"
                min="0"
                step="0.01"
                style={inputStyle}
                value={addForm.first_time_commission ?? ''}
                onChange={e => setAddForm(f => ({ ...f, first_time_commission: e.target.value ? Number(e.target.value) : null }))}
                placeholder="e.g. 20"
              />
            </label>
            <label style={labelStyle}>
              Recurring Commission (%)
              <input
                type="number"
                min="0"
                step="0.01"
                style={inputStyle}
                value={addForm.recurring_commission ?? ''}
                onChange={e => setAddForm(f => ({ ...f, recurring_commission: e.target.value ? Number(e.target.value) : null }))}
                placeholder="e.g. 10"
              />
            </label>
            <label style={{ ...labelStyle, flexDirection: 'row', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <input
                type="checkbox"
                checked={addForm.is_active}
                onChange={e => setAddForm(f => ({ ...f, is_active: e.target.checked }))}
              />
              <span>Active</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={handleAdd} disabled={saving || !addForm.vendor_name.trim()} style={saveBtnStyle}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setShowAdd(false); setAddForm(empty()); }} style={cancelBtnStyle}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {partnerships.length === 0 && !showAdd ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed #d0d0c8', borderRadius: '12px', fontFamily: '"Inter", sans-serif', color: '#9ca39a', fontSize: '0.875rem' }}>
          No partners yet.{' '}
          <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', color: '#4a7a5a', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
            Add your first one →
          </button>
        </div>
      ) : partnerships.length > 0 && (
        <div style={{ border: '1px solid #e4e4de', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f4f4f0', borderBottom: '1px solid #e4e4de' }}>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Partner Code</th>
                <th style={thStyle}>Referral Link</th>
                <th style={thStyle}>Dashboard</th>
                <th style={thStyle}>Payout</th>
                <th style={thStyle}>1st Buy</th>
                <th style={thStyle}>Recurring</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {partnerships.map((p, i) => (
                editingId === p.id ? (
                  <tr key={p.id}>
                    <td colSpan={9} style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined, background: '#f9f9f7' }}>
                      <div style={formGridStyle}>
                        <label style={labelStyle}>
                          Vendor Name *
                          <input style={inputStyle} value={editForm.vendor_name} onChange={e => setEditForm(f => ({ ...f, vendor_name: e.target.value }))} />
                        </label>
                        <label style={labelStyle}>
                          Partner Code
                          <input style={inputStyle} value={editForm.partner_code ?? ''} onChange={e => setEditForm(f => ({ ...f, partner_code: e.target.value }))} placeholder="e.g. WIKI15" />
                        </label>
                        <label style={labelStyle}>
                          Referral Link
                          <input style={inputStyle} value={editForm.referral_link ?? ''} onChange={e => setEditForm(f => ({ ...f, referral_link: e.target.value }))} placeholder="https://..." />
                        </label>
                        <label style={labelStyle}>
                          Partner Dashboard URL
                          <input style={inputStyle} value={editForm.dashboard_url ?? ''} onChange={e => setEditForm(f => ({ ...f, dashboard_url: e.target.value }))} placeholder="https://..." />
                        </label>
                        <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
                          Notes
                          <input style={inputStyle} value={editForm.notes ?? ''} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                        </label>
                        <label style={labelStyle}>
                          Commission Payout (%)
                          <input type="number" min="0" step="0.01" style={inputStyle} value={editForm.commission_payout ?? ''} onChange={e => setEditForm(f => ({ ...f, commission_payout: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 15" />
                        </label>
                        <label style={labelStyle}>
                          First-Time Commission (%)
                          <input type="number" min="0" step="0.01" style={inputStyle} value={editForm.first_time_commission ?? ''} onChange={e => setEditForm(f => ({ ...f, first_time_commission: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 20" />
                        </label>
                        <label style={labelStyle}>
                          Recurring Commission (%)
                          <input type="number" min="0" step="0.01" style={inputStyle} value={editForm.recurring_commission ?? ''} onChange={e => setEditForm(f => ({ ...f, recurring_commission: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 10" />
                        </label>
                        <label style={{ ...labelStyle, flexDirection: 'row', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
                          <input type="checkbox" checked={editForm.is_active} onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))} />
                          <span>Active</span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button onClick={() => handleSaveEdit(p.id)} disabled={saving || !editForm.vendor_name.trim()} style={saveBtnStyle}>
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setEditingId(null)} style={cancelBtnStyle}>Cancel</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id}>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, color: '#111110' }}>{p.vendor_name}</span>
                      {p.notes && <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.725rem', color: '#9ca39a', margin: '0.2rem 0 0' }}>{p.notes}</p>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.partner_code ? (
                        <code style={{ fontFamily: 'monospace', fontSize: '0.775rem', color: '#6b7266', background: '#f4f4f0', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                          {p.partner_code}
                        </code>
                      ) : <span style={{ color: '#c8c8c0', fontFamily: '"Inter", sans-serif', fontSize: '0.775rem' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.referral_link ? (
                        <a href={p.referral_link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#4a7a5a', textDecoration: 'none' }}>
                          Link ↗
                        </a>
                      ) : <span style={{ color: '#c8c8c0', fontFamily: '"Inter", sans-serif', fontSize: '0.775rem' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.dashboard_url ? (
                        <a href={p.dashboard_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.775rem', color: '#6b7266', textDecoration: 'none' }}>
                          Dashboard ↗
                        </a>
                      ) : <span style={{ color: '#c8c8c0', fontFamily: '"Inter", sans-serif', fontSize: '0.775rem' }}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.commission_payout != null
                        ? <span style={commStyle}>{p.commission_payout}%</span>
                        : <span style={dashStyle}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.first_time_commission != null
                        ? <span style={commStyle}>{p.first_time_commission}%</span>
                        : <span style={dashStyle}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      {p.recurring_commission != null
                        ? <span style={commStyle}>{p.recurring_commission}%</span>
                        : <span style={dashStyle}>—</span>}
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined }}>
                      <span style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: p.is_active ? '#4a7a5a' : '#b45309',
                        background: p.is_active ? '#edf4ee' : '#fef3c7',
                        border: `1px solid ${p.is_active ? 'rgba(74,122,90,0.25)' : 'rgba(180,83,9,0.2)'}`,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                      }}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, borderTop: i > 0 ? '1px solid #f0f0eb' : undefined, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => startEdit(p)}
                        style={{ fontFamily: '"Inter", sans-serif', background: 'none', border: 'none', color: '#6b7266', cursor: 'pointer', fontSize: '0.775rem', padding: 0, marginRight: '1rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.vendor_name)}
                        style={{ fontFamily: '"Inter", sans-serif', background: 'none', border: 'none', color: '#c0a0a0', cursor: 'pointer', fontSize: '0.775rem', padding: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#dc4a3d')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#c0a0a0')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
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

const addBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: '#4a7a5a',
  color: '#ffffff',
  border: '1px solid transparent',
  padding: '0.4rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.825rem',
  fontWeight: 500,
};

const formCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e4e4de',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
};

const formTitleStyle: React.CSSProperties = {
  fontFamily: '"Instrument Serif", serif',
  fontSize: '1.1rem',
  fontWeight: 400,
  color: '#111110',
  margin: '0 0 1.25rem',
  letterSpacing: '-0.01em',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.85rem',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.775rem',
  color: '#6b7266',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.875rem',
  color: '#111110',
  background: '#fafaf8',
  border: '1px solid #e4e4de',
  borderRadius: '7px',
  padding: '0.45rem 0.75rem',
  outline: 'none',
};

const saveBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: '#4a7a5a',
  color: '#ffffff',
  border: '1px solid transparent',
  padding: '0.4rem 1.1rem',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.825rem',
  fontWeight: 500,
};

const cancelBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: 'none',
  color: '#6b7266',
  border: '1px solid #e4e4de',
  padding: '0.4rem 1rem',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.825rem',
};

const commStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.8rem',
  color: '#2d5438',
  fontWeight: 600,
};

const dashStyle: React.CSSProperties = {
  color: '#c8c8c0',
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.775rem',
};
