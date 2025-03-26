FROM node:lts-alpine3.20
WORKDIR "/app"
COPY ./package.json ./
RUN npm install --omit=dev
COPY . .
CMD ["npm", "run", "start"]