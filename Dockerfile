FROM node:22-bookworm-slim

COPY --from=ghcr.io/denoland/celld:0.6.2 /usr/local/bin/celld /usr/local/bin/celld
RUN corepack enable && npm install -g esbuild

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm --filter frontend build

CMD ["celld", "deploy", "."]
