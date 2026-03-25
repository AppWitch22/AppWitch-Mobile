# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AppWitch-Mobile** is a single-page mobile web application for medical device inspection workflows used by Italian health authorities (ASL). It handles device lookup, inspection form filling, and report export for electrical safety (VSE), preventive maintenance (MP), visual checks (VSP), and quality control (CQ).

## Running the App

No build step required. Open `index.html` directly in a browser. All dependencies load via CDN:
- Supabase JS SDK v2 (auth + database)
- XLSX v0.18.5 (lazy-loaded on export)

## Architecture

### Single-file SPA
All application logic lives in `index.html` (~2300 lines). `presets.js` contains a compressed base64/gzip-encoded device preset database loaded at startup.

### Backend: Supabase
Supabase credentials are hardcoded at the top of `index.html`. Key tables:
- `profiles` — user roles (`verificatore`, `responsabile`, `admin`), ASL assignment, banned flag
- `dispositivi_asl_benevento` / `dispositivi_asl_avellino` — device catalogs
- `sessioni` — inspection sessions
- `sessione_schede` — per-device inspection records
- `preset_vse_*`, `preset_mp_*`, `preset_vsp_*`, `preset_cq_*` — form presets per device type

### State
All state is global:
- `DB` — device catalog (keyed by codice)
- `cur` — currently selected device
- `curVerif` — `{vsp, cq}` type strings for the current device (from `VERIF_MAP`)
- `saved` — map of all filled device records in current session
- `currentUser` / `currentSessionId` — active user and session
- `vspState` / `cqState` — form field values for VSP/CQ tabs

### Initialization flow
`checkSession()` → `doLogin()` → `onLogin()` → `initDB()` (load devices) → `loadPresets()` (load templates)

### Inspection form tabs
The form area has four tabs built dynamically:
- **VSE**: Electrical safety, ~60 fields including numeric measurements
- **MP**: 19 preventive maintenance checkpoints
- **VSP**: Visual inspection — type depends on device (`VSP_CEN`, `VSP_ECG`, `VSP_DEF`, `VSP_ELB`)
- **CQ**: Quality control — type depends on device (`CQ_ECG`, `CQ_DEF`, etc.)

Device-to-form-type mapping is in `VERIF_MAP`. VSP/CQ structures are defined in `VSP_POINTS`, `CQ_VIS`, `CQ_PROVA`, and `VSP_EXTRA`.

### Data sync
Auto-sync triggers 3 seconds after the last change (`dirty` flag). `syncScheda()` upserts the current record; `syncSessionNow()` updates session-level data. A status indicator shows offline/pending/synced state.

### Export
- `exportJSON()` — full session dump as JSON
- `exportXLSX()` — multi-sheet Excel file matching official template structure (sheets: `Inserimento_VSE`, `Inserimento_MP`, `Inserimento_VSP_*`, `Inserimento_CQ_*`)

## Key Conventions

- UI language is Italian throughout (labels, toasts, form fields)
- Role-based access: `verificatore` → own sessions only; `responsabile` → all sessions in their ASL; `admin` → user management + all ASLs
- Mobile-first, touch-friendly layout with CSS variables for light/dark theming
- No framework — DOM manipulation is direct vanilla JS
