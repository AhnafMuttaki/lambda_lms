FROM node:23


WORKDIR /app


# Copy package.json and package-lock.json (if available)
COPY package*.json ./


# Remove node_modules if it exists, then install dependencies
RUN rm -rf node_modules && \
    npm install && \
    npm rebuild


# Copy the rest of the application code
COPY . .

# Expose the port Vite uses (default 8080, as per vite.config.ts)
EXPOSE 8080

# Command to run the Vite development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]