import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import HomePage from './pages/HomePage.tsx';
import PeptidePage from './pages/PeptidePage.tsx';
import VendorsPage from './pages/VendorsPage.tsx';
import LoginPage from './pages/admin/LoginPage.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import PeptideListPage from './pages/admin/PeptideListPage.tsx';
import PeptideFormPage from './pages/admin/PeptideFormPage.tsx';

const NAV_LINK: React.CSSProperties = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '0.825rem',
  color: '#6b7280',
  textDecoration: 'none',
  letterSpacing: '0.01em',
  transition: 'color 0.15s',
};

function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <nav style={{
        borderBottom: '1px solid #21262d',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        height: '52px',
      }}>
        <Link
          to="/"
          style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.2rem', color: '#e6edf3', textDecoration: 'none', letterSpacing: '-0.01em', marginRight: 'auto' }}
        >
          WikiPeps
        </Link>
        <Link to="/" style={NAV_LINK}>Compounds</Link>
        <Link to="/vendors" style={NAV_LINK}>Vendors</Link>
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
        </Route>
      </Routes>
    </AuthProvider>
  );
}
