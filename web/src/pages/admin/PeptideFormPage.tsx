import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getPeptideById,
  createPeptide,
  updatePeptide,
  CATEGORIES,
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
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [aliases, setAliases] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
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
        setCategory(data.category ?? '');
        setIsPublished(data.is_published);
        setAliases([...data.peptide_aliases.map((a) => a.alias), '']);
        setTags([...data.peptide_tags.map((t) => t.tag), '']);
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
      category: category || null,
      is_published: isPublished,
    };

    const validAliases = aliases.map((a) => a.trim()).filter(Boolean);
    const validTags = tags.map((t) => t.trim().toLowerCase().replace(/\s+/g, '_')).filter(Boolean);

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
        await updatePeptide(supabase, id, peptideInput, validAliases, validLinks, validVendors, validTags);
      } else {
        await createPeptide(supabase, peptideInput, validAliases, validLinks, validVendors, validTags);
      }
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSaving(false);
    }
  }

  if (loading) return (
    <p style={{ fontFamily: '"Inter", sans-serif', color: '#9ca39a' }}>Loading…</p>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '760px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.5rem', fontWeight: 400, color: '#111110', margin: 0, letterSpacing: '-0.01em' }}>
          {isEdit ? 'Edit Peptide' : 'New Peptide'}
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: '"Inter", sans-serif', fontSize: '0.825rem', color: '#6b7266', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              style={{ accentColor: '#4a7a5a', width: '14px', height: '14px' }}
            />
            Published
          </label>
          <button type="button" onClick={() => navigate('/admin')} style={cancelBtnStyle}>
            Cancel
          </button>
          <button type="submit" disabled={saving} style={saveBtnStyle}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontFamily: '"Inter", sans-serif', color: '#dc4a3d', background: '#fef2f1', border: '1px solid rgba(220,74,61,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Basic info */}
      <Section title="Basic Info">
        <Field label="Name *">
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            style={inputStyle}
            placeholder="BPC-157"
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </Field>
        <Field label="Slug *">
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugLocked(true); }}
            required
            style={inputStyle}
            placeholder="bpc-157"
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
          <p style={{ margin: '0.25rem 0 0', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: '#9ca39a' }}>
            /peptides/<span style={{ color: '#6b7266' }}>{slug || '…'}</span>
          </p>
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">— None —</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.label} value={cat.label}>{cat.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Overview">
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Describe the peptide…"
            onFocus={focusStyle}
            onBlur={blurStyle}
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
              onFocus={focusStyle}
              onBlur={blurStyle}
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

      {/* Tags */}
      <Section title="Tags">
        <p style={{ margin: '0 0 0.75rem', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: '#9ca39a' }}>
          Lowercase, underscored (e.g. <code style={{ color: '#6b7266' }}>fat_loss</code>, <code style={{ color: '#6b7266' }}>healing</code>). Used for search and category filtering.
        </p>
        {tags.map((tag, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              value={tag}
              onChange={(e) => {
                const next = [...tags];
                next[i] = e.target.value;
                setTags(next);
              }}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="e.g. healing, fat_loss, muscle_growth"
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {tags.length > 1 && (
              <button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))} style={removeBtnStyle}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setTags([...tags, ''])} style={addBtnStyle}>
          + Add tag
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
                onFocus={focusStyle}
                onBlur={blurStyle}
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
                onFocus={focusStyle}
                onBlur={blurStyle}
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
          <div key={i} style={{ border: '1px solid #e4e4de', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', background: '#f4f4f0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setVendorLinks(vendorLinks.filter((_, j) => j !== i))}
                style={{ ...removeBtnStyle, fontSize: '0.75rem' }}
              >
                ✕ Remove
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Field label="Vendor name">
                <input value={v.vendor_name} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], vendor_name: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="Peptide Sciences" onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="URL">
                <input value={v.url} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], url: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="https://…" onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Referral code">
                <input value={v.referral_code} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], referral_code: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="SAVE10" onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Affiliate info">
                <input value={v.affiliate} onChange={(e) => { const next = [...vendorLinks]; next[i] = { ...next[i], affiliate: e.target.value }; setVendorLinks(next); }} style={inputStyle} placeholder="e.g. Commission Junction" onFocus={focusStyle} onBlur={blurStyle} />
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
    <section style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid #e4e4de' }}>
      <h3 style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.68rem',
        fontWeight: 600,
        color: '#9ca39a',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '0 0 1rem',
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{
        display: 'block',
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#6b7266',
        marginBottom: '0.3rem',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Shared focus/blur handlers for inputs
const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#4a7a5a';
  e.target.style.boxShadow = '0 0 0 3px rgba(74,122,90,0.15)';
};
const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = '#d0d0c8';
  e.target.style.boxShadow = 'none';
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.7rem',
  background: '#fafaf8',
  border: '1px solid #d0d0c8',
  borderRadius: '7px',
  color: '#111110',
  fontSize: '0.875rem',
  fontFamily: '"Inter", sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const saveBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: '#4a7a5a',
  color: '#ffffff',
  border: '1px solid transparent',
  padding: '0.4rem 1.25rem',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 500,
};

const cancelBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: 'none',
  border: '1px solid #e4e4de',
  color: '#6b7266',
  padding: '0.4rem 1rem',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const removeBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: 'none',
  border: 'none',
  color: '#c0a0a0',
  cursor: 'pointer',
  fontSize: '0.85rem',
  padding: '0.2rem 0.4rem',
  flexShrink: 0,
  transition: 'color 0.15s',
};

const addBtnStyle: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  background: 'none',
  border: '1px dashed #d0d0c8',
  color: '#9ca39a',
  padding: '0.35rem 0.8rem',
  borderRadius: '7px',
  cursor: 'pointer',
  fontSize: '0.775rem',
};
