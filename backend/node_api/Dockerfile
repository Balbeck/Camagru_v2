FROM node:23.6-alpine3.2.0
WORKDIR /app
COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
# COPY ./package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
