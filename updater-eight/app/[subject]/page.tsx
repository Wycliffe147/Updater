'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const ALLOWED = ['agr','bk','bio','chem','chich','comp','eng','geo','hist','phy','math','sos'] as const;

export default function SubjectPage() {
	const params = useParams<{ subject: string }>();
	const router = useRouter();
	const subject = (params?.subject || '').toString().toLowerCase();
	const valid = useMemo(() => ALLOWED.includes(subject as any), [subject]);

	const [password, setPassword] = useState('');
	const [authed, setAuthed] = useState(false);
	const [marksText, setMarksText] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	useEffect(() => {
		setError(null);
	}, [password]);

	useEffect(() => {
		if (!valid) return;
		// reset state when subject changes
		setAuthed(false);
		setMarksText('');
		setPassword('');
	}, [subject, valid]);

	async function handleAuth() {
		if (!valid) return;
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/auth?subject=${subject}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
			if (!res.ok) {
				setError('Incorrect password');
				setLoading(false);
				return;
			}
			setAuthed(true);
			// load existing marks as text
			const t = await fetch(`/api/marks?subject=${subject}&format=txt`, { cache: 'no-store' }).then(r => r.text());
			setMarksText(t);
		} catch (e) {
			setError('An error occurred');
		} finally {
			setLoading(false);
		}
	}

	async function handleSave() {
		setLoading(true);
		setError(null);
		try {
			const lines = marksText
				.split(/\r?\n/)
				.map(v => v.trim())
				.filter(v => v.length > 0)
				.map(v => parseInt(v, 10))
				.filter(n => Number.isFinite(n));
			const res = await fetch(`/api/marks?subject=${subject}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ marks: lines }) });
			if (!res.ok) {
				setError('Failed to save');
				return;
			}
			alert('Saved');
		} catch (e) {
			setError('An error occurred');
		} finally {
			setLoading(false);
		}
	}

	if (!valid) {
		return (
			<div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, Arial, sans-serif' }}>
				<p>Unknown subject.</p>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, Arial, sans-serif' }}>
			<h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{subject.toUpperCase()} marks</h1>
			{!authed ? (
				<div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
					<label htmlFor="pw" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Password</label>
					<input id="pw" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6 }} />
					<button onClick={handleAuth} disabled={loading || password.length === 0} style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6, border: '1px solid #222', background: '#222', color: '#fff' }}>
						{loading ? 'Checking...' : 'Enter'}
					</button>
					{error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
				</div>
			) : (
				<div>
					<p style={{ marginBottom: 8 }}>Enter whole-number marks, one per line. No names.</p>
					<textarea value={marksText} onChange={e => setMarksText(e.target.value)} rows={20} style={{ width: '100%', fontFamily: 'ui-monospace, monospace', padding: 12, borderRadius: 8, border: '1px solid #ddd' }} />
					<div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
						<button onClick={handleSave} disabled={loading} style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #222', background: '#222', color: '#fff' }}>{loading ? 'Saving...' : 'Save'}</button>
						<button onClick={() => setMarksText('')} style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #ccc', background: '#fff' }}>Clear</button>
					</div>
					{error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
				</div>
			)}
		</div>
	);
}

