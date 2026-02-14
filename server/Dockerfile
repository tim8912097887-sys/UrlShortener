FROM node:20-alpine AS base
# Pnpm setup
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Development stage
FROM base AS development
WORKDIR /app    
# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
# Use cache for pnpm store to speed up subsequent builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage
FROM development AS build
WORKDIR /app
# Copy source code and build the application
COPY . .    
RUN pnpm run build

# Production stage
FROM base AS production
WORKDIR /app
# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
# Use cache for pnpm store to speed up subsequent builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Finalize production image
# Enhance security by not include shell
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=production /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["dist/server.js"]