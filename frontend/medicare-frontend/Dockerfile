# Dockerfile para Frontend (producción)
FROM node:18-alpine

# Instala dependencias necesarias para compilar paquetes nativos
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN rm -f package-lock.json
RUN npm install 
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

