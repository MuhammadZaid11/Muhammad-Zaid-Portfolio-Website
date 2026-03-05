# ==========================================
# Dockerfile — Node.js Portfolio App
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy application source
COPY server/ ./server/
COPY public/ ./public/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the server
CMD ["node", "server/server.js"]