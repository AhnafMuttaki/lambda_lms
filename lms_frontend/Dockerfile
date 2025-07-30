FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./


# Install dependencies and Angular CLI globally
RUN npm install --legacy-peer-deps \
    && npm install -g @angular/cli@15.0.3

# Copy the rest of the application code
COPY . .

# Expose the port Angular uses (default 4200)
EXPOSE 4200

# Command to run the Angular development server with hot reload
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]