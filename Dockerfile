FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci 

# Copy pre-built dist folder (built locally)
COPY dist ./dist

# Expose port (CapRover will set PORT env var)
EXPOSE 80

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.js"]
