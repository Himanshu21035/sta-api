FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -D typescript

COPY . .

RUN npm run build

EXPOSE 10000

ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
