FROM node:16-alpine AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install                                                                                                                                                                                                                                                                       
COPY . .                                                                                                                                                                                                                                                                                                                
RUN npm run build                                                                                                                                                                                                                                                                                                       
FROM node:16-alpine
WORKDIR /app                                                                                                                                                
# Only copy built assets
COPY --from=builder /app/build ./build

# Install serve globally to serve static files
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]