import { NextRequest, NextResponse } from 'next/server';

const SUBJECT_TO_ENV: Record<string, string> = {
	agr: 'SUBJECT_PASSWORD_AGR',
	bk: 'SUBJECT_PASSWORD_BK',
	bio: 'SUBJECT_PASSWORD_BIO',
	chem: 'SUBJECT_PASSWORD_CHEM',
	chich: 'SUBJECT_PASSWORD_CHICH',
	comp: 'SUBJECT_PASSWORD_COMP',
	eng: 'SUBJECT_PASSWORD_ENG',
	geo: 'SUBJECT_PASSWORD_GEO',
	hist: 'SUBJECT_PASSWORD_HIST',
	phy: 'SUBJECT_PASSWORD_PHY',
	math: 'SUBJECT_PASSWORD_MATH',
	sos: 'SUBJECT_PASSWORD_SOS',
};

export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const subject = (searchParams.get('subject') || '').toLowerCase();
	if (!(subject in SUBJECT_TO_ENV)) {
		return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
	}
	let body: any;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}
	const provided = (body?.password || '').toString();
	const expected = process.env[SUBJECT_TO_ENV[subject]] || '';
	if (expected.length === 0) {
		return NextResponse.json({ error: 'Password not configured' }, { status: 500 });
	}
	if (provided !== expected) {
		return NextResponse.json({ ok: false }, { status: 401 });
	}
	return NextResponse.json({ ok: true });
}

