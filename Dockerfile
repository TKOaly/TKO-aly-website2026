# base: shared
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# dev: dev image
FROM base AS dev
RUN npm ci
COPY . .
ENV NODE_ENV=development
EXPOSE 3385
CMD ["npm", "run", "dev"]

# builder: compiles the Next.js app 
FROM base AS builder
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# prod: small runtime image
FROM node:24-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
