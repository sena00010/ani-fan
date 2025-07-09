FROM node:18 AS builder

WORKDIR /app

# 1. package.json ve lock dosyaları
COPY package*.json ./

# 2. dependecies
RUN npm ci

# 3. tüm proje dosyaları
COPY . .

# ✅ Tailwind için GEREKLİ olan config dosyalarını ekle
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY ./app/globals.css ./app/globals.css

# 4. build
RUN npm run build

FROM node:18 AS runner

WORKDIR /app
ENV NODE_ENV=production

# ✅ next.js build + public + node_modules
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/app ./app
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/postcss.config.js ./

EXPOSE 3000

CMD ["npm", "run", "start"]
