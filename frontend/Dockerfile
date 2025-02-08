# FROM node:18
FROM node:20-alpine

WORKDIR /app 

# COPY ./front-react/package.json ./front-react/package-lock.json ./
COPY ./front-react .
RUN npm install
RUN npm run build

EXPOSE 8080

# Dev for auto rebuilt on file change
CMD [ "npm", "run", "dev" ]

# Prod
# CMD [ "npm", "start" ]
