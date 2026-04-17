import { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext.tsx';
import { listPeptides } from '@wikipeps/shared';
import type { PeptideListItem } from '@wikipeps/shared';
import supabase from './supabaseClient.ts';
import HomePage from './pages/HomePage.tsx';
import PeptidePage from './pages/PeptidePage.tsx';
import VendorsPage from './pages/VendorsPage.tsx';
import LoginPage from './pages/admin/LoginPage.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import PeptideListPage from './pages/admin/PeptideListPage.tsx';
import PeptideFormPage from './pages/admin/PeptideFormPage.tsx';
import PartnershipsPage from './pages/admin/PartnershipsPage.tsx';
import PeptideFinderModal from './components/PeptideFinder/PeptideFinderModal.tsx';

const NAV_LINK: React.CSSProperties = {
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.825rem',
  color: '#6b7266',
  textDecoration: 'none',
  letterSpacing: '0.01em',
  transition: 'color 0.15s',
};

function PublicLayout() {
  const [showFinder, setShowFinder] = useState(false);
  const [peptides, setPeptides] = useState<PeptideListItem[]>([]);

  useEffect(() => {
    if (showFinder && peptides.length === 0) {
      listPeptides(supabase).then(setPeptides).catch(() => {});
    }
  }, [showFinder]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8' }}>
      {showFinder && (
        <PeptideFinderModal peptides={peptides} onClose={() => setShowFinder(false)} />
      )}
      <nav style={{
        borderBottom: '1px solid #e4e4de',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        height: '52px',
        background: '#ffffff',
      }}>
        <Link
          to="/"
          style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.2rem', color: '#111110', textDecoration: 'none', letterSpacing: '-0.01em', marginRight: 'auto' }}
        >
          WikiPeps
        </Link>
        <Link to="/" style={NAV_LINK}>Compounds</Link>
        <Link to="/vendors" style={NAV_LINK}>Vendors</Link>
        <button
          onClick={() => setShowFinder(true)}
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.825rem',
            color: '#ffffff',
            background: '#4a7a5a',
            border: 'none',
            borderRadius: '6px',
            padding: '0.3rem 0.75rem',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Find Your Peptide
        </button>
      </nav>
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Analytics />
      <Routes>
        {/* Homepage — full-width, no nav wrapper */}
        <Route path="/" element={<HomePage />} />

        {/* Detail + misc pages — dark nav wrapper */}
        <Route element={<PublicLayout />}>
          <Route path="/peptides/:slug" element={<PeptidePage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="*" element={<p style={{ fontFamily: '"DM Sans", sans-serif', color: '#8b949e' }}>Page not found.</p>} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PeptideListPage />} />
          <Route path="peptides/new" element={<PeptideFormPage />} />
          <Route path="peptides/:id/edit" element={<PeptideFormPage />} />
          <Route path="partnerships" element={<PartnershipsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
