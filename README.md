# Analog Workbench dashboard

Interactive Cadet VII DC examples and a dated evidence snapshot. Progress is not a live filesystem monitor. No user-edited completion marks are treated as verification.

Update app/status.json and public/evidence from a completed bench run when recording new work; keep stage descriptions in app/page.tsx aligned. Never mark hardware matching complete from circuit simulation alone.

`node tests/verify-port.mjs` checks the browser model against 470 independent nodal-reference results. `npm run build` builds the dashboard.

WebMCP configure_cadet_example is feature-detected and uses the same React controls. No supported browser WebMCP context was available for execution validation in this run; registration and behavior are not claimed verified.
