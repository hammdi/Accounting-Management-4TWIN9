# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install `serve` to serve the build folder
RUN npm install -g serve

# Expose the port that serve will use
EXPOSE 3000

# Start the app with serve
CMD ["serve", "-s", "build", "-l", "3000"]

