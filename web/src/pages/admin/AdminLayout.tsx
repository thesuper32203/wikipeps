import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { isAdmin } from '@wikipeps/shared';
import { useAuth } from '../../context/AuthContext.tsx';
import supabase from '../../supabaseClient.ts';

export default function AdminLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/admin/login', { replace: true });
      return;
    }

    isAdmin(supabase).then((result) => {
      setAdminAccess(result);
      setAdminChecked(true);
    });
  }, [user, authLoading, navigate]);

  if (authLoading || !adminChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#4b5563', fontSize: '0.9rem' }}>Loading…</p>
      </div>
    );
  }

  if (!adminAccess) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#8b949e', margin: 0 }}>
          Access denied. Your account does not have admin privileges.
        </p>
        <button
          onClick={signOut}
          style={{ fontFamily: '"DM Sans", sans-serif', background: 'none', border: '1px solid #30363d', color: '#6b7280', padding: '0.35rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      {/* Nav */}
      <nav style={{
        background: '#111318',
        borderBottom: '1px solid #21262d',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '52px',
      }}>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          <Link
            to="/"
            style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.15rem', color: '#e6edf3', textDecoration: 'none', letterSpacing: '-0.01em' }}
          >
            WikiPeps
          </Link>
          <span style={{ color: '#21262d', fontSize: '1rem' }}>|</span>
          <Link
            to="/admin"
            style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.825rem', color: '#8b949e', textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/peptides/new"
            style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.825rem', color: '#2dd4bf', textDecoration: 'none' }}
          >
            + New Peptide
          </Link>
        </div>
        <button
          onClick={signOut}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            background: 'none',
            border: '1px solid #21262d',
            color: '#6b7280',
            padding: '0.25rem 0.8rem',
            cursor: 'pointer',
            borderRadius: '6px',
            fontSize: '0.775rem',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#21262d'; e.currentTarget.style.color = '#6b7280'; }}
        >
          Sign out
        </button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
