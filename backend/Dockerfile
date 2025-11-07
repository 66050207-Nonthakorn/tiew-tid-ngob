#--------------------------------
# Build Stage
#--------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack (built into Node.js)
RUN corepack enable

# Copy package files AND the lockfile
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema so 'pnpm install' can generate the client
COPY prisma ./prisma

# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application (e.g., compile TypeScript)
RUN pnpm prisma generate

# Build the application (e.g., compile TypeScript)
RUN pnpm build

#--------------------------------
# Production Stage
#--------------------------------
FROM node:22-alpine

WORKDIR /app

# Enable pnpm via corepack for the CMD
RUN corepack enable

# Copy only the necessary files from the builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Health check (this was good!)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application using the correct CMD form
CMD ["pnpm prisma:deploy && pnpm start"]