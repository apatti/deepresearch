# --- Stage 1: Build the app ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and .npmrc
COPY package*.json ./
COPY .npmrc* ./

# Install dependencies using npm ci for deterministic builds
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# --- Stage 2: Serve the app ---
FROM node:18-alpine

WORKDIR /app

# Copy package files and .npmrc
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.npmrc* ./

# Install only production dependencies
RUN npm ci --production --ignore-scripts

# Copy built app from the 'builder' stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]