FROM node:19.9.0

WORKDIR /app

COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
# RUN npm install nodemon --save-dev
RUN npm install

COPY . .

EXPOSE 3000

# Modif package.json poru enlever le script start a la fin du Dev
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
