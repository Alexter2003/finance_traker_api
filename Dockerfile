FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build
RUN ls -la dist/src/main.js || (echo "Build failed - main.js not found" && exit 1)

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
