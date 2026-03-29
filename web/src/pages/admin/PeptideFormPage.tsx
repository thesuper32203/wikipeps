import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getPeptideById,
  createPeptide,
  updatePeptide,
} from '@wikipeps/shared';
import type { ResearchLinkInput, VendorLinkInput } from '@wikipeps/shared';
import supabase from '../../supabaseClient.ts';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

interface VendorForm {
  vendor_name: string;
  url: string;
  referral_code: string;
  affiliate: string;
}

interface ResearchLinkForm {
  title: string;
  research_link: string;
}

export default function PeptideFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugLocked, setSlugLocked] = useState(false);
  const [overview, setOverview] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [aliases, setAliases] = useState<string[]>(['']);
  const [researchLinks, setResearchLinks] = useState<ResearchLinkForm[]>([{ title: '', research_link: '' }]);
  const [vendorLinks, setVendorLinks] = useState<VendorForm[]>([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;

    getPeptideById(supabase, id)
      .then((data) => {
        if (!data) { navigate('/admin', { replace: true }); return; }
        setName(data.name);
        setSlug(data.slug);
        setSlugLocked(true);
        setOverview(data.overview ?? '');
        setIsPublished(data.is_published);
        setAliases([...data.peptide_aliases.map((a) => a.alias), '']);
        setResearchLinks([
          ...data.peptide_research_links.map((l) => ({ title: l.title, research_link: l.research_link })),
          { title: '', research_link: '' },
        ]);
        setVendorLinks(
          data.vendor_links.map((v) => ({
            vendor_name: v.vendor_name ?? '',
            url: v.url ?? '',
            referral_code: v.referral_code ?? '',
            affiliate: v.affiliate ?? '',
          }))
        );
        setLoading(false);
      })
      .catch(() => navigate('/admin', { replace: true }));
  }, [id, isEdit, navigate]);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugLocked) setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    setError(null);

    const peptideInput = {
      name: name.trim(),
      slug: slug.trim(),
      overview: overview.trim() || null,
      is_published: isPublished,
    };

    const validAliases = aliases.map((a) => a.trim()).filter(Boolean);

    const validLinks: ResearchLinkInput[] = researchLinks
      .filter((l) => l.title.trim() && l.research_link.trim())
      .map((l) => ({ title: l.title.trim(), research_link: l.research_link.trim() }));

    const validVendors: VendorLinkInput[] = vendorLinks
      .filter((v) => v.vendor_name.trim() || v.url.trim())
      .map((v) => ({
        vendor_name: v.vendor_name.trim() || null,
        url: v.url.trim() || null,
        referral_code: v.referral_code.trim() || null,
        affiliate: v.affiliate.trim() || null,
      }));

    try {
      if (isEdit && id) {
        await updatePeptide(supabase, id, peptideInput, validAliases, validLinks, validVendors);
      } else {
        await createPeptide(supabase, peptideInput, validAliases, validLinks, validVendors);
      }
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Peptide' : 'New Peptide'}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published
          </label>
          <button type="button" onClick={() => navigate('/admin')} style={cancelBtnStyle}>Cancel</button>
          <button type="submit" disabled={saving} style={saveBtnStyle}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      {/* Basic info */}
      <Section title="Basic Info">
        <Field label="Name *">
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            style={inputStyle}
            placeholder="BPC-157"
          />
        </Field>
        <Field label="Slug *">
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugLocked(true); }}
            required
            style={inputStyle}
            placeholder="bpc-157"
          />
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#888' }}>
            URL: /peptides/{slug || '…'}
          </p>
        </Field>
        <Field label="Overview">
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Describe the peptide…"
          />
        </Field>
      </Section>

      {/* Aliases */}
      <Section title="Aliases">
        {aliases.map((alias, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              value={alias}
              onChange={(e) => {
                const next = [...aliases];
                next[i] = e.target.value;
                setAliases(next);
              }}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Alternate name"
            />
            {aliases.length > 1 && (
              <button type="button" onClick={() => setAliases(aliases.filter((_, j) => j !== i))} style={removeBtnStyle}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setAliases([...aliases, ''])} style={addBtnStyle}>
          + Add alias
        </button>
      </Section>

      {/* Research links */}
      <Section title="Research Links">
        {researchLinks.map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <input
                value={link.title}
                onChange={(e) => {
                  const next = [...researchLinks];
                  next[i] = { ...next[i], title: e.target.value };
                  setResearchLinks(next);
                }}
                style={inputStyle}
                placeholder="Title"
              />
              <input
                value={link.research_link}
                onChange={(e) => {
                  const next = [...researchLinks];
                  next[i] = { ...next[i], research_link: e.target.value };
                  setResearchLinks(next);
                }}
                style={inputStyle}
                placeholder="https://pubmed.ncbi.nlm.nih.gov/…"
              />
            </div>
            {researchLinks.length > 1 && (
              <button type="button" onClick={() => setResearchLinks(researchLinks.filter((_, j) => j !== i))} style={removeBtnStyle}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setResearchLinks([...researchLinks, { title: '', research_link: '' }])} style={addBtnStyle}>
          + Add link
        </button>
      </Section>

      {/* Vendor links */}
      <Section title="Vendor Links">
        {vendorLinks.map((v, i) => (
          <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button type="button" onClick={() => setVendorLinks(vendorLinks.filter((_, j) => j !== i))} style={{ ...removeBtnStyle, fontSize: '0.75rem' }}>
                ✕ Remove
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Field label="Vendor name">
                <input value={v.vendor_name} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], vendor_name: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="Peptide Sciences" />
              </Field>
              <Field label="URL">
                <input value={v.url} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], url: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="https://…" />
              </Field>
              <Field label="Referral code">
                <input value={v.referral_code} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], referral_code: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="SAVE10" />
              </Field>
              <Field label="Affiliate info">
                <input value={v.affiliate} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], affiliate: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="e.g. Commission Junction" />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setVendorLinks([...vendorLinks, { vendor_name: '', url: '', referral_code: '', affiliate: '' }])} style={addBtnStyle}>
          + Add vendor
        </button>
      </Section>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #efefef' }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#333', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: '#555' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const saveBtnStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  padding: '0.4rem 1.25rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const cancelBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid #ccc',
  padding: '0.4rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const removeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#dc2626',
  cursor: 'pointer',
  fontSize: '0.9rem',
  padding: '0.25rem 0.4rem',
  flexShrink: 0,
};

const addBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px dashed #ccc',
  padding: '0.3rem 0.75rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: '#555',
};
