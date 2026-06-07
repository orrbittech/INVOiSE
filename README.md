# INVOiSE

A simple invoice generator built with Next.js, TypeScript, Tailwind CSS, and Zustand. Create invoices in the browser, pick a template, customize colors and currency, and download a PDF. All data is stored in `localStorage` and survives page refreshes until you reset the draft.

## Features

- Invoice editor with logo, company details, Bill To / Ship To, line items, tax, discount, shipping, notes, and terms
- Three PDF templates: Classic, Professional, Corporate
- Currency selector (ZAR, USD, EUR, and more)
- Accent and page color customization
- PDF export (html2canvas + jsPDF)
- Client-side persistence via Zustand `persist`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand (with persist middleware)
- html2canvas + jsPDF for PDF export
