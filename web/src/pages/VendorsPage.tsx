export default function VendorsPage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid #21262d',
        marginBottom: '3rem',
        paddingBottom: '1.5rem',
      }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          color: '#2dd4bf',
          textTransform: 'uppercase',
          margin: '0 0 0.6rem',
        }}>
          Trusted Partners
        </p>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 400,
          color: '#e6edf3',
          margin: '0 0 0.75rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          Vendors
        </h1>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.9rem',
          color: '#6b7280',
          margin: 0,
          maxWidth: '480px',
          lineHeight: 1.65,
        }}>
          Suppliers and partners we've vetted for quality and reliability.
        </p>
      </div>

      {/* ── Coming Soon ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        border: '1px dashed #21262d',
        borderRadius: '16px',
        background: '#0d1117',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: '#111318',
          border: '1px solid #21262d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1.25rem',
        }}>
          ◷
        </div>
        <h2 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '1.75rem',
          fontWeight: 400,
          color: '#e6edf3',
          margin: '0 0 0.6rem',
          letterSpacing: '-0.01em',
        }}>
          Coming Soon
        </h2>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.875rem',
          color: '#4b5563',
          margin: 0,
          maxWidth: '340px',
          lineHeight: 1.7,
        }}>
          We're finalizing our vendor partnerships. Check back soon for a curated list of trusted suppliers.
        </p>
      </div>
    </>
  );
}
