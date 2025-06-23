FROM node:19.9.0

WORKDIR /app

COPY ./package.json .
COPY ./nodemon.json .
COPY ./tsconfig.json .
COPY . .

RUN npm install --save-dev nodemon
RUN npm install --save-dev ts-node
RUN npm install

EXPOSE 3000

# Modif package.json poru enlever le script start a la fin du Dev
CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
