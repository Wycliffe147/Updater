Updater: subject marks editor with simple password gate and API for Excel VBA.

## Getting Started

Create `.env.local` with subject passwords and Vercel Blob token:

```bash
BLOB_READ_WRITE_TOKEN=YOUR_BLOB_RW_TOKEN
SUBJECT_PASSWORD_AGR=pass
SUBJECT_PASSWORD_BK=pass
SUBJECT_PASSWORD_BIO=pass
SUBJECT_PASSWORD_CHEM=pass
SUBJECT_PASSWORD_CHICH=pass
SUBJECT_PASSWORD_COMP=pass
SUBJECT_PASSWORD_ENG=pass
SUBJECT_PASSWORD_GEO=pass
SUBJECT_PASSWORD_HIST=pass
SUBJECT_PASSWORD_PHY=pass
SUBJECT_PASSWORD_MATH=pass
SUBJECT_PASSWORD_SOS=pass
```

Run development server:

```bash
npm run dev
```

Subjects: Agr, Bk, Bio, Chem, Chich, Comp, Eng, Geo, Hist, Phy, Math, Sos.

- UI: `/{subjectCode}` (codes are lowercase, e.g., `/agr`, `/math`)
- Save marks: POST `/api/marks?subject=agr` with JSON `{ "marks": [10, 23, ...] }`
- Get marks JSON: GET `/api/marks?subject=agr`
- Get marks text (newline-separated): GET `/api/marks?subject=agr&format=txt`
- Password check: POST `/api/auth?subject=agr` with `{ "password": "..." }`

Deploy on Vercel, add the same env vars in the Vercel project settings. Ensure Blob storage is enabled.