FROM node:18.16.1-alpine as builder

# Create app directory
WORKDIR /app

# copy dependency files
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:18.16.1-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/schema-generator ./schema-generator
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/setup.sh ./setup.sh

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
