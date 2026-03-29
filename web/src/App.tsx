import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import HomePage from './pages/HomePage.tsx';
import PeptidePage from './pages/PeptidePage.tsx';
import LoginPage from './pages/admin/LoginPage.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import PeptideListPage from './pages/admin/PeptideListPage.tsx';
import PeptideFormPage from './pages/admin/PeptideFormPage.tsx';

function PublicLayout() {
  return (
    <>
      <header style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '1.5rem', paddingBottom: '0.75rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>WikiPeps</h1>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/peptides/:slug" element={<PeptidePage />} />
          <Route path="*" element={<p>Page not found.</p>} />
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
