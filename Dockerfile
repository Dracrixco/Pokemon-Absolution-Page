
FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/server/package.json apps/server/package.json
COPY apps/asset-generator/package.json apps/asset-generator/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN pnpm --filter @absolution/web build

FROM node:24-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/apps/web/dist ./dist

USER node

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
