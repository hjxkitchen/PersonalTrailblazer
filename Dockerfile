# Production stage - expects dist folder to be built locally
FROM nginx:alpine

# Copy built files (built locally before Docker build)
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

