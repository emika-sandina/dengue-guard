# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the port your backend will run on
EXPOSE 5000

# Command to run your backend
CMD ["node", "src/server.js"]