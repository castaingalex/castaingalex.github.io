# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Alexandre CASTAING, deployed via GitHub Pages. It is a **single static HTML file** — no build system, no dependencies, no package manager.

The live site is at: `https://castaingalex.github.io`

## Development

**Edit directly:** All code lives in `index.html`. Open it in a browser to preview changes.

**No build step required.** Deploy by pushing to the `main` branch on GitHub — GitHub Pages serves the file automatically.

## Architecture

Everything is in `index.html`:

- **CSS** — embedded in a `<style>` block. Uses CSS custom properties for theming (colors: `--bg`, `--ink`, `--accent`, etc.). Layout uses flexbox and CSS Grid. Responsive breakpoints at 680px and 480px.
- **Fonts** — loaded from Google Fonts: `Bricolage Grotesque` (display) and `DM Mono` (monospace metadata/labels).
- **JavaScript** — ~16 lines at the bottom. A single `toggle()` function drives accordion expand/collapse on work items using `aria-expanded`.
- **Content language** — French.

**Page sections** (in order): header nav → hero → Travaux (work/projects) → Parcours (career timeline) → Contact → footer.
