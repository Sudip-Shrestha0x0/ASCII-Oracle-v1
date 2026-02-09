<div align="center">
  <img src="/frontend/public/favicon.svg" alt="Project Logo" height="100" width="100" />
  <h1>ASCII Oracle</h1>
  <p>Interactive terminal application combining ASCII art, image processing, 3D visualizations, and computational tools.</p>

  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat&logo=tailwindcss)
  ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat&logo=vite)
  
  <p><a href="https://inspiring-haupia-ded8c2.netlify.app/">Live Demo</a></p>
</div>

---

## Overview

`ASCII Oracle` is a retro terminal interface that brings the command line to life. Type commands to generate ASCII art, visualize 3D holograms, solve math/physics problems, and process media files. It combines CRT-inspired UI with modern web technologies like WebGL, Three.js, and server-side media processing.

Core capabilities:

- ASCII Art Engine — 20+ designs with animation support
- Media Processing — Image/video to ASCII conversion using Sharp and FFmpeg
- 3D Visualizations — WebGL-powered holograms via Three.js
- Computational Tools — Math solver (calculus, equations), physics/chemistry calculators
- AI Integration — Optional Gemini API for intelligent search

---

## Key Features

- **ASCII Art Engine**: Multiple art styles, animations, and quick rendering commands
- **Media Processing**: Convert images/videos to ASCII (backend uses Sharp & FFmpeg)
- **3D Holograms**: Real-time 3D text and shapes using Three.js
- **Computational Tools**: Symbolic math and numerical solvers powered by optional Python services
- **AI Enhancements**: Optional Google Gemini integration for search and creative prompts
- **Retro UI**: CRT scanlines, typewriter sounds, and keyboard-driven terminal UX
- **File Upload & History**: Drag-and-drop media upload plus persistent command history

## UI Preview

<table align="center">
  <tr>
    <td align="center" width="50%">
      <p><b>Terminal Interface</b></p>
      <img src="./screenshots/terminal.png" alt="Terminal Interface" />
    </td>
    <td align="center" width="50%">
      <p><b>3D Hologram</b></p>
      <img src="./screenshots/hologram.png" alt="3D Hologram" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <p><b>Image to ASCII Conversion</b></p>
      <img src="./screenshots/image-conversion.png" alt="Image to ASCII" width="80%" />
    </td>
  </tr>
</table>

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI and terminal integration with xterm.js |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| Three.js | 3D hologram rendering |
| Vite | Fast dev server and build |

### Backend & Tools
| Technology | Purpose |
|------------|---------|
| Node.js + Express | API and media processing endpoints |
| Sharp | Image manipulation |
| FFmpeg | Video processing |
| Python (optional) | Math solver (SymPy) |

### Hosting & Build
| Tool | Purpose |
|------|---------|
| Netlify | Frontend hosting (live demo) |
| Vite | Build tool |

---

## Architecture

```
ascii-oracle/
├── frontend/           # React app with terminal, hologram viewer, and UI
│   ├── src/components/ # Terminal, HologramViewer, StatusBar, etc.
│   └── src/utils/      # Command parser, asciiArt helpers
└── backend/            # Express server for media processing and AI bridging
    ├── routes/         # math, image, video, ascii endpoints
    └── services/       # Sharp/FFmpeg wrappers, Gemini bridge, Python math runner
```

---

## Technical Highlights

- Automatic image/video → ASCII pipeline using Sharp + FFmpeg
- WebGL/Three.js holograms with lightweight animation controls
- Command-driven UX built around a robust parser and history navigation
- Optional AI bridge via environment-configured GEMINI API key

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn)
- Optional: Python 3.x for advanced math solver features

### Installation

```bash
# Clone the repository
git clone https://github.com/Sudip-Shrestha0x0/ASCII-Oracle-v1.git
cd ASCII-Oracle-Version-1

# Install all dependencies (frontend + backend helper script)
npm run install:all
```

### Environment Variables

Add backend keys to `backend/.env` when using AI features:

```env
GEMINI_API_KEY=your_key_here
```

### Development

```bash
# Run dev servers (frontend + backend)
npm run dev

# If using Python math solver, install:
pip install sympy numpy scipy
```

Visit `http://localhost:5173` to open the frontend.

---

## Deployment

1. Build: `npm run build`
2. Deploy the `dist` output from the frontend to Netlify, Vercel, or similar
3. Configure environment variables for backend services if you host the API

> Note: The live demo currently hosts only the frontend on Netlify. Full image/video to ASCII conversion requires running the backend (Node.js + Sharp + FFmpeg).

---

## Performance & Security

- Code splitting and lazy loading for faster initial load
- Server-side media processing keeps heavy work off the client
- Sanitize user input in routes and validate uploads

---

## Finetunable Features

- [ ] Real-time streaming responses
- [ ] Voice input/output support
- [ ] Conversation or output export (PDF/Markdown)
- [ ] Custom model selection for AI bridge

---

## License

MIT

---

<div align="center">
  <p>Built by Light</p>
</div>
