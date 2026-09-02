# Use Node.js 20 LTS (Alpine for smaller image)
FROM node:20-alpine

# Install SQLite dependencies for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Set DATABASE_URL for Prisma CLI during build
ENV DATABASE_URL="file:./backend/database/database.sqlite"

# Copy package files first (Docker cache layer optimization)
COPY package*.json ./

# Install all dependencies (need devDependencies for prisma generate)
RUN npm install

# Copy application code
COPY prisma ./prisma/
COPY backend ./backend/
COPY frontend ./frontend/

# Generate Prisma Client
RUN npx prisma generate

# Create necessary directories
RUN mkdir -p /app/backend/database /app/logs /app/backups /app/uploads

# Remove devDependencies after build
RUN npm prune --omit=dev 2>/dev/null || true

# Create startup script that handles migration + seed + start
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo 'echo "Running database migration..."' >> /app/entrypoint.sh && \
    echo 'npx prisma db push --accept-data-loss 2>/dev/null || echo "Migration skipped"' >> /app/entrypoint.sh && \
    echo 'echo "Running seed..."' >> /app/entrypoint.sh && \
    echo 'node prisma/seed.js' >> /app/entrypoint.sh && \
    echo 'echo "Starting application..."' >> /app/entrypoint.sh && \
    echo 'exec node backend/src/app.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3001

# Start with entrypoint
CMD ["/app/entrypoint.sh"]
