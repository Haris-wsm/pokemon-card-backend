# Use the official Node.js 16 image with Alpine Linux
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application's dependencies
RUN npm ci --only=production

# Copy the rest of the application's files to the container
COPY . .

# Expose the port that the application listens on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
