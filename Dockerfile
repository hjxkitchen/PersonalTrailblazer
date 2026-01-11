# Production stage - expects dist folder to be built locally
FROM nginx:alpine

# Copy built files (built locally before Docker build)
COPY dist /usr/share/nginx/html


# Expose port 80
EXPOSE 5000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

