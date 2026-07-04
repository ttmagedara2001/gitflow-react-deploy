# Stage 2: Spin up the live Express API production server
FROM node:20-alpine
WORKDIR /app

# 1. Copy package files directly into a server directory
COPY server/package*.json ./server/

# 2. Switch the Docker context inside the server directory cleanl
WORKDIR /app/server
RUN npm install --production

# 3. Move back to the root app directory to copy the rest of the source
WORKDIR /app
COPY server/ ./server/

# Pull down the compiled static React build from Stage 1
COPY --from=frontend-build /app/dist ./dist

EXPOSE 80
ENV PORT=80

CMD ["node", "server/server.js"]