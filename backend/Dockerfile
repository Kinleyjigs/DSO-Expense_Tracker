# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/expense_tracker_ci
ENV DATABASE_URL=$DATABASE_URL

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client before TypeScript compilation so generated types are available.
RUN pnpm exec prisma generate

# Build TypeScript
RUN pnpm run build


# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/expense_tracker_ci
ENV DATABASE_URL=$DATABASE_URL

# Install pnpm
RUN npm install -g pnpm

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install dependencies for runtime and Prisma generation
RUN pnpm install --frozen-lockfile

# Copy Prisma schema before generating the client in this image
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client in the runtime image as well
RUN pnpm exec prisma generate

# Copy built application and Prisma files
COPY --from=builder /app/dist ./dist

# Copy .env.example as fallback (actual .env should be provided at runtime)
COPY .env.example .env.example

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "dist/server.js"]
