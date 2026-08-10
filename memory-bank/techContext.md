# Tech Context

## Stack
- Three.js (3D), Vite, TypeScript
- KaTeX for math
- Static JSON content packs under `content/`
- Target: modern mobile Safari (landscape) + desktop Chromium/Firefox

## Claude Code + Playwright
- Project MCP: `.mcp.json` → `npx @playwright/mcp@latest` (approved / Connected)
- Chromium browsers under `%LOCALAPPDATA%\ms-playwright` (reinstall: `npx playwright install chromium`)
- Local game URL for browser tests: `http://localhost:5173/` after `npm run dev`
- Prefer screenshots for WebGL canvas; see `CLAUDE.md`

## Aesthetic
- Low-poly / early-2000s (PS1–PS2 AAA)
- Vibrant grass/sky; light ruins; glowing math glyphs; green/white/blue HUD

## Non-goals this run
- Phaser, native consoles, multiplayer backend, voice
