# Stage 1: Build the React App
# We use a Node image to run Webpack and bundle our code into static files
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the Webpack build script (creates the /dist folder)
RUN npm run build

# Stage 2: Serve the App using Node.js/Express
# We start a fresh image to keep the final container small
FROM node:18-alpine

WORKDIR /app

# Copy package.json to install only production dependencies (Express, Proxy)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the server.js file
COPY server.js ./

# Copy the built static files from Stage 1
COPY --from=build /app/dist ./dist

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
