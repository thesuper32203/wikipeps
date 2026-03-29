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
    return <p style={{ padding: '2rem' }}>Loading…</p>;
  }

  if (!adminAccess) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Access denied. Your account does not have admin privileges.</p>
        <button onClick={signOut} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      <nav style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '48px',
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#999', textDecoration: 'none', fontSize: '0.8rem' }}>
            ← Public site
          </Link>
          <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Admin
          </Link>
          <Link to="/admin/peptides/new" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.875rem' }}>
            + New Peptide
          </Link>
        </div>
        <button
          onClick={signOut}
          style={{ background: 'none', border: '1px solid #555', color: '#ccc', padding: '0.2rem 0.75rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.8rem' }}
        >
          Sign out
        </button>
      </nav>
      <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
