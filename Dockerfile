# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Spin up the live Express API production server
FROM node:20-alpine
WORKDIR /app

# 1. Copy package files from the nested server/ directory
COPY server/server/package*.json ./server/

# 2. Install server dependencies
WORKDIR /app/server
RUN npm install --production

# 3. Move back to root and copy server source
WORKDIR /app
COPY server/server.js ./server/

# 4. Pull down the compiled static React build from Stage 1
COPY --from=frontend-build /app/dist ./dist

EXPOSE 80
ENV PORT=80

CMD ["node", "server/server.js"]