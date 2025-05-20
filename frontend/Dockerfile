# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# --- Build Stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies (npm ci for deterministic builds)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the app (excluding files in .dockerignore)
COPY --link . .

# Build the frontend (Vite outputs to dist/ by default)
RUN npm run build

# --- Production Stage ---
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user and group
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

# Copy built app and only production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 5173

#CMD ["npm", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]