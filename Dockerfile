# Use Node.js 20 LTS
FROM node:20-alpine

# Install SQLite build dependencies
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Environment for build phase
ENV DATABASE_URL="file:./backend/database/database.sqlite"

# Copy dependencies manifest
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY prisma ./prisma/
COPY prisma.config.js ./
COPY backend ./backend/
COPY frontend ./frontend/

# Create database directory & run schema migration + seed during BUILD time
RUN mkdir -p /app/backend/database /app/logs /app/backups /app/uploads && \
    npx prisma generate && \
    npx prisma db push --config=prisma.config.js --accept-data-loss && \
    node prisma/seed.js

# Remove dev dependencies to keep image small
RUN npm prune --omit=dev 2>/dev/null || true

# Expose server port
EXPOSE 3001

# Directly start Node server at runtime (no entrypoint script needed)
CMD ["node", "backend/src/app.js"]
