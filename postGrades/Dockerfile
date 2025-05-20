# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies with caching for node_modules
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy application source (excluding files via .dockerignore)
COPY --link . .

# Create a non-root user and set permissions
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"


EXPOSE 8082

# Start the service
CMD ["node", "--watch", "src/app.js"]
