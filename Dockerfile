# Use official Node.js image for building the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production (if you need production build)
RUN npm run build

# Expose the port that React will use (default is 3000 for development)
EXPOSE 5173

# Start the React app (development mode)
CMD ["npm", "start"]
