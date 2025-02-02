FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Set environment variables
ENV NODE_ENV=production \
    PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "dist/src/main.js"] 