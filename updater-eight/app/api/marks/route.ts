import { NextRequest, NextResponse } from 'next/server';
import { put, getDownloadUrl } from '@vercel/blob';

// Allowed subjects mapping (normalized lowercase keys)
const SUBJECTS = [
	'agr','bk','bio','chem','chich','comp','eng','geo','hist','phy','math','sos'
];

function normalizeSubject(subject: string | null): string | null {
	if (!subject) return null;
	const s = subject.toLowerCase();
	return SUBJECTS.includes(s) ? s : null;
}

function keyFor(subject: string) {
	return `marks/${subject}.txt`;
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const subject = normalizeSubject(searchParams.get('subject'));
	if (!subject) {
		return NextResponse.json({ error: 'Invalid or missing subject' }, { status: 400 });
	}

	try {
		let url: string | null = null;
		try {
			url = await getDownloadUrl(keyFor(subject));
		} catch {
			url = null;
		}
		if (!url) {
			if (searchParams.get('format') === 'txt') {
				return new NextResponse('', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
			}
			return NextResponse.json({ subject, marks: [] }, { headers: { 'Cache-Control': 'no-store' } });
		}
		const res = await fetch(url, { cache: 'no-store' });
		const text = await res.text();
		const lines = text
			.split(/\r?\n/)
			.map(v => v.trim())
			.filter(v => v.length > 0)
			.map(v => parseInt(v, 10))
			.filter(n => Number.isFinite(n));

		if (searchParams.get('format') === 'txt') {
			return new NextResponse(lines.join('\n'), { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
		}

		return NextResponse.json({ subject, marks: lines }, { headers: { 'Cache-Control': 'no-store' } });
	} catch (err: any) {
		if (searchParams.get('format') === 'txt') {
			return new NextResponse('', { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
		}
		return NextResponse.json({ subject, marks: [] }, { headers: { 'Cache-Control': 'no-store' } });
	}
}

export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const subject = normalizeSubject(searchParams.get('subject'));
	if (!subject) {
		return NextResponse.json({ error: 'Invalid or missing subject' }, { status: 400 });
	}

	let body: any;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const marksInput: unknown = body?.marks;
	if (!Array.isArray(marksInput)) {
		return NextResponse.json({ error: 'marks must be an array' }, { status: 400 });
	}

	// Sanitize to whole numbers per line
	const cleaned = (marksInput as unknown[])
		.map(v => {
			const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? Math.floor(v) : NaN;
			return Number.isFinite(n) ? n : null;
		})
		.filter((v): v is number => v !== null);

	const text = cleaned.join('\n');

	await put(keyFor(subject), text, {
		access: 'public',
		addRandomSuffix: false,
		contentType: 'text/plain; charset=utf-8'
	});

	return NextResponse.json({ subject, count: cleaned.length }, { headers: { 'Cache-Control': 'no-store' } });
}