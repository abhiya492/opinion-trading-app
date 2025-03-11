# Build stage for frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy backend files
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/src ./src
COPY --from=backend-build /app/backend/package*.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongodb:27017/opinion-trading

EXPOSE 3000

CMD ["npm", "start"]