FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
RUN apk add --update python3 make g++ openssl && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

ARG DATABASE_URL
ARG NEXT_PUBLIC_THEME
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_POSTS_PAGE_SIZE

CMD ["node", "server.js"]