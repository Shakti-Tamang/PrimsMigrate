# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package manager lock file and install dependencies
COPY pnpm-lock.yaml ./
COPY .env.example ./.env
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Production image
FROM node:20-alpine AS production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy built application and dependencies from previous stages
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
