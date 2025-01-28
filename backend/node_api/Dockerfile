FROM node:23.6-alpine
WORKDIR /app
COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
# COPY ./package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
