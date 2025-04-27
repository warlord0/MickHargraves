FROM node:20

# Change ownership of the app directory
RUN mkdir /app && \
    chown -R node:node /app

# Switch to the new user
USER node

# Set work directory
WORKDIR /app/website

# Expose port
EXPOSE 3000

# Do not specify CMD; docker-compose will define it
