# IDP Learning Plan

An interactive "Agentic AI Platform" learning plan tracker built with React. The application presents a structured 24-week curriculum across three phases — Foundation, Application, and Production — with weekly tasks categorised as reading, courses, builds, and habits. Budget tracking and an MCP server stack overview are included as supplementary tabs.

The site is built with Vite.

## Local Development

### Run with Podman Compose (recommended)

```bash
# 1. Build and start
podman compose up -d --build

# 2. Open in browser
open http://localhost:8080
```

### Stop / remove

```bash
# Stop and remove containers
podman compose down

# Remove image
podman rmi idp-learning-plan
```

### Rebuild after changes

If you edit App.jsx and want to update the container:

```bash
podman compose down && podman rmi idp-learning-plan
podman compose up -d --build
```

### Alternative: run with Docker Compose

Same commands, just replace `podman` with `docker`.

### Alternative: run without a container (Node required)

```bash
npm install
npm run build
npm run preview
# Opens on http://localhost:4173
```

