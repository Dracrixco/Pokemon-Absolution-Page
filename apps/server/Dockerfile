# Build from the monorepo root: docker build -f apps/server/Dockerfile .
FROM node:24-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/server/package.json apps/server/package.json
COPY apps/asset-generator/package.json apps/asset-generator/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --prod --frozen-lockfile
COPY packages/shared-types packages/shared-types
COPY apps/server apps/server
RUN mkdir /data && chown node:node /data
ENV PORT=4000 DATA_DIR=/data
VOLUME ["/data"]
USER node
EXPOSE 4000
CMD ["node", "apps/server/index.js"]
