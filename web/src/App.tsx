import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import PeptidePage from './pages/PeptidePage.tsx';

export default function App() {
  return (
    <>
      <header style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '1.5rem', paddingBottom: '0.75rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>WikiPeps</h1>
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/peptides/:slug" element={<PeptidePage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
