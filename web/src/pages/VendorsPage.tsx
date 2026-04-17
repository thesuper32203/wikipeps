import { useEffect, useState } from 'react';
import supabase from '../supabaseClient.ts';

interface VendorEntry {
  vendor_name: string;
  url: string | null;
  referral_code: string | null;
  affiliate: string | null;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('vendor_links')
      .select('vendor_name, url, referral_code, affiliate')
      .not('vendor_name', 'is', null)
      .then(({ data }) => {
        if (!data) return;
        // Deduplicate by vendor_name
        const seen = new Set<string>();
        const unique: VendorEntry[] = [];
        for (const row of data) {
          if (row.vendor_name && !seen.has(row.vendor_name)) {
            seen.add(row.vendor_name);
            unique.push(row as VendorEntry);
          }
        }
        setVendors(unique);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid #e4e4de',
        marginBottom: '3rem',
        paddingBottom: '1.5rem',
      }}>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          color: '#4a7a5a',
          textTransform: 'uppercase',
          margin: '0 0 0.6rem',
        }}>
          Trusted Partners
        </p>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 400,
          color: '#111110',
          margin: '0 0 0.75rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          Vendors
        </h1>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.9rem',
          color: '#6b7266',
          margin: 0,
          maxWidth: '480px',
          lineHeight: 1.65,
        }}>
          Suppliers and partners we've vetted for quality and reliability.
        </p>
      </div>

      {/* ── Vendor Grid ──────────────────────────────────────────────── */}
      {loading ? (
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#6b7266' }}>
          Loading partners…
        </p>
      ) : vendors.length === 0 ? (
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#6b7266' }}>
          No partners listed yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {vendors.map((v) => (
            <div key={v.vendor_name} style={{
              padding: '1.25rem 1.5rem',
              border: '1px solid #e4e4de',
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <strong style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.95rem',
                color: '#111110',
                minWidth: '140px',
              }}>
                {v.vendor_name}
              </strong>

              {v.affiliate && (
                <span style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  color: '#4a7a5a',
                  background: '#edf4ee',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '20px',
                  letterSpacing: '0.04em',
                }}>
                  {v.affiliate}
                </span>
              )}

              {v.referral_code && (
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#6b7266' }}>
                  Code: <code style={{
                    background: '#edf4ee',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    color: '#2d5438',
                  }}>{v.referral_code}</code>
                </span>
              )}

              {v.url && (
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.85rem',
                    color: '#4a7a5a',
                    textDecoration: 'none',
                    marginLeft: 'auto',
                    padding: '0.4rem 0.9rem',
                    border: '1px solid #b5d4bc',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Visit store →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
