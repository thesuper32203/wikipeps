import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../../supabaseClient.ts';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin', { replace: true });
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      {/* Brand */}
      <Link
        to="/"
        style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.75rem', color: '#e6edf3', textDecoration: 'none', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}
      >
        WikiPeps
      </Link>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#4b5563', marginBottom: '2.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Admin Portal
      </p>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#111318',
        border: '1px solid #21262d',
        borderRadius: '14px',
        padding: '2rem',
      }}>
        <h1 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1rem', fontWeight: 600, color: '#e6edf3', margin: '0 0 1.5rem' }}>
          Sign in
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#2dd4bf'; e.target.style.boxShadow = '0 0 0 3px rgba(45,212,191,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#30363d'; e.target.style.boxShadow = 'none'; }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#2dd4bf'; e.target.style.boxShadow = '0 0 0 3px rgba(45,212,191,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#30363d'; e.target.style.boxShadow = 'none'; }}
          />

          {error && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#f87171', margin: 0, fontSize: '0.825rem', background: '#1c1010', border: '1px solid #3f1515', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.25rem',
              padding: '0.65rem',
              background: loading ? '#1a3a38' : '#0d3d38',
              color: loading ? '#4b5563' : '#2dd4bf',
              border: '1px solid #1d5a54',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: '8px',
  color: '#e6edf3',
  fontSize: '0.9rem',
  fontFamily: '"DM Sans", sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
