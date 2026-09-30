FROM node:20-alpine

WORKDIR /app

# Copy agent package files
COPY desktop-agent/package*.json ./desktop-agent/
RUN cd desktop-agent && npm ci --only=production

# Copy agent and UI code
COPY desktop-agent ./desktop-agent
COPY desktop-ui ./desktop-ui

WORKDIR /app/desktop-agent

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
