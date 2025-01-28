# FROM node:alpine tester avec avantr last stable de node alpine :) 
FROM node:18
WORKDIR /app
COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
# COPY ./package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
