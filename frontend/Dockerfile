# --- Stage 1: Build the app ---
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Remove custom .npmrc to use public npm registry for build
RUN rm -f .npmrc
RUN npm run build

# --- Stage 2: Serve the app ---
FROM node:18-alpine

WORKDIR /app

# Copy built app from the 'builder' stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js runs on
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]