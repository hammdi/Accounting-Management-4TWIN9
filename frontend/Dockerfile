# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Set the HOST environment variable so that React listens on all interfaces
ENV HOST 0.0.0.0

# Copy the rest of the application files to the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
