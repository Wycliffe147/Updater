import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Updater</h1>
      <p style={{ marginBottom: 16 }}>Select a subject to edit marks (password required).</p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {[
          { code: 'agr', name: 'Agr' },
          { code: 'bk', name: 'Bk' },
          { code: 'bio', name: 'Bio' },
          { code: 'chem', name: 'Chem' },
          { code: 'chich', name: 'Chich' },
          { code: 'comp', name: 'Comp' },
          { code: 'eng', name: 'Eng' },
          { code: 'geo', name: 'Geo' },
          { code: 'hist', name: 'Hist' },
          { code: 'phy', name: 'Phy' },
          { code: 'math', name: 'Math' },
          { code: 'sos', name: 'Sos' },
        ].map(s => (
          <li key={s.code}>
            <Link href={`/${s.code}`} style={{ display: 'block', border: '1px solid #ddd', borderRadius: 8, padding: '12px 14px', textDecoration: 'none' }}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
