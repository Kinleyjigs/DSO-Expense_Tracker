# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application
RUN pnpm run build


# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install production dependencies with npm to avoid pnpm symlink issues in the runtime image
RUN npm install --omit=dev

# Copy built application
COPY --from=builder /app/.next ./.next

# Copy environment file (actual .env should be provided at runtime)
COPY .env.example .env.local

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "run", "start"]
