const STORAGE_KEY = 'wikipeps_disclaimer_accepted';

export default function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(17,17,16,0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        maxWidth: '500px',
        width: '100%',
        padding: 'clamp(2rem, 5vw, 2.75rem)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        border: '1px solid #e4e4de',
      }}>
        {/* Icon */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: '#edf4ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          fontSize: '1.3rem',
        }}>
          ⚗
        </div>

        <h2 style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: '1.6rem',
          fontWeight: 400,
          color: '#111110',
          margin: '0 0 0.75rem',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Research Use Only
        </h2>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.875rem',
          color: '#6b7266',
          lineHeight: 1.7,
          margin: '0 0 1rem',
        }}>
          WikiPeps is an <strong style={{ color: '#111110', fontWeight: 500 }}>educational resource</strong> providing
          peer-reviewed summaries of peptide research. All compounds listed are
          research chemicals <strong style={{ color: '#111110', fontWeight: 500 }}>not approved for human consumption</strong>.
        </p>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.875rem',
          color: '#6b7266',
          lineHeight: 1.7,
          margin: '0 0 1.75rem',
        }}>
          Nothing on this site constitutes medical advice. By continuing, you confirm you are
          18 years or older and access this content for informational and research purposes only.
        </p>

        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, 'true');
            onAccept();
          }}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: '#4a7a5a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.925rem',
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.01em',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#3d6849'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#4a7a5a'; }}
        >
          I understand — continue to WikiPeps
        </button>

        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.7rem',
          color: '#c8c8c0',
          textAlign: 'center',
          margin: '1rem 0 0',
          lineHeight: 1.6,
        }}>
          This message is shown once. Leave this site if you do not agree.
        </p>
      </div>
    </div>
  );
}

export { STORAGE_KEY };
