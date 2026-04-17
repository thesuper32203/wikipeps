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
    <div style={{ minHeight: '100vh', background: '#fafaf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      {/* Brand */}
      <Link
        to="/"
        style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.75rem', color: '#111110', textDecoration: 'none', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}
      >
        WikiPeps
      </Link>
      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#9ca39a', marginBottom: '2.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Admin Portal
      </p>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: '#ffffff',
        border: '1px solid #e4e4de',
        borderRadius: '14px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <h1 style={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', fontWeight: 600, color: '#111110', margin: '0 0 1.5rem' }}>
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
            onFocus={(e) => { e.target.style.borderColor = '#4a7a5a'; e.target.style.boxShadow = '0 0 0 3px rgba(74,122,90,0.15)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d0d0c8'; e.target.style.boxShadow = 'none'; }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#4a7a5a'; e.target.style.boxShadow = '0 0 0 3px rgba(74,122,90,0.15)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d0d0c8'; e.target.style.boxShadow = 'none'; }}
          />

          {error && (
            <p style={{ fontFamily: '"Inter", sans-serif', color: '#dc4a3d', margin: 0, fontSize: '0.825rem', background: '#fef2f1', border: '1px solid rgba(220,74,61,0.2)', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.25rem',
              padding: '0.65rem',
              background: loading ? '#edf4ee' : '#4a7a5a',
              color: loading ? '#9ca39a' : '#ffffff',
              border: '1px solid transparent',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: '"Inter", sans-serif',
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
  background: '#fafaf8',
  border: '1px solid #d0d0c8',
  borderRadius: '8px',
  color: '#111110',
  fontSize: '0.9rem',
  fontFamily: '"Inter", sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
