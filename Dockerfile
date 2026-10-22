
FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

USER node

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
