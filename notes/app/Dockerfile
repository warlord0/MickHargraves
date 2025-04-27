FROM node:20

# Create user and group with UID and GID 1000
# RUN groupadd -g 1000 docusaurus \
#  && useradd -u 1000 -g 1000 -m docusaurus

# Change ownership of the app directory
RUN mkdir /app && \
    chown -R node:node /app

# Switch to the new user
USER node

# Set work directory
WORKDIR /app/website

# COPY --chown=node:node . .

# Copy package files and scripts
# COPY package*.json ./

# Copy scripts
# COPY docusaurus-init.sh ./
# COPY fix-markdown-links.sh ./
# COPY setup.sh ./

# Make scripts executable
# RUN chmod +x *.sh

# Set work directory
# WORKDIR /app/website

# Install dependencies
# RUN npm install

# Expose port
EXPOSE 3000

# Do not specify CMD; docker-compose will define it
