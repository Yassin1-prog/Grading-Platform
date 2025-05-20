# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies with cache and bind mounts for deterministic builds
COPY --link package.json package.json
COPY --link package-lock.json package-lock.json
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --production

# Copy application source code (excluding node_modules, .env, .git, etc. via .dockerignore)
COPY --link src/ src/
COPY --link README.md README.md

# Create a non-root user to run the app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 8086

CMD ["node", "--watch", "src/app.js"]
