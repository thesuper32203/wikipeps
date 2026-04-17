import { useEffect, useState } from 'react';
import supabase from '../supabaseClient.ts';

interface Partner {
  vendor_name: string;
  referral_link: string | null;
  partner_code: string | null;
}

export default function VendorsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('partnerships')
      .select('vendor_name, referral_link, partner_code')
      .eq('is_active', true)
      .order('vendor_name', { ascending: true })
      .then(({ data }) => {
        setPartners((data as Partner[]) ?? []);
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

      {/* ── Partner List ─────────────────────────────────────────────── */}
      {loading ? (
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#6b7266' }}>
          Loading partners…
        </p>
      ) : partners.length === 0 ? (
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#6b7266' }}>
          No partners listed yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {partners.map((p) => (
            <a
              key={p.vendor_name}
              href={p.referral_link ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e4e4de',
                borderRadius: '12px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#b5d4bc';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 8px rgba(74,122,90,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e4e4de';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
              }}
            >
              <strong style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.95rem',
                color: '#111110',
                flex: 1,
              }}>
                {p.vendor_name}
              </strong>

              <span style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                color: '#4a7a5a',
                padding: '0.4rem 0.9rem',
                border: '1px solid #b5d4bc',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
              }}>
                Shop Now →
              </span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
