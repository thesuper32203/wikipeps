import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ maxWidth: '360px', margin: '4rem auto' }}>
      <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Admin Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {error && <p style={{ color: 'red', margin: 0, fontSize: '0.875rem' }}>{error}</p>}
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
  fontFamily: 'inherit',
};

const btnStyle: React.CSSProperties = {
  padding: '0.6rem',
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
};
