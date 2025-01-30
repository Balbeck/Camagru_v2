FROM node:22.13.1
WORKDIR /app
COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
