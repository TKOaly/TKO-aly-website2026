# Development Dockerfile for TKO-aly Website
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Expose Next.js development port
EXPOSE 3385

# Set environment to development
ENV NODE_ENV=development

# Start development server
CMD ["npm", "run", "dev"]
