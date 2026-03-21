# ============================================
# Stage 1: Build frontend (React + Vite)
# ============================================

# Step 1: Build the React app
FROM node:20-alpine AS build

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./



# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Accept build arguments
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL

# Inject them as env variables during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the React app
RUN npm run build

# Step 2: Serve the build with nginx
FROM nginx:alpine

# Copy build files to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]