# Stage 1: Build React static assets
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Spin up the live Express API production server
FROM node:20-alpine
WORKDIR /app

# Copy server code and install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/

# Pull down the compiled static React build from Stage 1
COPY --from=frontend-build /app/dist ./dist

EXPOSE 80
ENV PORT=80

CMD ["node", "server/server.js"]