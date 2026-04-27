# IDP Learning Plan — Local Container

## Run with Podman (recommended)

```bash
# 1. Build the image
podman build -t idp-learning-plan .

# 2. Run it
podman run -d --name idp-plan -p 8080:80 idp-learning-plan

# 3. Open in browser
open http://localhost:8080
# or just navigate to http://localhost:8080
```

## Stop / restart

```bash
# Stop
podman stop idp-plan

# Start again (no rebuild needed)
podman start idp-plan

# Remove container entirely
podman rm -f idp-plan

# Remove image
podman rmi idp-learning-plan
```

## Rebuild after changes

If you edit App.jsx and want to update the container:

```bash
podman rm -f idp-plan
podman rmi idp-learning-plan
podman build -t idp-learning-plan .
podman run -d --name idp-plan -p 8080:80 idp-learning-plan
```

## Alternative: run with Docker

Same commands, just replace `podman` with `docker`.

## Alternative: run without a container (Node required)

```bash
npm install
npm run build
npm run preview
# Opens on http://localhost:4173
```
