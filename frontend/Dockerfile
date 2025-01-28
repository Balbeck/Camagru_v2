FROM node:18

WORKDIR /app 

# COPY ./front-react/package.json ./front-react/package-lock.json ./
COPY ./front-react .
RUN npm install
RUN npm run build

EXPOSE 3000

# Dev for auto rebuilt on file change
CMD [ "npm", "run", "dev" ]

# Prod
# CMD [ "npm", "start" ]
